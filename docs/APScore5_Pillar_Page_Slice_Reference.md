# APScore5 — Course Pillar Page Slice Reference

**Purpose.** This document defines the exact shape of every field in every slice of the `course_pillar_page` Prismic Custom Type. It is authored to serve as the single source of truth for (a) the HTML generation step and (b) the migration script that POSTs to Prismic's Migration API.

**How to use it.** For each new course (AP Biology, AP CSP, etc.), generate a staging HTML file where every `<section>` is preceded by an `<!-- @slice:... -->` comment block that fills in the contract below. The deterministic parser in `scripts/html-to-prismic.cjs` consumes the comment blocks, builds the Prismic document JSON, validates field shapes against this contract, and POSTs.

**Derived from:** the live published `ap-human-geography` document fetched from `https://apscore5.cdn.prismic.io/api/v2` on April 22, 2026 — plus the 12 slice `model.json` files pulled into the repo on April 21, 2026.

---

## 1. Document-level fields

These live on `data` directly (not inside any slice).

| Field | API ID | Type | Notes |
|---|---|---|---|
| UID | `uid` | UID | e.g. `ap-human-geography`, `ap-biology` |
| Course name | `course_name` | Text | e.g. `"AP Human Geography \| AP Score5"` |
| Meta title | `meta_title` | Text | Used in `<title>` tag by Next.js `generateMetadata` |
| Meta description | `meta_description` | Text | ~155 chars, used in `<meta name="description">` |
| Canonical URL | `canonical_url` | Link (Web) | `{ link_type: "Web", url: "https://apscore5.com/ap-human-geography" }` |
| OG image | `og_image` | Image | `{ url, alt, dimensions: { width, height } }` — Open Graph share card |
| No index | `no_index` | Boolean | Default `false`. Set `true` only for staging/test docs |

---

## 2. Slice zone (order-preserving)

The slice zone on `data.slices` expects slices in this order. The parser should emit them in this sequence. If a slice is missing for a given course, skip and log a warning — do not fail.

1. **pillar_hero**
2. **quick_answer**
3. **difficulty_section**
4. **exam_structure**
5. **diagnostic_quiz** *(not yet filled for AP HuG — shape inferred from model)*
6. **video_embed** *(not yet filled)*
7. **unit_cards_grid**
8. **conversion_block** *(not yet filled)*
9. **unit_question_bank** *(not yet filled)*
10. **study_strategy** *(not yet filled)*
11. **flashcard_carousel** *(not yet filled)*
12. **faq_accordion** *(not yet filled)*

---

## 3. Slice contracts

Each slice entry in `data.slices` has this envelope:

```json
{
  "slice_type": "<slice_api_id>",
  "slice_label": null,
  "variation": "default",
  "version": "initial",
  "primary": { /* singular fields — see each slice below */ },
  "items": [ /* repeatable rows — see each slice below */ ]
}
```

All slices use `variation: "default"` and `version: "initial"`. Omit `slice_label` or set to `null`.

### 3.1 `pillar_hero` — top-of-page hero

**Purpose.** The navy hero banner at the top of the page with eyebrow, headline, subheadline, two CTAs, and a 5-stat strip.

#### primary

| API ID | Type | Config / Format | Example value |
|---|---|---|---|
| `eyebrow` | Text | Single-line string | `"AP Human Geography · Complete Course Guide · Updated for the May 5, 2026 Exam"` |
| `headline` | StructuredText | Single-block `heading1`, allows `em` spans | `[{ type: "heading1", text: "Score a 5 on AP Human Geography — in 10 minutes a day.", spans: [{ start: 37, end: 47, type: "em" }] }]` |
| `subheadline` | StructuredText | `paragraph` + `strong` + `em` spans | `[{ type: "paragraph", text: "...", spans: [...] }]` |
| `primary_cta_text` | Text | Button label incl. trailing arrow if desired | `"Start Free — Take the 10-Question Diagnostic →"` |
| `primary_cta_link` | Link | Anchor or URL | `{ link_type: "Web", url: "#diagnostic" }` |
| `secondary_cta_text` | Text | | `"Jump to the 7 Units"` |
| `secondary_cta_link` | Link | | `{ link_type: "Web", url: "#units" }` |

#### items (5 stat cards)

| API ID | Type | Example |
|---|---|---|
| `stat_number` | Text | `"7"`, `"1,250+"`, `"50/50"`, `"+8.3%"`, `"May 5"` |
| `stat_label` | Text | `"Units Covered"`, `"Practice Questions"`, `"MCQ / FRQ Weight"`, `"Avg 30-Day Lift"`, `"2026 Exam Day"` |
| `stat_caption` | Text | `"Complete curriculum"`, `"Largest free bank online"`, etc. |

