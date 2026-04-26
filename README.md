# Prismic Migration — drop & run

## Folder layout

```
scripts/migrations/
├── post.js              ← the one script you run
├── pending/             ← drop *.prismic.json files here
└── posted/              ← script moves successful files here
```

## One-time setup

In `.env.local` at the repo root:

```
PRISMIC_REPO=apscore5
PRISMIC_MIGRATION_TOKEN=<from Prismic → Settings → API & Security → Migration API>
```

No npm install needed — `post.js` uses only Node built-ins. Requires **Node 18+** (for native `fetch`).

## The workflow

**1.** Drop any `*.prismic.json` file into `scripts/migrations/pending/`.

**2.** Run:

```bash
node scripts/migrations/post.js
```

**3.** The script:
- reads every JSON file in `pending/`
- POSTs each one (or PUTs if the file has a top-level `"id"`)
- moves successful files to `posted/` with the returned Prismic ID appended to the filename
- leaves failed files in `pending/` so you can fix and re-run
- waits 1.2s between files (Prismic caps at 1 req/sec)

**4.** Open Prismic → **Releases** → **Migration Release** → **Publish**.

**5.** For a brand-new UID, redeploy Vercel once so `generateStaticParams` picks up the route. After that, ISR handles edits automatically (if your Prismic → Vercel webhook is set up).

## Updating an existing page

After the first POST, you'll see a filename like:

```
posted/courses_hub.id-ZhX8aBCDEFGhijk.posted-2026-04-24T20-41-33.json
```

That `ZhX8aBCDEFGhijk` is the Prismic document ID. To update the page later:

1. Edit the JSON content
2. Add a top-level `"id": "ZhX8aBCDEFGhijk"` field at the top of the JSON
3. Drop it back in `pending/`
4. Re-run `node scripts/migrations/post.js` — it'll detect the `id` and use `PUT` instead of `POST`

## Preflight checks the script enforces

- Top-level `type`, `uid`, `lang`, `data` must all be present
- `data.og_image.id` must not be `"REPLACE_WITH_ASSET_ID"` — upload the image to Prismic's Media Library first and paste the real asset ID
- JSON must parse

If any of these fail, the file stays in `pending/` and the error is printed with the filename.

## SEO/AEO conventions

Every public page on this site has a keyword brief at `docs/seo/pages/{slug}.md`. Before any content change, the relevant brief must be consulted. Brief structure: primary keyword, secondary keywords, long-tail keywords, forbidden keywords (cannibalization protection), meta tags, required schemas, differentiator.

The full operating standard lives in `docs/SEO_PLAYBOOK.md` and includes:
- 15 page-design principles
- Tier → keyword routing rules
- Required technical SEO checks
- AEO requirements (FAQ + Quick Answer + question-shaped headings)
- 8-point humanization checklist
- Core Web Vitals budget
- Pre-merge PR checklist
- Live page audit template
- Cannibalization rules

New pages cannot ship until their brief at `docs/seo/pages/{slug}.md` exists.
