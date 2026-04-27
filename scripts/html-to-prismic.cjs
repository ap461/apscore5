#!/usr/bin/env node
// scripts/html-to-prismic.cjs
//
// Pipeline: staging HTML  →  Prismic `course_pillar_page` document
//
//   1. loadSchema()   — read custom type + slice models from disk.
//   2. parseHTML()    — cheerio-split by <section id="…"> and extract <head> SEO.
//   3. mapToSlices()  — per slice, send (schema + section HTML) to Claude for JSON.
//   4. validate()     — check every document field matches its schema's shape.
//   5. migrate()      — dry-run writes migration-output.json; --write POSTs.
//
// Usage:
//   node scripts/html-to-prismic.cjs <html-file> <course-uid> [--write]
//
// Env (.env.local):
//   ANTHROPIC_API_KEY     required
//   PRISMIC_WRITE_TOKEN   required only with --write
//
// Outputs:
//   migration-output.json   document that would be (or was) POSTed
//   migration-log.json      request + response record (write mode only)

const path = require("node:path");
const { readFile, writeFile, readdir } = require("node:fs/promises");
const { existsSync } = require("node:fs");
const cheerio = require("cheerio");
const Anthropic = require("@anthropic-ai/sdk").default || require("@anthropic-ai/sdk");
require("dotenv").config({ path: ".env.local" });

const ROOT = process.cwd();
const REPOSITORY = "apscore5";
const MODEL_ID = "claude-opus-4-7";
const LANG = "en-us";
const CUSTOM_TYPE = "course_pillar_page";

const argv = process.argv.slice(2);
const WRITE = argv.includes("--write");
const POSITIONAL = argv.filter((a) => !a.startsWith("--"));
const [HTML_FILE, COURSE_UID] = POSITIONAL;

// ───────────────────────────────────────────────────────────────
// Slice-id → section-slug hints. Add entries as new pillar pages ship.
// Lookup falls back to slice-id token matching if no override hits.
// ───────────────────────────────────────────────────────────────
const SLUG_HINTS = {
  pillar_hero: ["top", "hero"],
  quick_answer: ["aeo", "quick-answer", "tldr", "quick"],
  difficulty_section: ["is-it-hard", "difficulty", "how-hard"],
  exam_structure: ["exam-structure", "exam"],
  diagnostic_quiz: ["diagnostic"],
  video_embed: ["interactive", "video", "overview-video"],
  unit_cards_grid: ["units", "course-roadmap"],
  conversion_block: ["convert", "conversion", "signup"],
  unit_question_bank: ["practice", "question-bank"],
  study_strategy: ["strategy", "study-strategy"],
  flashcard_carousel: ["flashcards", "vocab"],
  faq_accordion: ["faq", "faqs"],
};

const STOP_TOKENS = new Set([
  "section", "block", "grid", "accordion", "embed", "bank", "carousel",
]);

const hr = (s) => console.log(`\n${"─".repeat(72)}\n${s}\n${"─".repeat(72)}`);