**Design note.** The component wraps `headline`'s `em` span in orange + underline. To make "10 minutes" appear orange+underlined, mark those exact characters as `em` in the rich text.

---

### 3.2 `quick_answer` — AEO/ZCQ block

**Purpose.** Short answer designed to win position-zero snippets in Google. Eyebrow says "Quick Answer"; direct answer is the ~60-word definitive statement; expansion adds context.

#### primary

| API ID | Type | Config | Example |
|---|---|---|---|
| `eyebrow` | Text | | `"Quick Answer"` |
| `question` | Text | Single-line; the implied search query | `"AP Human Geography is a one-year introductory college-level course covering seven units: how geographers think, population, culture, politics, agriculture, cities, and economic development."` |
| `direct_answer` | StructuredText | `paragraph` | Single-paragraph plain prose, ~50–70 words, self-contained. |
| `expansion` | StructuredText | `paragraph`, `strong`, `em` spans allowed | Follow-on detail. Can mention stats, models, caveats. Usually 2–4 sentences. |

#### items

Empty array `[]`. This slice has no repeatable items.

---

### 3.3 `difficulty_section` — "Is it hard?" 4-card block

**Purpose.** Balanced both-sides answer to "Is AP X hard?" with four cards: harder, easier, good fit, maybe not yet.

#### primary

| API ID | Type | Config | Example |
|---|---|---|---|
| `eyebrow` | Text | | `"For students deciding"` |
| `headline` | StructuredText | Single `heading2` | `[{ type: "heading2", text: "Is AP Human Geography hard?" }]` |
| `lede` | StructuredText | `paragraph` + `strong` + `em` | Stats-backed opening paragraph. Bold the pass-rate percentages and mean score. |
| `harder_title` | Text | | `"What makes it harder than it looks"` |
| `harder_bullets` | StructuredText | `paragraph` (can also allow `list-item` for bullet styling) | Prose paragraph OR list of bullets. In AP HuG this is a single prose paragraph with semicolon-separated points. |
| `easier_title` | Text | | `"What makes it easier than you expect"` |
| `easier_bullets` | StructuredText | | Same shape as `harder_bullets` |
| `fit_title` | Text | | `"A good fit if…"` |
| `fit_body` | StructuredText | `paragraph` | Who this course suits, 3–4 criteria. |
| `maybe_title` | Text | | `"Maybe not yet if…"` |
| `maybe_body` | StructuredText | `paragraph` | Who should delay, 2–3 criteria. |

#### items

Empty array `[]`. The four cards are hard-coded in `primary`. If this needs to become course-agnostic later, convert to an `items` group with `{ card_title, card_body, card_kind }`.

---

### 3.4 `exam_structure` — Format + unit-weights + logistics + scoring

**Purpose.** Answers "how does the exam work" — format description, unit-weight grid, logistics strip, score-band explanation.

#### primary

| API ID | Type | Config | Example |
|---|---|---|---|
| `eyebrow` | Text | | `"Exam Structure"` |
| `headline` | StructuredText | Single `heading2` | `[{ type: "heading2", text: "AP Human Geography exam structure and scoring" }]` |
| `lede` | StructuredText | `paragraph` | Short opener, 1–2 sentences. |
| `format_description` | StructuredText | `paragraph` | Single paragraph describing exam length, section split, format (digital Bluebook). |
| `weights_heading` | Text | | `"Unit weights on the exam"` |
| `score_heading` | Text | | `"What each score means"` |
| `score_description` | StructuredText | `paragraph` | Footnote about cut-offs. Include "Last reviewed [date]" for freshness. |

#### items (mixed unit-weights + logistics rows)

**Important quirk.** In the live AP HuG document, the `items` array mixes two concerns — unit weights AND exam logistics rows — using `null` on unused fields per row. When generating new courses, keep this mixed-row convention so the existing component renders without modification.

