#!/usr/bin/env node
// push-to-prismic.cjs — minimal PUT to Prismic Migration API.
//
// Usage:
//   node push-to-prismic.cjs              (dry run — prints summary, no network)
//   node push-to-prismic.cjs --write      (actually PUTs to Prismic)
//
// Requires in .env.local:
//   PRISMIC_WRITE_TOKEN=<your permanent access token from Settings → API & Security>

const { readFileSync } = require("node:fs");
const path = require("node:path");

// ── Hard-coded for AP Human Geography (from the existing Prismic doc)
const REPOSITORY = "apscore5";
const DOCUMENT_ID = "aeaifRAAAB8AZWYG";   // existing UID ap-human-geography
const JSON_FILE = "ap-human-geography-migration.json";

// ── Load .env.local (tiny parser, avoids needing dotenv)
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      // strip optional quotes
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // no .env.local — that's fine for dry-run
  }
}
loadEnv();

const WRITE = process.argv.includes("--write");

// ── Load the migration JSON
const jsonPath = path.join(process.cwd(), JSON_FILE);
const doc = JSON.parse(readFileSync(jsonPath, "utf8"));

// ── Sanity checks
if (doc.type !== "course_pillar_page") {
  console.error(`✗ Unexpected document type: ${doc.type}`);
  process.exit(1);
}
if (doc.uid !== "ap-human-geography") {
  console.error(`✗ Unexpected uid: ${doc.uid}`);
  process.exit(1);
}
if (!Array.isArray(doc.data?.slices) || doc.data.slices.length < 1) {
  console.error(`✗ Expected 12 slices, got ${doc.data?.slices?.length}`);
  process.exit(1);
}

// ── Print summary
const hr = "─".repeat(64);
console.log(hr);
console.log(`  push-to-prismic · ${WRITE ? "WRITE MODE" : "dry run"}`);
console.log(hr);
console.log(`  repository:   ${REPOSITORY}`);
console.log(`  document id:  ${DOCUMENT_ID}`);
console.log(`  uid:          ${doc.uid}`);
console.log(`  type:         ${doc.type}`);
console.log(`  lang:         ${doc.lang}`);
console.log(`  slices:       ${doc.data.slices.length}`);
for (const s of doc.data.slices) {
  const primaryKeys = Object.keys(s.primary || {}).length;
  const items = Array.isArray(s.items) ? s.items.length : 0;
  console.log(`    · ${s.slice_type.padEnd(22)}  primary=${primaryKeys}  items=${items}`);
}
console.log(hr);

if (!WRITE) {
  console.log("  Dry run complete — nothing sent to Prismic.");
  console.log("  Re-run with --write to PUT this document.");
  console.log(hr);
  process.exit(0);
}

// ── Write mode: PUT to Prismic
const token = process.env.PRISMIC_WRITE_TOKEN;
if (!token) {
  console.error("✗ PRISMIC_WRITE_TOKEN missing from .env.local");
  console.error("  Get one: https://apscore5.prismic.io/settings/apps");
  console.error("  Create a Permanent Access Token with Write permission.");
  process.exit(1);
}

const url = `https://migration.prismic.io/documents/${DOCUMENT_ID}/`;

(async () => {
  console.log(`  PUT ${url}`);
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "repository": REPOSITORY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  });
  const bodyText = await res.text();
  let body;
  try { body = JSON.parse(bodyText); } catch { body = bodyText; }

  console.log(`  HTTP ${res.status} ${res.statusText}`);
  console.log(hr);
  console.log(JSON.stringify(body, null, 2));
  console.log(hr);

  if (!res.ok) {
    console.error("\n✗ Request failed. See error above.");
    console.error("  Content NOT updated in Prismic.");
    process.exit(1);
  }
  console.log("\n✓ Success — content is now a DRAFT in Prismic.");
  console.log("  Next steps:");
  console.log("    1. Go to https://apscore5.prismic.io/");
  console.log("    2. Open the 'Migration Releases' tab (top nav)");
  console.log("    3. Review the draft, then click Publish");
  console.log("    4. Redeploy on Vercel to rebuild /ap-human-geography");
})().catch((err) => {
  console.error("\n✗ Error:", err.message || err);
  process.exit(1);
});