// ───────────────────────────────────────────────────────────────
// Phase 1 — schema loader
// ───────────────────────────────────────────────────────────────
async function loadSchema(customTypeId) {
  const ctPath = path.join(ROOT, "customtypes", customTypeId, "index.json");
  if (!existsSync(ctPath)) throw new Error(`Custom type not found: ${ctPath}`);
  const ct = JSON.parse(await readFile(ctPath, "utf8"));
  const tabs = ct.json || {};

  const docFields = [];
  let sliceChoices = {};
  for (const tabFields of Object.values(tabs)) {
    for (const [name, def] of Object.entries(tabFields)) {
      if (def.type === "UID") continue;
      if (def.type === "Slices") {
        sliceChoices = def.config?.choices || {};
        continue;
      }
      docFields.push({ name, type: def.type, config: def.config || {} });
    }
  }

  const slicesDir = path.join(ROOT, "slices");
  const sliceById = {};
  for (const entry of await readdir(slicesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const modelPath = path.join(slicesDir, entry.name, "model.json");
    if (!existsSync(modelPath)) continue;
    const model = JSON.parse(await readFile(modelPath, "utf8"));
    sliceById[model.id] = { dirName: entry.name, model };
  }

  const slices = [];
  for (const choiceId of Object.keys(sliceChoices)) {
    const found = sliceById[choiceId];
    if (!found) {
      console.warn(`  ! slice "${choiceId}" in zone but no local model.json — skipping`);
      continue;
    }
    const v = found.model.variations[0];
    slices.push({
      id: found.model.id,
      name: found.model.name,
      description: found.model.description || "",
      variation: v.id,
      version: v.version || "initial",
      primaryFields: normalizeFields(v.primary || {}),
      itemsFields: normalizeFields(v.items || {}),
    });
  }

  return { docFields, slices };
}

function normalizeFields(fieldMap) {
  return Object.entries(fieldMap).map(([name, def]) => {
    const rec = { name, type: def.type, config: def.config || {} };
    if (def.type === "Group") {
      rec.fields = normalizeFields(def.config?.fields || {});
    }
    if (def.type === "StructuredText") {
      rec.rtMode = def.config?.single ? "single" : "multi";
      rec.rtAllowed = def.config?.single || def.config?.multi || "";
    }
    if (def.type === "Select") {
      rec.options = def.config?.options || [];
    }
    return rec;
  });
}

// ───────────────────────────────────────────────────────────────
// Phase 2 — HTML parser
// ───────────────────────────────────────────────────────────────
async function parseHTML(htmlPath) {
  const html = await readFile(htmlPath, "utf8");
  const $ = cheerio.load(html, { xml: false });

  const seo = {
    title: ($("title").first().text() || "").trim(),
    description: $('meta[name="description"]').attr("content") || "",
    canonical: $('link[rel="canonical"]').attr("href") || "",
    og_title: $('meta[property="og:title"]').attr("content") || "",
    og_description: $('meta[property="og:description"]').attr("content") || "",
    og_image: $('meta[property="og:image"]').attr("content") || "",
    og_image_alt: $('meta[property="og:image:alt"]').attr("content") || "",
    og_image_width: parseInt($('meta[property="og:image:width"]').attr("content") || "1200", 10),
    og_image_height: parseInt($('meta[property="og:image:height"]').attr("content") || "628", 10),
  };

  const sections = [];

  // Primary mode: <section id="…"> blocks.
  $("section[id]").each((_, el) => {
    const $el = $(el);
    const slug = ($el.attr("id") || "").trim();
    if (!slug) return;
    const headline = ($el.find("h1, h2, h3").first().text() || "").trim();
    const commentLabel = findPrecedingComment(el);
    sections.push({
      slug,
      commentLabel,
      headline,
      html: $.html($el),
      text: $el.text().replace(/\s+/g, " ").trim(),
    });
  });

  // Fallback: <!-- SECTION NAME --> comment-bounded top-level blocks.
  if (sections.length === 0) {
    const body = $("body")[0] || $.root()[0];
    let currentSlug = null;
    let currentComment = null;
    let bufferHtml = [];
    const flush = () => {
      if (!currentSlug || bufferHtml.length === 0) return;
      const bundled = `<section id="${currentSlug}">${bufferHtml.join("")}</section>`;
      const $sec = cheerio.load(bundled)("section");
      sections.push({
        slug: currentSlug,
        commentLabel: currentComment,
        headline: ($sec.find("h1, h2, h3").first().text() || "").trim(),
        html: bundled,
        text: $sec.text().replace(/\s+/g, " ").trim(),
      });
    };
    for (const node of body.children || []) {
      if (node.type === "comment") {
        const m = /^\s*SECTION\s+(.+?)\s*$/i.exec(node.data || "");
        if (m) {
          flush();
          currentSlug = m[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          currentComment = node.data.trim();
          bufferHtml = [];
          continue;
        }
      }
      if (currentSlug) bufferHtml.push($.html(node));
    }
    flush();
  }

  return { seo, sections };
}

function findPrecedingComment(el) {
  let node = el.prev;
  while (node && node.type === "text" && !/\S/.test(node.data || "")) node = node.prev;
  if (node && node.type === "comment") return (node.data || "").trim();
  return null;
}

// ───────────────────────────────────────────────────────────────
// Phase 3 — mapper (HTML section → slice JSON via Claude)
// ───────────────────────────────────────────────────────────────
function findSection(slice, sections) {
  const explicit = SLUG_HINTS[slice.id] || [];
  const tokenized = slice.id.split("_").filter((t) => !STOP_TOKENS.has(t));
  const candidates = [...explicit, ...tokenized];
  for (const c of candidates) {
    const needle = c.toLowerCase();
    const hit = sections.find((s) => {
      const slug = (s.slug || "").toLowerCase();
      const label = (s.commentLabel || "").toLowerCase();
      return slug === needle || slug.includes(needle) || label.includes(needle);
    });
    if (hit) return hit;
  }
  return null;
}

function prettyField(f) {
  const out = { name: f.name, type: f.type };
  if (f.type === "StructuredText") out.formatting = `${f.rtMode}: ${f.rtAllowed}`;
  if (f.type === "Select") out.options = f.options;
  if (f.type === "Group") out.fields = f.fields.map(prettyField);
  return out;
}

const MAPPER_SYSTEM = `You translate HTML into Prismic's JSON document shape.

Given a slice's field schema and an HTML section, return ONLY a JSON object with keys "primary" and "items".

Rules:
- No prose, no markdown fences. JSON only.
- "items" is an array (use [] when the slice has no items schema).
- Text field → plain string.
- StructuredText field → array of blocks, each { "type": "<blockType>", "text": "…", "spans": [ … ] }.
  - blockType is one of: "paragraph", "heading1", "heading2", "heading3", "heading4", "heading5", "heading6", "list-item", "o-list-item".
  - spans: { "start": n, "end": n, "type": "strong" | "em" | "hyperlink", "data": { "url": "…" } for hyperlinks }.
  - If schema says "single: heading2,em" emit ONE block of that heading type — do NOT emit paragraph.
  - If schema says "multi: list-item,…" emit one block per bullet.
- Link field → { "link_type": "Web", "url": "…" } if URL inferable, else { "link_type": "Any" }.
- Boolean field → true / false.
- Select field → one of the provided option strings (closest match).
- Number field → number, not string.
- Group field → array of row objects.
- Every schema field MUST appear in the output. If you can't infer a value, emit the typed empty default (string: "", StructuredText: [], Link: {link_type:"Any"}, Number: 0, Boolean: false, Select: first option, Group: []).
`;

async function mapSliceWithLLM(slice, section, anthropic) {
  const schemaForPrompt = {
    slice_id: slice.id,
    slice_name: slice.name,
    description: slice.description,
    primary: slice.primaryFields.map(prettyField),
    items: slice.itemsFields.map(prettyField),
  };
  const cappedHtml =
    section.html.length > 100_000 ? section.html.slice(0, 100_000) + "\n<!-- truncated -->" : section.html;

  const userContent =
    JSON.stringify({ schema: schemaForPrompt, html: cappedHtml }) +
    "\n\nRespond with JSON only.";

  const res = await anthropic.messages.create({
    model: MODEL_ID,
    max_tokens: 16384,
    system: MAPPER_SYSTEM,
    messages: [{ role: "user", content: userContent }],
  });
  const text = (res.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  return extractJson(text);
}

function extractJson(text) {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`LLM response contains no JSON object. First 200 chars: ${text.slice(0, 200)}`);
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function inferCourseName(seoTitle, uid) {
  const m = /^(AP\s+[A-Za-z0-9 /&\-.]+?)\s+(?:Course|Guide|Exam|Review|—|[:|])/.exec(seoTitle || "");
  if (m) return m[1].trim();
  return (uid || "")
    .split("-")
    .map((w) => (w.toLowerCase() === "ap" ? "AP" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

async function mapToSlices(parsed, schema, anthropic, uid) {
  const emitted = [];
  const warnings = [];

  for (const slice of schema.slices) {
    const section = findSection(slice, parsed.sections);
    if (!section) {
      warnings.push(`no HTML section matched slice "${slice.id}" — skipped`);
      continue;
    }
    const label = section.headline ? ` ("${section.headline.slice(0, 60)}")` : "";
    console.log(`  • ${slice.id.padEnd(22)} ← #${section.slug}${label}`);
    try {
      const mapped = await mapSliceWithLLM(slice, section, anthropic);
      emitted.push({
        slice_type: slice.id,
        slice_label: null,
        variation: slice.variation,
        version: slice.version,
        primary: mapped.primary || {},
        items: Array.isArray(mapped.items) ? mapped.items : [],
      });
    } catch (err) {
      warnings.push(`LLM mapping failed for "${slice.id}": ${err.message}`);
    }
  }

  const seo = parsed.seo;
  const docFieldValues = {
    course_name: inferCourseName(seo.title, uid),
    meta_title: seo.title,
    meta_description: seo.description,
    canonical_url: seo.canonical ? { link_type: "Web", url: seo.canonical } : { link_type: "Any" },
    og_image: seo.og_image
      ? {
          url: seo.og_image,
          alt: seo.og_image_alt || null,
          dimensions: { width: seo.og_image_width, height: seo.og_image_height },
        }
      : {},
    no_index: false,
  };

  // Only include fields the schema actually declares (future-proof against SEO tab changes).
  const data = {};
  for (const f of schema.docFields) {
    if (docFieldValues[f.name] !== undefined) data[f.name] = docFieldValues[f.name];
    else data[f.name] = defaultForField(f);
  }
  data.slices = emitted;

  return {
    document: { type: CUSTOM_TYPE, uid, lang: LANG, data },
    warnings,
  };
}

function defaultForField(f) {
  switch (f.type) {
    case "Text":
    case "UID":
      return "";
    case "StructuredText":
      return [];
    case "Link":
      return { link_type: "Any" };
    case "Image":
      return {};
    case "Boolean":
      return false;
    case "Number":
      return 0;
    case "Select":
      return f.options?.[0] || "";
    case "Group":
      return [];
    default:
      return null;
  }
}

// ───────────────────────────────────────────────────────────────
// Phase 4 — validator
// ───────────────────────────────────────────────────────────────
function validate(document, schema) {
  const errors = [];
  const data = document.data || {};

  for (const f of schema.docFields) {
    const p = `data.${f.name}`;
    if (data[f.name] === undefined) {
      errors.push(`${p}: missing`);
      continue;
    }
    checkFieldShape(data[f.name], f, p, errors);
  }

  const byId = new Map(schema.slices.map((s) => [s.id, s]));
  const emittedSlices = Array.isArray(data.slices) ? data.slices : [];
  for (let i = 0; i < emittedSlices.length; i++) {
    const emitted = emittedSlices[i];
    const schemaSlice = byId.get(emitted.slice_type);
    if (!schemaSlice) {
      errors.push(`data.slices[${i}].slice_type "${emitted.slice_type}" is not in the slice zone`);
      continue;
    }
    const sPath = `data.slices[${i}] (${emitted.slice_type})`;

    for (const f of schemaSlice.primaryFields) {
      const p = `${sPath}.primary.${f.name}`;
      const v = (emitted.primary || {})[f.name];
      if (v === undefined) {
        errors.push(`${p}: missing`);
        continue;
      }
      checkFieldShape(v, f, p, errors);
    }

    if (schemaSlice.itemsFields.length > 0) {
      if (!Array.isArray(emitted.items)) {
        errors.push(`${sPath}.items: expected array`);
      } else {
        for (let j = 0; j < emitted.items.length; j++) {
          for (const f of schemaSlice.itemsFields) {
            const p = `${sPath}.items[${j}].${f.name}`;
            const v = emitted.items[j][f.name];
            if (v === undefined) {
              errors.push(`${p}: missing`);
              continue;
            }
            checkFieldShape(v, f, p, errors);
          }
        }
      }
    }
  }

  return errors;
}

function checkFieldShape(val, field, p, errors) {
  switch (field.type) {
    case "Text":
    case "UID":
      if (typeof val !== "string") errors.push(`${p}: expected string, got ${typeOf(val)}`);
      break;
    case "Number":
      if (typeof val !== "number") errors.push(`${p}: expected number, got ${typeOf(val)}`);
      break;
    case "Boolean":
      if (typeof val !== "boolean") errors.push(`${p}: expected boolean, got ${typeOf(val)}`);
      break;
    case "Select":
      if (typeof val !== "string") {
        errors.push(`${p}: expected string (Select), got ${typeOf(val)}`);
      } else if (field.options?.length && val !== "" && !field.options.includes(val)) {
        errors.push(`${p}: "${val}" not in ${JSON.stringify(field.options)}`);
      }
      break;
    case "StructuredText":
      if (!Array.isArray(val)) {
        errors.push(`${p}: expected rich text array, got ${typeOf(val)}`);
      } else {
        val.forEach((block, i) => {
          if (!block || typeof block !== "object" || typeof block.type !== "string" || typeof block.text !== "string") {
            errors.push(`${p}[${i}]: malformed rich-text block — must be {type, text, spans}`);
          }
          if (block && block.spans !== undefined && !Array.isArray(block.spans)) {
            errors.push(`${p}[${i}].spans: expected array`);
          }
        });
      }
      break;
    case "Link":
      if (!val || typeof val !== "object" || typeof val.link_type !== "string") {
        errors.push(`${p}: expected link object with link_type, got ${typeOf(val)}`);
      }
      break;
    case "Image":
      if (val !== null && typeof val !== "object") {
        errors.push(`${p}: expected image object, got ${typeOf(val)}`);
      }
      break;
    case "Group":
      if (!Array.isArray(val)) {
        errors.push(`${p}: expected Group array, got ${typeOf(val)}`);
      } else {
        val.forEach((row, i) => {
          if (!row || typeof row !== "object") {
            errors.push(`${p}[${i}]: expected object`);
            return;
          }
          for (const sub of field.fields) {
            const sp = `${p}[${i}].${sub.name}`;
            if (row[sub.name] === undefined) {
              errors.push(`${sp}: missing`);
              continue;
            }
            checkFieldShape(row[sub.name], sub, sp, errors);
          }
        });
      }
      break;
    default:
      break;
  }
}

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

// ───────────────────────────────────────────────────────────────
// Phase 5 — migrator
// ───────────────────────────────────────────────────────────────
async function migrate(document) {
  const outPath = path.join(ROOT, "migration-output.json");
  await writeFile(outPath, JSON.stringify(document, null, 2) + "\n");

  if (!WRITE) {
    console.log(`\n  Dry run — wrote ${path.relative(ROOT, outPath)}`);
    console.log(`  Document summary:`);
    console.log(`    type:   ${document.type}`);
    console.log(`    uid:    ${document.uid}`);
    console.log(`    lang:   ${document.lang}`);
    console.log(`    slices: ${document.data.slices.length} (${document.data.slices.map((s) => s.slice_type).join(", ")})`);
    console.log(`\n  Re-run with --write to POST to Prismic.`);
    return;
  }

  const token = process.env.PRISMIC_WRITE_TOKEN;
  if (!token) throw new Error("PRISMIC_WRITE_TOKEN missing from .env.local");

  const url = "https://migration.prismic.io/documents";
  let response;
  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        repository: REPOSITORY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    });
    if (response.status !== 429) break;
    console.warn(`  429 rate-limited (attempt ${attempt}/3). Sleeping 1s…`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  const bodyText = await response.text();
  const parsed = safeJson(bodyText);
  const log = {
    request: { url, headers_summary: { repository: REPOSITORY }, document },
    response: { status: response.status, statusText: response.statusText, body: parsed ?? bodyText },
  };
  await writeFile(path.join(ROOT, "migration-log.json"), JSON.stringify(log, null, 2) + "\n");
  console.log(`  Prismic responded ${response.status} ${response.statusText}. Log → migration-log.json`);
  if (!response.ok) process.exit(1);
}

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// main
// ───────────────────────────────────────────────────────────────
(async () => {
  if (!HTML_FILE || !COURSE_UID) {
    console.error("Usage: node scripts/html-to-prismic.cjs <html-file> <course-uid> [--write]");
    process.exit(1);
  }
  if (!existsSync(HTML_FILE)) {
    console.error(`HTML file not found: ${HTML_FILE}`);
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY missing from .env.local");
    process.exit(1);
  }

  hr(`html-to-prismic  ${WRITE ? "·  WRITE MODE" : "·  dry run"}`);
  console.log(`  html file:   ${HTML_FILE}`);
  console.log(`  course uid:  ${COURSE_UID}`);
  console.log(`  custom type: ${CUSTOM_TYPE}`);
  console.log(`  model:       ${MODEL_ID}`);

  hr("Phase 1 · Loading schema");
  const schema = await loadSchema(CUSTOM_TYPE);
  console.log(`  doc-level fields: ${schema.docFields.length}`);
  console.log(`  slice-zone slices: ${schema.slices.length}`);
  for (const s of schema.slices) {
    console.log(`    · ${s.id.padEnd(22)} primary=${s.primaryFields.length} items=${s.itemsFields.length}`);
  }

  hr("Phase 2 · Parsing HTML");
  const parsed = await parseHTML(HTML_FILE);
  console.log(`  <title>:        ${parsed.seo.title.slice(0, 80)}`);
  console.log(`  canonical:      ${parsed.seo.canonical || "(none)"}`);
  console.log(`  sections found: ${parsed.sections.length}`);
  for (const s of parsed.sections) {
    console.log(`    · #${s.slug.padEnd(22)} ${s.headline ? `"${s.headline.slice(0, 50)}"` : ""}`);
  }

  hr("Phase 3 · Mapping sections → slices via Claude");
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const { document, warnings } = await mapToSlices(parsed, schema, anthropic, COURSE_UID);
  if (warnings.length) {
    console.log(`\n  Warnings:`);
    warnings.forEach((w) => console.log(`    ! ${w}`));
  }

  hr("Phase 4 · Validating document");
  const errors = validate(document, schema);
  if (errors.length) {
    console.error(`  VALIDATION FAILED (${errors.length} error(s)):`);
    errors.forEach((e) => console.error(`    ✗ ${e}`));
    await writeFile(path.join(ROOT, "migration-output.json"), JSON.stringify(document, null, 2) + "\n");
    console.error(`\n  migration-output.json written anyway for inspection.`);
    process.exit(1);
  }
  console.log(`  OK — ${schema.docFields.length} doc field(s), ${document.data.slices.length} slice(s)`);

  hr(WRITE ? "Phase 5 · POSTing to Prismic Migration API" : "Phase 5 · Dry-run write");
  await migrate(document);
})().catch((err) => {
  console.error("\nFATAL:", err.stack || err.message || err);
  process.exit(1);
});
