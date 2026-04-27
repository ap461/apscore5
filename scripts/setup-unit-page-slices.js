#!/usr/bin/env node
/**
 * APScore5 — Unit Page Slice Setup Script (single-file edition)
 * --------------------------------------------------------------
 * Drop this file in a folder that also contains a .env file with:
 *   PRISMIC_REPO=apscore5
 *   PRISMIC_TOKEN=your-custom-types-api-token
 *
 * Then run ONE of:
 *   node setup-unit-page-slices.js --check                              # inspect, no changes
 *   node setup-unit-page-slices.js --push --include-customtype --dry-run # preview the push
 *   node setup-unit-page-slices.js --push --include-customtype          # do it for real
 *
 * No npm install required — uses only Node built-ins (requires Node 18+).
 *
 * The script automatically loads .env from the current directory.
 *
 * Skipped (already exist in your repo, reused as-is on unit_page):
 *   - video_embed
 *   - flashcard_carousel
 *   - conversion_block
 */

const fs = require("node:fs");
const path = require("node:path");

// ─────────────────────────────────────────────────────────────────────────────
// Auto-load .env from cwd or the script's directory (no dotenv dependency)
// ─────────────────────────────────────────────────────────────────────────────

function loadDotEnv() {
  const candidates = [
    path.join(process.cwd(), ".env"),
    path.join(process.cwd(), ".env.local"),
    path.join(__dirname, ".env"),
  ];
  const loadedKeys = [];
  let loadedFile = null;
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let value = m[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(m[1] in process.env)) process.env[m[1]] = value;
      loadedKeys.push(m[1]);
    }
    loadedFile = file;
    break;
  }
  return { loadedFile, loadedKeys };
}

const _env = loadDotEnv();
const _envFile = _env.loadedFile;
const _envKeys = _env.loadedKeys;

// Map common alternative names to the canonical PRISMIC_REPO / PRISMIC_TOKEN.
// This is why your .env may have worked for Slice Machine or @prismicio/client
// but not for this script — different libraries use different conventions.
const ENV_ALIASES = {
  PRISMIC_REPO: [
    "PRISMIC_REPOSITORY",
    "PRISMIC_REPO_NAME",
    "PRISMIC_ENVIRONMENT",
    "NEXT_PUBLIC_PRISMIC_REPO",
    "NEXT_PUBLIC_PRISMIC_REPOSITORY",
    "NEXT_PUBLIC_PRISMIC_ENVIRONMENT",
  ],
  PRISMIC_TOKEN: [
    "PRISMIC_CUSTOM_TYPES_TOKEN",
    "PRISMIC_CT_TOKEN",
    "PRISMIC_API_TOKEN",
    "PRISMIC_ACCESS_TOKEN",
    "PRISMIC_API_KEY",
    "PRISMIC_WRITE_TOKEN",
    "PRISMIC_MIGRATION_TOKEN", // works only if it has Custom Types API access — see error message
  ],
};

