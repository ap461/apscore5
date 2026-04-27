# Courses Hub — Content Delivery Note

**Page:** `/courses`
**UID:** `courses`
**Prismic type:** `courses_hub_page`
**Access:** Public, crawlable
**Refresh cadence:** Monthly (question counts, course statuses, poll data, FAQ rotation)
**Refresh signature:** evergreen — no exam-date or year-specific copy in body

---

## 1. Keyword & AEO mapping

Targets derived from the SEO/AEO project doc § 11 (*Function Design Document*) and the Page Types doc § 3.2 (Courses Hub purpose: *"rank for head-term searches like AP courses list without becoming thin"*).

### Primary head term

| Keyword | Placement |
|---|---|
| **AP courses** | H1 (hero headline), meta title, first sentence of subhead, eyebrow |
| **AP classes** | Why-AP-matters H2 + body, 4 of 12 FAQ answers |

### Secondary head/mid-tail

| Keyword | Placement |
|---|---|
| AP courses list / all AP courses / AP subjects | H2 on `course_grid` ("All AP subjects in one place"), lede paragraph |
| AP course catalog | Implicit in `course_grid` card design |
| College credit for AP | Why-AP-matters body (paragraph 1 + 3), FAQ #8 |
| Course rigor / admissions | Why-AP-matters body (paragraph 2), FAQ #9 |

### Long-tail + People-Also-Ask (answered in FAQ slice)

All 12 FAQs follow the AEO format: direct answer in sentences 1–2, expansion after. Emits `FAQPage` JSON-LD on render.

| # | FAQ query (verbatim from PAA data) | Category | AEO-critical? |
|---|---|---|---|
| 1 | What is an AP course? | Basics | ★★★ (voice search, AI overviews) |
| 2 | How many AP courses are there? | Basics | ★★★ |
| 3 | What is the difference between AP and honors classes? | Basics | ★★★ |
| 4 | Which AP class should I take first? | Course selection | ★★★ |
| 5 | How many AP classes should I take? | Course selection | ★★ |
| 6 | Which AP classes are the easiest? | Course selection | ★★★ |
| 7 | Which AP classes are the hardest? | Course selection | ★★★ |
| 8 | What score do I need on an AP exam for college credit? | Credit & admissions | ★★★ |
| 9 | Do colleges look at AP classes in admissions? | Credit & admissions | ★★★ |
| 10 | Are AP classes worth it? | Credit & admissions | ★★★ |
| 11 | Can I take an AP exam without taking the class? | Registration & exams | ★★ |
| 12 | How are AP exams scored? | Registration & exams | ★★ |

---

## 2. Evergreen choices (per your "lasting page" note)

| Before (wireframe) | After |
|---|---|
| Stat 4: "May 5 / Next exam" | "65+ / Units covered" (grows as new courses launch) |
| Poll question: "How many APs are you taking this year?" | "How many APs do you plan to take overall?" |
| Poll ID: `aps_per_year_2026` | `aps_planned_total` (no year) |
| Meta title had "(2026)" | Removed — no year in title |
| Conversion body mentioned "exam-season" | Rewritten to brand value prop only |

**Refresh handling.** When the page gets its monthly refresh, the three things that will change are:
- Question counts per course card (read from Supabase, not edited by hand)
- `status` field on cards (Coming Soon → Live as courses launch)
- FAQ rotation (retire 2 lowest-performing, add 2 from Search Console PAA queue)

Nothing else in the content is dated, so it ages gracefully.

---

## 3. Schema.org markup emitted

Four structured-data blocks in the `<head>`:

- **BreadcrumbList** — Home → AP Courses
- **CollectionPage** with nested **ItemList** — the 8 AP courses
- **FAQPage** — static fallback with all 12 FAQs (the slice also emits its own at render time; this is the crawler-safe backup)

---

## 4. Humanization checklist (per Skills Playbook § 3.2)

