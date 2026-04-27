#!/usr/bin/env node
/**
 * post.js — Prismic Migration API poster.
 *
 * Drop any *.prismic.json file into ./pending, run this script, done.
 *
 *   node scripts/migrations/post.js
 *
 * Env (put these in .env.local at the repo root):
 *   PRISMIC_REPO=apscore5
 *   PRISMIC_MIGRATION_TOKEN=xxxxxxxx
 *
 * What it does
 *   1. Reads every *.prismic.json in ./pending
 *   2. Decides POST (new) vs PUT (update) based on presence of a top-level "id"
 *   3. Sends it to Prismic's Migration API
 *   4. On success: moves the file to ./posted with the returned id in the name
 *   5. On failure: leaves the file in ./pending and prints the error
 *   6. Sleeps 1.2s between files (API limit is 1 req/sec per repo)
 *
 * Publishing is still manual — Prismic does not allow programmatic publish.
 * After this script runs, open Prismic → Releases → Migration Release → Publish.
 */

const fs = require("node:fs");
const path = require("node:path");

// ---------- env loading (so you don't need dotenv) ----------

const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) {
      // Strip surrounding quotes if present
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

const REPO = process.env.PRISMIC_REPO;
const TOKEN = process.env.PRISMIC_MIGRATION_TOKEN;

if (!REPO || !TOKEN) {
  console.error("✖ Missing PRISMIC_REPO or PRISMIC_MIGRATION_TOKEN.");
  console.error("  Put them in .env.local at the repo root, or export them.");
  process.exit(1);
}

// ---------- paths ----------

const PENDING_DIR = path.resolve(__dirname, "pending");
const POSTED_DIR = path.resolve(__dirname, "posted");

for (const dir of [PENDING_DIR, POSTED_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ---------- helpers ----------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function preflight(doc, filename) {
  const errs = [];
  if (!doc.type) errs.push("missing 'type'");
  if (!doc.uid) errs.push("missing 'uid'");
  if (!doc.lang) errs.push("missing 'lang'");
  if (!doc.data) errs.push("missing 'data'");

  // OG image placeholder check
  const ogId = doc?.data?.og_image?.id;
  if (ogId === "REPLACE_WITH_ASSET_ID") {
    errs.push(
      "og_image.id is still the placeholder — upload the image to Prismic " +
      "Media Library, copy the asset id, and paste it into the JSON first."
    );
  }

  if (errs.length) {
    console.error(`✖ ${filename} failed preflight:`);
    for (const e of errs) console.error(`    - ${e}`);
    return false;
  }
  return true;
}

async function send(doc) {
  const isUpdate = typeof doc.id === "string" && doc.id.length > 0;
  const url = isUpdate
    ? `https://migration.prismic.io/documents/${doc.id}`
    : `https://migration.prismic.io/documents`;
  const method = isUpdate ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "repository": REPO,
      "Authorization": `Bearer ${TOKEN}`,
      "x-api-key": TOKEN,
    },
    body: JSON.stringify(doc),
  });

  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }

  return { ok: res.ok, status: res.status, method, body };
}

function movePosted(sourcePath, returnedId) {
  const base = path.basename(sourcePath, ".prismic.json");
  // If the filename already has an id embedded, don't double-append
  const cleanBase = base.replace(/\.id-[a-zA-Z0-9_-]+$/, "");
  const idSuffix = returnedId ? `.id-${returnedId}` : "";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const destName = `${cleanBase}${idSuffix}.posted-${stamp}.json`;
  const destPath = path.join(POSTED_DIR, destName);
  fs.renameSync(sourcePath, destPath);
  return destPath;
}

// ---------- main ----------

async function main() {
  const files = fs
    .readdirSync(PENDING_DIR)
    .filter((f) => f.endsWith(".prismic.json"))
    .map((f) => path.join(PENDING_DIR, f))
    .sort();

  if (files.length === 0) {
    console.log("Nothing in ./pending. Drop a *.prismic.json file in and re-run.");
    return;
  }

  console.log(`Found ${files.length} file(s) to post to repo "${REPO}":\n`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const filename = path.basename(filePath);

    console.log(`[${i + 1}/${files.length}] ${filename}`);

    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.error(`    ✖ invalid JSON: ${e.message}`);
      fail++;
      continue;
    }

    if (!preflight(doc, filename)) {
      fail++;
      continue;
    }

    let result;
    try {
      result = await send(doc);
    } catch (e) {
      console.error(`    ✖ network error: ${e.message}`);
      fail++;
      continue;
    }

    if (!result.ok) {
      console.error(`    ✖ ${result.method} failed (${result.status})`);
      console.error(`      ${typeof result.body === "string"
        ? result.body
        : JSON.stringify(result.body, null, 2).split("\n").join("\n      ")}`);
      fail++;
      continue;
    }

    const returnedId = result.body?.id ?? doc.id ?? null;
    const dest = movePosted(filePath, returnedId);
    console.log(`    ✓ ${result.method} ok — id: ${returnedId ?? "(none returned)"}`);
    console.log(`      moved to ${path.relative(process.cwd(), dest)}`);
    ok++;

    // Rate limit: 1 req/sec. Leave a little headroom.
    if (i < files.length - 1) await sleep(1200);
  }

  console.log(`\nDone. ${ok} posted, ${fail} failed.`);

  if (ok > 0) {
    console.log("\nNext steps:");
    console.log("  1. Open Prismic → Releases → Migration Release.");
    console.log("  2. Review the drafts and click Publish.");
    console.log("  3. For brand-new UIDs, redeploy Vercel so the route is built.");
  }

  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error("✖ Unhandled error:", e);
  process.exit(1);
});