const _aliasesUsed = [];
for (const [canonical, aliases] of Object.entries(ENV_ALIASES)) {
  if (process.env[canonical]) continue;
  for (const alias of aliases) {
    if (process.env[alias]) {
      process.env[canonical] = process.env[alias];
      _aliasesUsed.push(`${alias} → ${canonical}`);
      break;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Field-builder helpers — produce Slice Machine-compatible field definitions
// ─────────────────────────────────────────────────────────────────────────────

const text = (label, placeholder = "") => ({
  type: "Text",
  config: { label, placeholder },
});

const number = (label) => ({
  type: "Number",
  config: { label, placeholder: "" },
});

const boolean = (label, defaultValue = false) => ({
  type: "Boolean",
  config: {
    label,
    placeholder_false: "false",
    placeholder_true: "true",
    default_value: defaultValue,
  },
});

const select = (label, options, defaultValue = null) => ({
  type: "Select",
  config: {
    label,
    placeholder: "",
    options,
    ...(defaultValue ? { default_value: defaultValue } : {}),
  },
});

const image = (label) => ({
  type: "Image",
  config: { label, constraint: {}, thumbnails: [] },
});

const color = (label) => ({
  type: "Color",
  config: { label, placeholder: "" },
});

// StructuredText — `single` is comma-separated allowed types for a one-block field;
// `multi` for multi-block. Always allow strong+em+hyperlink unless the slice is a heading.
const richSingle = (label, allowed) => ({
  type: "StructuredText",
  config: {
    label,
    placeholder: "",
    allowTargetBlank: true,
    single: allowed,
  },
});

const richMulti = (label, allowed = "paragraph,strong,em,hyperlink") => ({
  type: "StructuredText",
  config: {
    label,
    placeholder: "",
    allowTargetBlank: true,
    multi: allowed,
  },
});

// Link — `select` may be "document", "web", "media", or null
const link = (label, opts = {}) => ({
  type: "Link",
  config: {
    label,
    placeholder: "",
    select: opts.select ?? null,
    allowTargetBlank: true,
    ...(opts.customtypes ? { customtypes: opts.customtypes } : {}),
  },
});

// Slice envelope helper — wraps primary/items into a SharedSlice with a "default" variation
function slice({ id, name, description, primary = {}, items = {} }) {
  return {
    id,
    type: "SharedSlice",
    name,
    description,
    variations: [
      {
        id: "default",
        name: "Default",
        docURL: "...",
        version: "initial",
        description: "Default",
        imageUrl: "",
        primary,
        items,
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 1 — unit_hero (generates the page's only H1)
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_HERO = slice({
  id: "unit_hero",
  name: "UnitHero",
  description:
    "Top-of-page hero for unit pages. Generates the only H1 on the page. Holds breadcrumb back to course pillar, unit kicker pill, headline (H1), subheadline, theme tags, two CTAs, and a 4-stat strip.",
  primary: {
    breadcrumb_course_label: text("Breadcrumb: course label", "AP Human Geography"),
    breadcrumb_course_link: link("Breadcrumb: course link", {
      select: "document",
      customtypes: ["course_pillar_page"],
    }),
    unit_kicker: text("Unit kicker (pill)", "Unit 1 of 7 · 8–10% of Exam"),
    headline: richSingle("Headline (H1)", "heading1,em,strong"),
    subheadline: richMulti("Subheadline", "paragraph,strong,em"),
    unit_tags: richMulti("Unit theme tags (bulleted list)", "list-item"),
    primary_cta_text: text("Primary CTA text", "Practice Questions →"),
    primary_cta_link: link("Primary CTA link"),
    secondary_cta_text: text("Secondary CTA text", "Read the guide"),
    secondary_cta_link: link("Secondary CTA link"),
  },
  items: {
    stat_number: text("Stat number", "8–10%"),
    stat_label: text("Stat label", "of AP exam"),
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 2 — progress_bar (sticky strip; per-user state read from Supabase)
// ─────────────────────────────────────────────────────────────────────────────

const PROGRESS_BAR = slice({
  id: "progress_bar",
  name: "ProgressBar",
  description:
    "Sticky-under-nav progress strip. Guests see static gate copy with signup CTA. Logged-in users see live percent driven by component state. No editable items — progress data is read from Supabase per user.",
  primary: {
    guest_label: text(
      "Guest label",
      "Create a free account to track your Unit progress"
    ),
    guest_cta_text: text("Guest CTA text", "Sign up free →"),
    guest_cta_link: link("Guest CTA link"),
    member_label_template: text(
      "Logged-in label template (uses {pct} and {answered}/{total})",
      "Your progress · {pct}% complete"
    ),
  },
  items: {},
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 3 — unit_quick_answer (H3, AEO direct-answer block)
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_QUICK_ANSWER = slice({
  id: "unit_quick_answer",
  name: "UnitQuickAnswer",
  description:
    "AEO direct-answer block. Generates an H3 question heading with a 50–70 word direct answer, optional expansion paragraph, and a bullet list of key facts. Built to win position-zero snippets.",
  primary: {
    eyebrow: text("Eyebrow", "Quick answer"),
    headline: richSingle("Headline (H3 — the question)", "heading3,em,strong"),
    direct_answer: richSingle(
      "Direct answer (50–70 words, self-contained)",
      "paragraph,strong,em"
    ),
    expansion: richMulti("Expansion paragraph(s)"),
    key_facts: richMulti("Key facts (bulleted list)", "list-item,strong,em"),
  },
  items: {},
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 4 — unit_introduction (teacher voice, weekly refresh target)
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_INTRODUCTION = slice({
  id: "unit_introduction",
  name: "UnitIntroduction",
  description:
    "2–3 paragraph teacher-voiced intro. Opens with a hook, never a definition. The `body` field is the weekly-refresh target. `key_message` and `exam_tip` are stable callouts (monthly refresh only).",
  primary: {
    eyebrow: text("Eyebrow", "Unit introduction"),
    body: richMulti(
      "Body (2–3 paragraphs, weekly refresh)",
      "paragraph,strong,em,hyperlink"
    ),
    key_message: richSingle(
      "Key message callout (one paragraph)",
      "paragraph,strong,em"
    ),
    exam_tip: richSingle("Exam tip callout (one paragraph)", "paragraph,strong,em"),
  },
  items: {},
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 5 — concept_body (the spine — H2 + many H3 + H4 inside rich text)
// ─────────────────────────────────────────────────────────────────────────────
//
// NOTE ON GROUPS-IN-ITEMS: Prismic does NOT allow nested Group fields inside the
// `items` repeatable zone. The schema doc's `concept_cards` and `term_cards`
// nested groups are therefore implemented as a heading4 + list pattern inside
// `sub_section_body` rich text — the renderer detects this pattern and styles
// it as a card grid. Editors get a simple authoring experience, the validator
// can still count H4s, and the heading skeleton stays clean.

const CONCEPT_BODY = slice({
  id: "concept_body",
  name: "ConceptBody",
  description:
    "The spine of the unit page. Holds the only H2, sticky-TOC label, intro paragraph, and a repeatable list of sub-sections. Each sub-section item produces one H3 plus rich-text body that may contain H4s. Card grids are rendered from heading4 + list patterns inside sub_section_body.",
  primary: {
    eyebrow: text("Eyebrow", "Unit study guide"),
    headline: richSingle("Headline (H2 — the only one on the page)", "heading2,em,strong"),
    intro_paragraph: richMulti("Intro paragraph (between H2 and first H3)"),
    toc_label: text("TOC label", "On this page"),
    mid_page_paragraph: richMulti(
      "Mid-page paragraph (designated weekly-refresh target — keep non-empty)"
    ),
  },
  items: {
    sub_section_anchor: text("URL anchor (slug-style)", "geographic-perspective"),
    sub_section_heading: richSingle("Sub-section heading (H3)", "heading3,em,strong"),
    sub_section_body: richMulti(
      "Sub-section body (H4s allowed)",
      "paragraph,heading4,list-item,o-list-item,strong,em,hyperlink"
    ),
    inline_image: image("Inline image (optional, top of section)"),
    inline_image_caption: text("Inline image caption"),
    callout_type: select(
      "Callout type",
      ["none", "key_message", "exam_tip", "common_mistake"],
      "none"
    ),
    callout_body: richMulti("Callout body (used when callout_type ≠ none)"),
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 6 — real_world_image (repeatable, anchor_after hints placement)
// ─────────────────────────────────────────────────────────────────────────────

const REAL_WORLD_IMAGE = slice({
  id: "real_world_image",
  name: "RealWorldImage",
  description:
    "Banner / contextual image slice. Repeatable on the page. Use anchor_after to hint which concept_body sub-section this image renders after. SEO rules: filename must contain unit slug, alt text 8–16 words.",
  primary: {
    eyebrow: text("Eyebrow (optional)", "Real world"),
    image: image("Image"),
    caption: richMulti("Caption", "paragraph,strong,em,hyperlink"),
    image_credit: text("Image credit (optional)"),
    anchor_after: select(
      "Anchor after (which sub-section)",
      ["intro", "perspective", "vocabulary", "maps", "diffusion", "scale", "end"],
      "intro"
    ),
  },
  items: {},
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 7 — topic_links_list (H3, down-links to topic pages)
// ─────────────────────────────────────────────────────────────────────────────

const TOPIC_LINKS_LIST = slice({
  id: "topic_links_list",
  name: "TopicLinksList",
  description:
    "Two-column list of every topic page in this unit. Anchor text must read like a search query (SEO discipline) — not 'read more'. is_high_yield surfaces a badge in the UI.",
  primary: {
    eyebrow: text("Eyebrow", "Deep-dives"),
    headline: richSingle("Headline (H3)", "heading3,em,strong"),
    lede: richSingle("Lede (optional)", "paragraph,strong,em"),
  },
  items: {
    topic_page_link: link("Topic page link", {
      select: "document",
      customtypes: ["topic_page"],
    }),
    anchor_text: text(
      "Anchor text (SEO-distinct override of topic title)",
      "Map projections and distortions on the AP exam"
    ),
    topic_one_liner: text("One-liner shown under anchor"),
    is_high_yield: boolean("High-yield badge"),
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 8 — unit_recap_quiz (H3 + 3× H4 difficulty bands; 65–80 questions)
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_RECAP_QUIZ = slice({
  id: "unit_recap_quiz",
  name: "UnitRecapQuiz",
  description:
    "Recap quiz spanning Easy → Medium → Hard. Generates one H3 plus three H4 band labels. Component enforces: ad after every 2 answers, video ad at band transitions, gate to signup for full results. Items hold 65–80 questions sorted by `difficulty`.",
  primary: {
    eyebrow: text("Eyebrow", "Mastery check"),
    headline: richSingle("Headline (H3)", "heading3,em,strong"),
    lede: richSingle("Lede", "paragraph,strong,em"),
    easy_band_heading: text("Easy band heading (H4)", "Easy"),
    medium_band_heading: text("Medium band heading (H4)", "Medium"),
    hard_band_heading: text("Hard band heading (H4)", "Hard"),
    gate_heading: text("Gate heading", "Want your full Unit score report?"),
    gate_body: richMulti("Gate body", "paragraph,strong,em"),
    gate_cta_text: text("Gate CTA text", "Create a free account →"),
    gate_cta_link: link("Gate CTA link"),
  },
  items: {
    question_number: number("Question number"),
    difficulty: select("Difficulty", ["easy", "medium", "hard"], "easy"),
    question_text: richMulti("Question text", "paragraph,strong,em"),
    stimulus_image: image("Stimulus image (optional)"),
    option_a: text("Option A"),
    option_b: text("Option B"),
    option_c: text("Option C"),
    option_d: text("Option D"),
    correct_answer: select("Correct answer", ["A", "B", "C", "D"], "A"),
    explanation: richMulti("Explanation", "paragraph,strong,em,hyperlink"),
    exam_tip_tag: text("Exam tip tag (one-liner, optional)"),
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 9 — unit_faq (H3 + H4 per question; FAQPage JSON-LD source)
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_FAQ = slice({
  id: "unit_faq",
  name: "UnitFaq",
  description:
    "Long FAQ section — bulk of unit word count. Each question becomes an H4 inside a native <details>/<summary> accordion. Component clusters by `category` and emits FAQPage JSON-LD. Validator enforces: first 2 sentences of `answer` contain the direct answer.",
  primary: {
    eyebrow: text("Eyebrow", "Frequently asked"),
    headline: richSingle("Headline (H3)", "heading3,em,strong"),
    lede: richSingle("Lede (optional)", "paragraph,strong,em"),
  },
  items: {
    category: select(
      "Category",
      [
        "Exam content",
        "Vocabulary",
        "Practice & study",
        "Test format",
        "Difficulty & scoring",
        "Outside the exam",
      ],
      "Exam content"
    ),
    question: text(
      "Question (becomes the H4)",
      "How many Unit 1 questions are on the AP exam?"
    ),
    answer: richMulti(
      "Answer (first 2 sentences must be the direct answer — AEO requirement)",
      "paragraph,strong,em,hyperlink,list-item"
    ),
    is_new_this_week: boolean("Marked as new this week"),
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 10 — next_unit_cta (H3, forward link)
// ─────────────────────────────────────────────────────────────────────────────

const NEXT_UNIT_CTA = slice({
  id: "next_unit_cta",
  name: "NextUnitCta",
  description:
    "Forward step in the sequential learning flow. Drops a card pointing to Unit N+1. On the last unit of a course, point next_unit_link back to the pillar's practice section.",
  primary: {
    eyebrow: text("Eyebrow", "Up next"),
    headline: richSingle("Headline (H3)", "heading3,em,strong"),
    next_unit_link: link("Next unit link", {
      select: "document",
      customtypes: ["unit_page"],
    }),
    next_unit_summary: text(
      "Next unit summary (one-liner)",
      "12–17% of exam · 210 questions · Malthus, DTM, push/pull"
    ),
    cta_text: text("CTA text", "Start Unit 2 →"),
  },
  items: {},
});

// ─────────────────────────────────────────────────────────────────────────────
// All NEW slices in slice-zone order
// ─────────────────────────────────────────────────────────────────────────────

const NEW_SLICES = [
  UNIT_HERO,
  PROGRESS_BAR,
  UNIT_QUICK_ANSWER,
  UNIT_INTRODUCTION,
  CONCEPT_BODY,
  REAL_WORLD_IMAGE,
  TOPIC_LINKS_LIST,
  UNIT_RECAP_QUIZ,
  UNIT_FAQ,
  NEXT_UNIT_CTA,
];

// Slices that already exist in the repo and are reused on unit_page (no model changes).
const REUSED_SLICES = ["video_embed", "flashcard_carousel", "conversion_block"];

// ─────────────────────────────────────────────────────────────────────────────
// unit_page custom type definition
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_PAGE_CUSTOMTYPE = {
  id: "unit_page",
  label: "Unit Page",
  repeatable: true,
  status: true,
  json: {
    Main: {
      uid: {
        type: "UID",
        config: {
          label: "UID",
          placeholder: "ap-human-geography-unit-1-thinking-geographically",
        },
      },
      parent_course: {
        type: "Link",
        config: {
          label: "Parent course",
          select: "document",
          customtypes: ["course_pillar_page"],
        },
      },
      unit_number: {
        type: "Number",
        config: { label: "Unit number", placeholder: "1" },
      },
      unit_slug: {
        type: "Text",
        config: { label: "Unit slug", placeholder: "thinking-geographically" },
      },
      unit_accent_color: {
        type: "Color",
        config: { label: "Unit accent color", placeholder: "#185FA5" },
      },
      slices: {
        type: "Slices",
        fieldset: "Slice zone",
        config: {
          choices: {
            // NEW slices
            unit_hero: { type: "SharedSlice" },
            progress_bar: { type: "SharedSlice" },
            unit_quick_answer: { type: "SharedSlice" },
            unit_introduction: { type: "SharedSlice" },
            concept_body: { type: "SharedSlice" },
            real_world_image: { type: "SharedSlice" },
            topic_links_list: { type: "SharedSlice" },
            unit_recap_quiz: { type: "SharedSlice" },
            unit_faq: { type: "SharedSlice" },
            next_unit_cta: { type: "SharedSlice" },
            // REUSED slices (already in your repo)
            video_embed: { type: "SharedSlice" },
            flashcard_carousel: { type: "SharedSlice" },
            conversion_block: { type: "SharedSlice" },
          },
        },
      },
    },
    "SEO & Metadata": {
      meta_title: {
        type: "Text",
        config: { label: "Meta title (≤ 60 chars)", placeholder: "" },
      },
      meta_description: {
        type: "Text",
        config: { label: "Meta description (140–160 chars)", placeholder: "" },
      },
      canonical_url: {
        type: "Link",
        config: { label: "Canonical URL", select: "web", placeholder: "" },
      },
      og_image: { type: "Image", config: { label: "OG image", constraint: {}, thumbnails: [] } },
      last_reviewed: {
        type: "Date",
        config: { label: "Last reviewed (auto-updated on weekly refresh)" },
      },
      no_index: {
        type: "Boolean",
        config: {
          label: "No index",
          placeholder_false: "false",
          placeholder_true: "true",
          default_value: false,
        },
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Writers
// ─────────────────────────────────────────────────────────────────────────────

function writeSlicesToDisk(rootDir = "slices") {
  let written = 0;
  for (const s of NEW_SLICES) {
    const dir = path.join(rootDir, s.name);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "model.json");
    fs.writeFileSync(file, JSON.stringify(s, null, 2));
    console.log(`  ✓ wrote ${file}`);
    written++;
  }
  return written;
}

function writeCustomTypeToDisk(rootDir = "customtypes") {
  const dir = path.join(rootDir, "unit_page");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "index.json");
  fs.writeFileSync(file, JSON.stringify(UNIT_PAGE_CUSTOMTYPE, null, 2));
  console.log(`  ✓ wrote ${file}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Pusher — uses the Prismic Custom Types API directly (no SDK, just fetch)
// Docs: https://prismic.io/docs/custom-types-api
// ─────────────────────────────────────────────────────────────────────────────

const CT_API_BASE = process.env.PRISMIC_CT_API_BASE || "https://customtypes.prismic.io";

async function api(method, pathname, body) {
  const repo = process.env.PRISMIC_REPO;
  const token = process.env.PRISMIC_TOKEN;
  if (!repo || !token) {
    throw new Error(
      "Missing PRISMIC_REPO or PRISMIC_TOKEN. Set them in your environment or .env file."
    );
  }
  const res = await fetch(`${CT_API_BASE}${pathname}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      repository: repo,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if ((res.status === 401 || res.status === 403) && !pathname.startsWith("/slices/") === false) {
    // Auth failure — give specific guidance about the Custom Types API token
  }
  if (res.status === 401 || res.status === 403) {
    const errBody = await res.text().catch(() => "");
    throw new Error(
      `Prismic auth failed (${res.status}) on ${method} ${pathname}.\n\n` +
        `  This script requires a CUSTOM TYPES API token, not a Migration API token.\n` +
        `  These are two separate tokens in Prismic with different permissions:\n\n` +
        `    • Migration API token  → writes document CONTENT\n` +
        `    • Custom Types API token → writes slice MODELS and custom types  ← what this script needs\n\n` +
        `  To create a Custom Types API token:\n` +
        `    1. Go to your Prismic dashboard → Settings → API & Security\n` +
        `    2. Scroll to "Custom Types API"\n` +
        `    3. Click "+ Create token", give it WRITE permission, copy the value\n` +
        `    4. Add to your .env:    PRISMIC_TOKEN=<the new token>\n` +
        `       (or rename your existing PRISMIC_MIGRATION_TOKEN line if you no longer need it)\n\n` +
        `  Server response: ${errBody || "(empty)"}`
    );
  }
  if (!res.ok && res.status !== 404) {
    const err = await res.text();
    throw new Error(`Prismic API ${method} ${pathname} → ${res.status}: ${err}`);
  }
  return res;
}

async function sliceExists(id) {
  const res = await api("GET", `/slices/${id}`);
  return res.status === 200;
}

async function customTypeExists(id) {
  const res = await api("GET", `/customtypes/${id}`);
  return res.status === 200;
}

async function upsertSlice(s) {
  const exists = await sliceExists(s.id);
  if (exists) {
    await api("POST", "/slices/update", s);
    return "updated";
  } else {
    await api("POST", "/slices/insert", s);
    return "inserted";
  }
}

async function upsertCustomType(ct) {
  const exists = await customTypeExists(ct.id);
  if (exists) {
    await api("POST", "/customtypes/update", ct);
    return "updated";
  } else {
    await api("POST", "/customtypes/insert", ct);
    return "inserted";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PREFLIGHT — verifies reused slices exist and warns on accidental overwrites
// ─────────────────────────────────────────────────────────────────────────────
//
// Two safety checks before any push:
//   1. REUSED slices (video_embed, flashcard_carousel, conversion_block) MUST
//      exist in the repo, otherwise the unit_page custom type's slice-zone
//      reference is dangling and the page renderer will break.
//   2. NEW slices SHOULD NOT already exist. If any do, that is either a re-run
//      (safe) or an ID collision with something else (dangerous). We require
//      explicit --force before overwriting in that case.

async function preflightCheck({ verbose = true } = {}) {
  if (verbose) console.log("Preflight: checking Prismic repo state ...");

  // 1. Reused slices — must exist
  const reusedStatus = await Promise.all(
    REUSED_SLICES.map(async (id) => ({ id, exists: await sliceExists(id) }))
  );
  const missingReused = reusedStatus.filter((r) => !r.exists);

  // 2. New slices — should not already exist
  const newStatus = await Promise.all(
    NEW_SLICES.map(async (s) => ({ id: s.id, exists: await sliceExists(s.id) }))
  );
  const wouldOverwrite = newStatus.filter((s) => s.exists);

  // 3. Custom type — informational
  const ctExists = await customTypeExists(UNIT_PAGE_CUSTOMTYPE.id);

  if (verbose) {
    console.log("\n  Reused slices (must exist for unit_page to render):");
    for (const r of reusedStatus) {
      console.log(`    ${r.exists ? "✓" : "✗"} ${r.id}${r.exists ? " — found" : " — MISSING"}`);
    }
    console.log("\n  New slices (about to be pushed):");
    for (const s of newStatus) {
      const tag = s.exists ? "↻ already exists (will be UPDATED)" : "+ new (will be INSERTED)";
      console.log(`    ${tag.startsWith("+") ? "+" : "↻"} ${s.id} — ${tag.replace(/^[+↻]\s*/, "")}`);
    }
    console.log(
      `\n  Custom type unit_page: ${ctExists ? "↻ exists (will be UPDATED)" : "+ new (will be INSERTED)"}\n`
    );
  }

  return { reusedStatus, missingReused, newStatus, wouldOverwrite, ctExists };
}

function reportPreflightIssues(report, { force }) {
  const errors = [];

  if (report.missingReused.length > 0) {
    errors.push(
      `Missing REUSED slice(s) in your repo: ${report.missingReused
        .map((r) => r.id)
        .join(", ")}.\n` +
        `  These must already exist for the unit_page custom type to work.\n` +
        `  Either create them in Prismic first, or remove them from REUSED_SLICES\n` +
        `  and the slice-zone choices in UNIT_PAGE_CUSTOMTYPE before pushing.`
    );
  }

  if (report.wouldOverwrite.length > 0 && !force) {
    errors.push(
      `${report.wouldOverwrite.length} new slice(s) would OVERWRITE existing models: ${report.wouldOverwrite
        .map((s) => s.id)
        .join(", ")}.\n` +
        `  If this is a re-run after editing the script, that is intended — re-run with --force.\n` +
        `  If you did not expect a collision, investigate before overwriting.`
    );
  }

  return errors;
}

async function pushAllSlices(opts = { dryRun: false, force: false }) {
  for (const s of NEW_SLICES) {
    if (opts.dryRun) {
      console.log(`  [dry-run] would upsert slice ${s.id}`);
      continue;
    }
    const action = await upsertSlice(s);
    console.log(`  ✓ ${action} slice ${s.id}`);
  }
}

async function pushCustomType(opts = { dryRun: false }) {
  if (opts.dryRun) {
    console.log(`  [dry-run] would upsert custom type ${UNIT_PAGE_CUSTOMTYPE.id}`);
    return;
  }
  const action = await upsertCustomType(UNIT_PAGE_CUSTOMTYPE);
  console.log(`  ✓ ${action} custom type ${UNIT_PAGE_CUSTOMTYPE.id}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = new Set(process.argv.slice(2));
  const has = (...flags) => flags.some((f) => args.has(f));

  if (args.size === 0 || has("--help", "-h")) {
    console.log(`APScore5 unit_page — Prismic slice setup
${_envFile ? `Loaded env from: ${_envFile}` : "No .env file found in cwd or script dir."}
${_aliasesUsed.length > 0 ? `Env aliases applied: ${_aliasesUsed.join(", ")}` : ""}
${
  process.env.PRISMIC_REPO
    ? `PRISMIC_REPO is set (${process.env.PRISMIC_REPO}). PRISMIC_TOKEN is ${process.env.PRISMIC_TOKEN ? "set." : "NOT set."}`
    : "PRISMIC_REPO is NOT set."
}

USAGE
  node setup-unit-page-slices.js [flags]

THE COMMAND YOU PROBABLY WANT
  node setup-unit-page-slices.js --push --include-customtype

  This pushes the 10 new slices and the unit_page custom type to Prismic.
  Preflight runs first and aborts if any of the 3 reused slices is missing
  or if any new slice ID would overwrite an existing one.

OTHER FLAGS
  --check              Inspect Prismic repo state. No changes made.
  --dry-run            With --push, log actions but don't call write APIs.
  --force              Allow --push to overwrite existing slices that share
                       IDs with new slices (use after intentional re-runs).
  --write              Write the 10 slice model.json files to ./slices/
                       (only needed if you also use Slice Machine locally).
  --write-types        Also write ./customtypes/unit_page/index.json.
  --all                --write --write-types --push --include-customtype
  --help               This message.

ENV (required for --check, --push)
  PRISMIC_REPO         e.g. apscore5
  PRISMIC_TOKEN        Custom Types API token with Write permission

  These are auto-loaded from a .env file in the current directory.
  No need to source or export anything manually.

REUSED slices (already in your repo, NOT pushed by this script):
  ${REUSED_SLICES.join(", ")}

  These are referenced by the unit_page custom type's slice zone but are
  never modified by this script. Preflight verifies they exist before any
  push, so a missing reused slice cannot leave your repo in a broken state.
`);
    return;
  }

  const all = has("--all");
  const dryRun = has("--dry-run");
  const force = has("--force");

  if (all || has("--write")) {
    console.log("Writing slice models to ./slices/ ...");
    const n = writeSlicesToDisk();
    console.log(`Wrote ${n} slice model.json files.\n`);
  }

  if (all || has("--write-types")) {
    console.log("Writing unit_page custom type to ./customtypes/ ...");
    writeCustomTypeToDisk();
    console.log("");
  }

  // --check is a standalone preflight, no push
  if (has("--check") && !has("--push") && !all) {
    await preflightCheck();
    return;
  }

  if (all || has("--push")) {
    if (!process.env.PRISMIC_REPO || !process.env.PRISMIC_TOKEN) {
      console.error("✗ Missing required env vars.\n");
      console.error(`  .env loaded from: ${_envFile || "NOT FOUND in current dir or script dir"}`);
      console.error(`  Looked in: ./.env, ./.env.local, ${__dirname}/.env`);
      console.error(`  PRISMIC_REPO:  ${process.env.PRISMIC_REPO ? "✓ set" : "✗ NOT SET"}`);
      console.error(`  PRISMIC_TOKEN: ${process.env.PRISMIC_TOKEN ? "✓ set" : "✗ NOT SET"}`);
      if (_envKeys.length > 0) {
        console.error(`\n  Keys found in your .env: ${_envKeys.join(", ")}`);
      }
      console.error(`\n  This script needs PRISMIC_REPO and PRISMIC_TOKEN.`);
      console.error(
        `  It also auto-recognizes these aliases:\n` +
          `    PRISMIC_REPO  ← ${ENV_ALIASES.PRISMIC_REPO.join(", ")}\n` +
          `    PRISMIC_TOKEN ← ${ENV_ALIASES.PRISMIC_TOKEN.join(", ")}`
      );
      console.error(`\n  Fix: either rename the keys in your .env to PRISMIC_REPO and PRISMIC_TOKEN,`);
      console.error(`  or add new lines for them. Note: PRISMIC_TOKEN must be a Custom Types API token`);
      console.error(`  with WRITE permission, not a regular content API key.`);
      process.exit(1);
    }

    // Always run preflight before any push — this is the safety net for reuse
    const report = await preflightCheck();
    const issues = reportPreflightIssues(report, { force });
    if (issues.length > 0 && !dryRun) {
      console.error("\n✗ Preflight failed. Aborting before any changes were made:\n");
      for (const issue of issues) console.error("  • " + issue.replace(/\n/g, "\n    "));
      console.error("");
      process.exit(2);
    }
    if (issues.length > 0 && dryRun) {
      console.warn("⚠  Preflight has warnings (would block a real push):\n");
      for (const issue of issues) console.warn("  • " + issue.replace(/\n/g, "\n    "));
      console.warn("");
    }

    console.log(
      `${dryRun ? "[DRY-RUN] " : ""}Pushing slices to Prismic (${process.env.PRISMIC_REPO}) ...`
    );
    await pushAllSlices({ dryRun, force });
    console.log(`Pushed ${NEW_SLICES.length} slices.\n`);

    if (all || has("--include-customtype")) {
      console.log(`${dryRun ? "[DRY-RUN] " : ""}Pushing unit_page custom type ...`);
      await pushCustomType({ dryRun });
      console.log("");
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});