| Check | Pass/Fail | Where |
|---|---|---|
| Hook or example in opening (not a definition) | ✅ Pass | Hero subheadline opens with the promise, not "AP Courses are…" |
| 'Common mistakes' or student-focused block | ✅ Pass | Why-AP-matters paragraph 4 ("quality beats quantity") |
| At least one AP-specific exam tip | ✅ Pass | FAQ #12 explains the AP curve |
| Zero banned words | ✅ Pass | Checked against Banned_Words file — no instances of leverage, unlock, seamless, robust, cutting-edge, empower, synergy, transform, elevate, etc. |
| ≤ 65% of headings match primary keyword | ✅ Pass | 3 of 6 H2s reference "AP" directly (~50%); others are descriptive |
| FAQ answers put direct answer in first 2 sentences | ✅ Pass | All 12 FAQs |
| Intro opens with hook, not definition | ✅ Pass | Hero opens with possibility, not "What is an AP course" |
| Teacher voice consistent | ✅ Pass | Cause-and-effect phrasing throughout; real-world examples in FAQs |

---

## 5. Parser shape — one update required

Your existing `scripts/html-to-prismic.cjs` was built for the Pillar page, which uses the **legacy `items[]` shape**:

```yaml
# Pillar convention (old)
primary: { eyebrow: "...", headline: [...] }
items:
  - stat_number: "7"
    stat_label: "Units"
```

The Courses Hub slices use the **new Group-field shape** that Prismic's current UI generates:

```yaml
# Courses Hub convention (new)
primary:
  eyebrow: "..."
  headline: [...]
  stats:                          # ← group is nested inside primary
    - stat_value: "8"
      stat_label: "AP courses"
```

**The parser needs to handle both.** Four slices in this file use the Group shape:

| Slice | Group name inside `primary` |
|---|---|
| `courses_hub_hero` | `stats` |
| `course_grid` | `courses` |
| `ap_planning_poll` | `options` |
| `faq_accordion` | `faqs` |

**Update logic**: if the YAML has `items:` at the slice top level, use it (Pillar slices). If `primary:` contains a nested array-of-objects field, treat that as the Group and include it in the `primary` payload sent to Prismic — nothing goes in `items[]` for these slices. Prismic's Migration API accepts both shapes depending on the Slice Machine model definition.

---

## 6. Known gaps for you to fill before migration

1. **`og_image`** — URL in the YAML (`https://images.prismic.io/apscore5/og-courses-hub.png`) is a placeholder. Upload the real 1200×630 OG image to Prismic's asset library first, then replace the URL.

2. **`course_link` for live courses** — currently `{ link_type: Web, url: "https://apscore5.com/ap-human-geography" }` (and similar for Biology + CSP). Once the pillar pages exist as Prismic documents, switch these to Content Relationships: `{ link_type: Document, type: "course_pillar_page", uid: "ap-human-geography" }`. Web links work for launch; Content Relationships are better long-term.

3. **`course_icon`** — the slice supports a square course icon image, but I haven't included one (no icon files in the project). The grid will fall back to the colored `accent` bar. If you want icons, upload 256×256 PNGs to Prismic and reference them in the YAML.

4. **Supabase `poll_votes` table** — must exist before the page goes live, otherwise `ap_planning_poll` will show the hand-drawn fallback numbers (22% / 48% / 30%) forever. Schema: `poll_id (text)`, `option_value (text)`, `session_fingerprint (text)`, `created_at (timestamp)`.

5. **Stat #5: "3 / Live today"** — currently hard-coded in the YAML. The component should read this from a Supabase query counting pillar pages with `status='live'`. If that wiring isn't ready at launch, the stat will be stale when Course #4 launches. Easiest interim fix: drop that stat to 4 stats total until the live count is dynamic.

---

## 7. Migration command

Once the slices are pushed to Prismic (Phase 1 — already done per your last update) and the gaps in § 6 are addressed:

```bash
node scripts/html-to-prismic.cjs --input courses-hub-staging.html --type courses_hub_page --uid courses --write
```

That should produce the Prismic document JSON, validate it against the slice models, and POST to the Migration API. Document lands as a draft — publish from Prismic UI, then trigger a Vercel redeploy.

---

*End of delivery note*