| API ID | Type | Notes |
|---|---|---|
| `unit_label` | Text | `"Unit 1"`, `"Unit 2"`, ... — or `null` on a logistics-only row |
| `unit_weight` | Text | `"8–10%"`, `"12-17%"` — or `null` |
| `unit_topic` | Text | `"Thinking Geographically"`, `"Population & Migration"`, ... |
| `logistics_icon` | Text | Single emoji — `"⏱️"`, `"📝"`, `"✍️"`, `"🎯"`, `"🚫"`, `"💻"` — or `null` |
| `logistics_title` | Text | `"Total Time"`, `"Exam Date"`, `"Section I — Multiple Choice"`, ... — or `null` |
| `logistics_value` | Text | `"2 hours 15 minutes"`, `"Tuesday, May 5, 2026 · 8:00 a.m. local"`, ... — or `null` |

**Convention.** Use `null` (not empty string) for fields a row doesn't use. The parser must serialize `null` not `""` for these.

---

### 3.5 `diagnostic_quiz` — Gated 10-question diagnostic

**Purpose.** Interactive client component. Shows 3 questions free, gates remaining 7 behind account creation.

*(Shape inferred from slice model. Confirm field names after this slice's content is first filled in Prismic.)*

#### primary

Expected fields (based on naming convention and staging HTML design):

| API ID | Type | Notes |
|---|---|---|
| `eyebrow` | Text | e.g. `"Diagnostic"` |
| `headline` | StructuredText | `heading2` |
| `lede` | StructuredText | `paragraph` — explains what the diagnostic is |
| `gate_heading` | Text | Shown after question 3 |
| `gate_body` | StructuredText | Value prop for creating an account |
| `gate_cta_text` | Text | e.g. `"Create a free account to continue →"` |
| `gate_cta_link` | Link | To signup flow |

#### items (the 10 questions)

| API ID | Type | Notes |
|---|---|---|
| `question_number` | Number | 1–10 |
| `question_text` | StructuredText | `paragraph` |
| `stimulus_image` | Image | Optional — for chart/map-based questions |
| `option_a` | Text | |
| `option_b` | Text | |
| `option_c` | Text | |
| `option_d` | Text | |
| `correct_answer` | Select | `["A", "B", "C", "D"]` |
| `explanation` | StructuredText | Shown after answer submitted |
| `is_gated` | Boolean | `false` for first 3, `true` for 4–10 |

---

### 3.6 `video_embed` — Embedded course overview video

#### primary

| API ID | Type | Notes |
|---|---|---|
| `eyebrow` | Text | e.g. `"Overview video"` |
| `headline` | StructuredText | `heading2` |
| `video_url` | Link (Web) | YouTube or Vimeo URL |
| `video_embed` | Embed | Prismic's native Embed field — auto-resolves the oEmbed response |
| `caption` | Text | Optional below-video text |

#### items

Empty array `[]`.

---

### 3.7 `unit_cards_grid` — 7-unit course roadmap

**Purpose.** Grid of cards linking to each unit's deep-dive page. Each card has unit number, weight, MCQ count, flavor chip, title, tagline, overview, exam-trap callout, key concepts, CTA.

#### primary

| API ID | Type | Example |
|---|---|---|
| `eyebrow` | Text | `"The curriculum"` |
| `headline` | StructuredText | `[{ type: "heading2", text: "Seven units, one clear path" }]` |
| `lede` | StructuredText | Short intro paragraph |

#### items (one row per unit)

| API ID | Type | Example / Notes |
|---|---|---|
| `unit_number` | Text | `"Unit 1"`, ..., `"Unit 7"` |
| `unit_weight` | Text | `"8–10%"`, `"12–17%"` |
| `unit_mcq` | Text | e.g. `"5–7 MCQs"` — approximate question count from this unit |
| `unit_flavor_chip` | Text | Short vibe tag, e.g. `"Foundational"`, `"High-yield"`, `"Exam favorite"` |
| `unit_title` | Text | `"Thinking Geographically"` |
| `unit_tagline` | Text | One-liner hook |
| `overview` | StructuredText | `paragraph`, 2–3 sentences |
| `trap_text` | StructuredText | `paragraph` — common mistake students make on this unit |
| `concepts` | StructuredText | `list-item` — bullet list of 4–6 key terms/models |
| `unit_cta_text` | Text | `"Study Unit 1 →"` |
| `unit_cta_link` | Link | Internal link to `/ap-human-geography/unit-1` (use Content Relationship once unit pages are modeled; Web link OK for now) |

**Note.** In the live AP HuG doc, this slice's `items` array has one row but all fields are `null` — content hasn't been filled yet. The shape above is inferred from the staging HTML's unit cards.

---

### 3.8 `conversion_block` — Mid/end-of-page signup CTA

#### primary

| API ID | Type | Notes |
|---|---|---|
| `eyebrow` | Text | e.g. `"Ready when you are"` |
| `headline` | StructuredText | `heading2` — the ask |
| `body` | StructuredText | `paragraph` — value prop, social proof |
| `cta_text` | Text | `"Create a free account"` |
| `cta_link` | Link | To signup |
| `trust_line` | Text | e.g. `"Free forever · No credit card · Start in 30 seconds"` |

#### items

Empty array `[]`.

---

### 3.9 `unit_question_bank` — Paginated practice questions

**Purpose.** Practice question set with pagination and state. Similar to `diagnostic_quiz` but not gated and potentially larger (~70 questions total).

#### primary

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `lede` | StructuredText `paragraph` |
| `questions_per_page` | Number — default 5 |

#### items (the question pool)

Same per-question fields as `diagnostic_quiz.items` minus `is_gated`:

| API ID | Type |
|---|---|
| `question_number` | Number |
| `unit_tag` | Select — `["Unit 1", ..., "Unit 7"]` |
| `difficulty` | Select — `["Easy", "Medium", "Hard"]` |
| `question_text` | StructuredText |
| `stimulus_image` | Image (optional) |
| `option_a` | Text |
| `option_b` | Text |
| `option_c` | Text |
| `option_d` | Text |
| `correct_answer` | Select — `["A", "B", "C", "D"]` |
| `explanation` | StructuredText |

---

### 3.10 `study_strategy` — 3-card study plan

#### primary

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `lede` | StructuredText `paragraph` |

#### items (3 cards)

| API ID | Type |
|---|---|
| `card_title` | Text — `"Daily (10 min)"`, `"Weekly (30 min)"`, `"Before exam (2 weeks out)"` |
| `card_body` | StructuredText `paragraph` |
| `card_icon` | Text — emoji |

---

### 3.11 `flashcard_carousel` — Tap-to-reveal vocab cards

**Purpose.** Client component. Each card shows term on front, definition on back. Tap to flip.

#### primary

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `lede` | StructuredText `paragraph` |
| `cards_per_view` | Number — default 1 |

#### items (25 cards for AP HuG)

| API ID | Type |
|---|---|
| `term` | Text |
| `definition` | StructuredText `paragraph` |
| `unit_tag` | Select — `["Unit 1", ..., "Unit 7"]` |
| `example` | Text (optional real-world example) |

---

### 3.12 `faq_accordion` — FAQs grouped by category

**Purpose.** Native `<details>/<summary>` accordion. All closed by default. Groups questions by category (Exam prep, Scoring, Study habits, etc.).

#### primary

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `lede` | StructuredText `paragraph` |

#### items (27 FAQs for AP HuG)

| API ID | Type |
|---|---|
| `category` | Select — `["Exam prep", "Scoring", "Study habits", "College credit", "Difficulty", "Logistics"]` |
| `question` | Text |
| `answer` | StructuredText `paragraph` + `strong` + `hyperlink` |

**SEO note.** The rendered HTML should emit `<script type="application/ld+json">` with `FAQPage` schema, matching question/answer text. The component — not the slice — handles this.

---

## 4. Rich-text shape cheat-sheet

Every `StructuredText` field is an **array of blocks**:

```json
[
  { "type": "paragraph", "text": "Plain text.", "spans": [], "direction": "ltr" },
  { "type": "heading2", "text": "A heading.", "spans": [], "direction": "ltr" },
  { "type": "list-item", "text": "First bullet.", "spans": [], "direction": "ltr" }
]
```

**Block types used in this custom type:** `paragraph`, `heading1`, `heading2`, `heading3`, `list-item`.

**Span types used:**

| Type | Shape | Purpose |
|---|---|---|
| `strong` | `{ start, end, type: "strong" }` | Bold text |
| `em` | `{ start, end, type: "em" }` | Italic — component may re-style as color accent |
| `hyperlink` | `{ start, end, type: "hyperlink", data: { link_type: "Web", url: "..." } }` | Inline link |

`start` and `end` are UTF-16 character offsets in the block's `text`.

---

## 5. Link field shape cheat-sheet

| Use | Shape |
|---|---|
| Anchor | `{ "link_type": "Web", "url": "#diagnostic" }` |
| External | `{ "link_type": "Web", "url": "https://example.com" }` |
| Empty | `{ "link_type": "Any" }` |
| Document | `{ "link_type": "Document", "id": "...", "type": "unit_page", "uid": "..." }` |

The Migration API assigns its own `key` property to Link values after POST. The parser should NOT include a `key` — Prismic generates it.

---

## 6. HTML comment convention (proposed)

Every section in the staging HTML is preceded by a machine-readable YAML-in-comment block. The parser strips these comments from the rendered HTML.

```html
<!-- @slice:pillar_hero
     variation: default
     primary:
       eyebrow: "AP Human Geography · Complete Course Guide · Updated for the May 5, 2026 Exam"
       headline:
         - type: heading1
           text: "Score a 5 on AP Human Geography — in 10 minutes a day."
           spans:
             - { start: 37, end: 47, type: em }
       subheadline:
         - type: paragraph
           text: "The complete AP Human Geography course online. One clear path..."
       primary_cta_text: "Start Free — Take the 10-Question Diagnostic →"
       primary_cta_link: { link_type: Web, url: "#diagnostic" }
       secondary_cta_text: "Jump to the 7 Units"
       secondary_cta_link: { link_type: Web, url: "#units" }
     items:
       - stat_number: "7"
         stat_label: "Units Covered"
         stat_caption: "Complete curriculum"
       - stat_number: "1,250+"
         stat_label: "Practice Questions"
         stat_caption: "Largest free bank online"
-->
<section id="hero" class="hero"> ... </section>
```

**Parser rules.**

- Delimiter: `<!-- @slice:<slice_type>` ... `-->`. One block per slice.
- Inside the comment is valid YAML with top-level keys `variation` (optional, defaults to `"default"`), `primary`, and `items`.
- Field values follow the type conventions in sections 3 and 4.
- If a field is omitted, use the typed default: `""` for Text, `[]` for StructuredText, `{ link_type: "Any" }` for Link, `false` for Boolean, `0` for Number, first option for Select, `null` for optional mixed-row fields in `exam_structure.items`.
- Document-level fields (`meta_title`, `canonical_url`, `og_image`, etc.) are extracted from `<head>` — not from slice comments.

---

## 7. Generation order for a new course

When asked to generate a new course (e.g., AP Biology), produce artifacts in this order:

1. **Research pass** — confirm current exam date, pass rate, mean score, unit weights, FRQ format, calculator policy. Use 2026 College Board data; cite sources inline in a delivery note, not in the HTML.
2. **Content blueprint** — one-page outline listing every slice and the 1–3 most important facts that slice needs. Flag anything course-specific (e.g., AP Bio has labs; AP Calc allows calculator).
3. **Staging HTML** — full file following the comment convention above. Include brand typography, brand colors, no placeholder text.
4. **Delivery note** — list anything ambiguous, content choices made, and any slice that was skipped because the source data is unavailable.

---

## 8. Known gotchas

- **Placeholder-vs-real content.** Prismic's UI shows grey placeholder strings inside empty Text fields that visually look filled. Always trust the API, not the editor — fetch the published doc and confirm fields are non-null before declaring the page ready.
- **Publish is required.** Content saved via Migration API lands as a draft. The page renders only after a Prismic user clicks **Publish** and Vercel rebuilds.
- **Vercel cache.** Because `app/[uid]/page.tsx` uses `generateStaticParams`, a Vercel redeploy is required after first-time Prismic publishes for a new UID. After the first successful build, ISR handles subsequent content edits if a Prismic-to-Vercel webhook is configured.
- **Span offsets are UTF-16.** Characters like `—` are 1 unit wide; emoji are 2. Compute span offsets after the text is finalized.
- **`em` in headlines is load-bearing.** The `PillarHero` component styles `<em>` as orange with an underline accent. Use `em` deliberately — not for normal italics.

---

## 9. Validation checklist (run before `--write`)

The migration script's validator should enforce:

- [ ] Document has `type`, `uid`, `lang: "en-us"`, `data`.
- [ ] Every doc-level field from section 1 is present on `data`.
- [ ] `data.slices` is an array; order matches section 2.
- [ ] Each slice has `slice_type`, `variation: "default"`, `version: "initial"`, `primary`, `items`.
- [ ] Every field in `primary` matches its declared type in section 3.
- [ ] Every `StructuredText` value is an array of `{ type, text, spans }` blocks.
- [ ] Every `Link` value has a `link_type`.
- [ ] No field contains an unstyled `<span>` or raw HTML string where rich text is expected.
- [ ] Spans in each block have valid `start <= end` and do not exceed `text.length`.

On failure, exit non-zero with a clear path like `data.slices[3] (exam_structure).items[2].logistics_title: expected string, got null`.

---

*Last reviewed: April 22, 2026. Derived from live Prismic API at `apscore5.cdn.prismic.io/api/v2`.*
