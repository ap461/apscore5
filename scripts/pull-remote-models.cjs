#!/usr/bin/env node
// scripts/pull-remote-models.cjs
//
// READ-ONLY pull of Prismic slice + custom-type MODEL schemas from the
// apscore5 Prismic repo to local disk. Uses only two Prismic API calls:
//
//   manager.slices.fetchRemoteSlices()
//   manager.customTypes.fetchRemoteCustomTypes()
//
// Both are pure HTTP GETs against Prismic's Models API. This script NEVER
// calls any push/create/update/delete endpoint against Prismic — verify by
// grepping this file for those verbs, you will find none.
//
// Usage:
//   node scripts/pull-remote-models.cjs            # dry run (default)
//   node scripts/pull-remote-models.cjs --write    # actually write files
//
// Writes (only with --write):
//   - slices/<SliceName>/model.json   — one per remote SharedSlice
//   - customtypes/<id>/index.json     — ONLY for custom types whose local
//                                        version is an empty UID-only stub.
//                                        `homepage` has a real local schema
//                                        so it is automatically skipped.
//
// Does NOT touch:
//   - slices/index.ts                  — slice registry, updated later
//   - slices/*/index.tsx               — React components, drafted per slice
//   - slices/*/mocks.json              — Slice Machine can regenerate
//   - prismicio-types.d.ts             — regenerate after via SM Tools menu

const { createSliceMachineManager } = require("@slicemachine/manager");
const { mkdir, writeFile, readFile } = require("node:fs/promises");
const { existsSync } = require("node:fs");
const path = require("node:path");

const WRITE = process.argv.includes("--write");
const ROOT = process.cwd();
const HR = "─".repeat(64);
const h = (s) => console.log(`\n${HR}\n${s}\n${HR}`);

(async () => {
  h(WRITE ? "WRITE MODE — files will be written to disk" : "DRY RUN — no files will be written");

  const manager = createSliceMachineManager({ cwd: ROOT });
  await manager.plugins.initPlugins();

  const isLoggedIn = await manager.user.checkIsLoggedIn();
  if (!isLoggedIn) {
    console.error("ERROR: Not logged in to Prismic. Open Slice Machine (localhost:9999) and log in first.");
    process.exit(1);
  }
  const repoName = await manager.project.getResolvedRepositoryName();
  console.log(`Authenticated. Repository: ${repoName}`);

  h("Fetching remote slices (GET from Prismic Models API)");
  const remoteSlices = await manager.slices.fetchRemoteSlices();
  console.log(`Received ${remoteSlices.length} slice(s):`);
  for (const s of remoteSlices) {
    console.log(
      `  • ${String(s.name).padEnd(22)} id=${String(s.id).padEnd(22)} variations=${s.variations?.length ?? 0}`,
    );
  }

  h("Fetching remote custom types (GET from Prismic Models API)");
  const remoteCts = await manager.customTypes.fetchRemoteCustomTypes();
  console.log(`Received ${remoteCts.length} custom type(s):`);
  for (const ct of remoteCts) {
    const tabs = Object.keys(ct.json ?? {});
    console.log(`  • ${String(ct.id).padEnd(22)} label="${ct.label}" tabs=[${tabs.join(", ")}]`);
  }

  h("Planning writes");
  const plan = [];

  // Skip the homepage slices that already exist locally with working schemas.
  // We only want to pull the new pillar-page slices, not overwrite homepage ones.
  const SKIP_SLICE_NAMES = new Set(["CoursesGrid", "HeroSection", "NewsletterSignup", "TrustBar"]);

  for (const s of remoteSlices) {
    if (SKIP_SLICE_NAMES.has(s.name)) {
      console.log(`  SKIP slices/${s.name}/model.json — already exists locally (homepage slice)`);
      continue;
    }
    const file = path.join(ROOT, "slices", s.name, "model.json");
    plan.push({
      file,
      content: JSON.stringify(s, null, 2) + "\n",
      kind: "slice",
      note: existsSync(file) ? "overwrites existing" : "new",
    });
  }

  const isUidOnlyStub = (doc) => {
    const main = doc?.json?.Main ?? {};
    const keys = Object.keys(main);
    return keys.length === 1 && keys[0] === "uid";
  };

  for (const ct of remoteCts) {
    const file = path.join(ROOT, "customtypes", ct.id, "index.json");
    if (existsSync(file)) {
      const local = JSON.parse(await readFile(file, "utf8"));
      if (!isUidOnlyStub(local)) {
        console.log(`  SKIP customtypes/${ct.id}/index.json — local has real schema (not a UID-only stub)`);
        continue;
      }
    }
    plan.push({
      file,
      content: JSON.stringify(ct, null, 2) + "\n",
      kind: "customtype",
      note: existsSync(file) ? "overwrites UID-only stub" : "new",
    });
  }

  console.log(`\n${plan.length} file(s) planned:`);
  for (const w of plan) {
    const rel = path.relative(ROOT, w.file).padEnd(48);
    console.log(`  ${WRITE ? "WRITE " : "would "} ${rel} ${w.kind.padEnd(10)} ${w.note}`);
  }

  if (!WRITE) {
    console.log("\nDry run complete. Re-run with --write to actually write files.");
    process.exit(0);
  }

  h("Writing files");
  for (const w of plan) {
    await mkdir(path.dirname(w.file), { recursive: true });
    await writeFile(w.file, w.content);
    console.log(`  wrote ${path.relative(ROOT, w.file)}`);
  }
  console.log(`\nDone. Wrote ${plan.length} file(s).`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
