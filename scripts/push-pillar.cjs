#!/usr/bin/env node
/*
 * push-pillar.cjs v3 — Deterministic Prismic Migration API push
 * with aggressive error dumping so "Validation failed" reveals the field.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// --- Load env
try {
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config({ path: '.env' });
} catch {
  for (const f of ['.env.local', '.env']) {
    if (fs.existsSync(f)) {
      for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  }
}

// --- Parse args
const args = process.argv.slice(2);
const doWrite = args.includes('--write');
let repoOverride = null;
const repoIdx = args.indexOf('--repo');
if (repoIdx >= 0 && args[repoIdx + 1]) repoOverride = args[repoIdx + 1];
const flagValues = new Set();
if (repoIdx >= 0) flagValues.add(args[repoIdx + 1]);
const jsonPath = args.find(a => !a.startsWith('--') && !flagValues.has(a));

if (!jsonPath) { console.error('Usage: node push-pillar.cjs <migration-json> [--write] [--repo name]'); process.exit(1); }
if (!fs.existsSync(jsonPath)) { console.error('✗ File not found: ' + jsonPath); process.exit(1); }

// --- Resolve repo
function resolveRepo() {
  if (repoOverride) return { repo: repoOverride, source: '--repo flag' };
  const envRepo = process.env.PRISMIC_REPOSITORY_NAME || process.env.PRISMIC_REPO || process.env.PRISMIC_ENVIRONMENT;
  if (envRepo) return { repo: envRepo, source: 'env var' };
  const smPath = path.resolve('slicemachine.config.json');
  if (fs.existsSync(smPath)) {
    try {
      const sm = JSON.parse(fs.readFileSync(smPath, 'utf8'));
      if (sm.repositoryName) return { repo: sm.repositoryName, source: 'slicemachine.config.json' };
    } catch (e) {}
  }
  return null;
}

const resolved = resolveRepo();
if (!resolved) { console.error('✗ Repo name not found. Use --repo flag.'); process.exit(1); }

const REPO  = resolved.repo;
const TOKEN = process.env.PRISMIC_WRITE_TOKEN || process.env.PRISMIC_MIGRATION_TOKEN || process.env.PRISMIC_API_KEY;
if (!TOKEN) { console.error('✗ Missing PRISMIC_WRITE_TOKEN'); process.exit(1); }

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// --- Banner
const bar = '─'.repeat(72);
console.log(bar);
console.log('  push-pillar v3  ·  direct Prismic push + verbose errors');
console.log(bar);
console.log('  payload:          ' + jsonPath);
console.log('  repo:             ' + REPO + '  (from ' + resolved.source + ')');
console.log('  doc type/uid:     ' + payload.type + ' / ' + payload.uid);
const nSlices = (payload.data && payload.data.slices) ? payload.data.slices.length : 0;
console.log('  slices:           ' + nSlices);
if (payload.data && payload.data.slices) {
  for (const s of payload.data.slices) {
    console.log('    · ' + s.slice_type.padEnd(22) + '  primary=' + Object.keys(s.primary || {}).length + '  items=' + (s.items || []).length);
  }
}
console.log('  mode:             ' + (doWrite ? 'WRITE' : 'dry-run'));
console.log(bar);

if (!doWrite) { console.log('  Dry-run complete.'); process.exit(0); }

// --- Verbose error helper — extract EVERY piece of info
function dumpError(err) {
  console.error(bar);
  console.error('✗ Push failed — full error dump:');
  console.error(bar);
  console.error('  typeof err:    ' + typeof err);
  console.error('  err.name:      ' + (err && err.name));
  console.error('  err.message:   ' + (err && err.message));
  if (err && err.code) console.error('  err.code:      ' + err.code);
  if (err && err.status) console.error('  err.status:    ' + err.status);

  // Try all common places Prismic might stash detail
  const candidates = ['response', 'cause', 'details', 'errors', 'body', 'data', 'issue', 'issues', 'validationErrors', 'requestID'];
  for (const k of candidates) {
    if (err && err[k] !== undefined) {
      console.error('  err.' + k + ':');
      try { console.error(JSON.stringify(err[k], null, 2).split('\n').map(l => '    ' + l).join('\n')); }
      catch (e) { console.error('    [unstringifiable] ' + String(err[k]).slice(0, 400)); }
    }
  }

  // Dump all own enumerable properties as a last resort
  try {
    const allKeys = Object.getOwnPropertyNames(err);
    const extraKeys = allKeys.filter(k => !['name','message','stack','code','status', ...candidates].includes(k));
    if (extraKeys.length) {
      console.error('  other keys on err:');
      for (const k of extraKeys) {
        try {
          const val = err[k];
          const preview = typeof val === 'object' ? JSON.stringify(val, null, 2).slice(0, 600) : String(val).slice(0, 300);
          console.error('    err.' + k + ' = ' + preview);
        } catch (_) {}
      }
    }
  } catch (_) {}

  // Stack
  if (err && err.stack) {
    console.error('  stack:');
    console.error(err.stack.split('\n').slice(0, 8).map(l => '    ' + l).join('\n'));
  }
}

// --- Push
(async () => {
  let prismic;
  try { prismic = require('@prismicio/client'); }
  catch { console.error('✗ npm install @prismicio/client'); process.exit(1); }

  try {
    const client = prismic.createWriteClient(REPO, { writeToken: TOKEN });
    const migration = prismic.createMigration();
    migration.createDocument(payload, payload.title || payload.uid);

    console.log('  Pushing...');
    const result = await client.migrate(migration, {
      reporter: (event) => {
        if (event && event.type) {
          const detail = event.data && event.data.document
            ? ' (' + (event.data.document.uid || event.data.document.title || '') + ')' : '';
          console.log('    [' + event.type + ']' + detail);
        }
      }
    });

    console.log(bar);
    console.log('  ✓ Push succeeded');
    if (result) console.log('  result:', JSON.stringify(result, null, 2).slice(0, 800));
    console.log(bar);
    console.log('  Next: open https://' + REPO + '.prismic.io, find "' + payload.uid + '" draft, scan 12 slices, publish.');
  } catch (err) {
    dumpError(err);
    process.exit(2);
  }
})();
