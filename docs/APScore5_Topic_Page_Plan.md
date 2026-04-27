# APScore5 — Topic / Resource Page (Page Type 5)

**Implementation Plan: Custom Type, Slices, Components, GitHub & JS**

*Version 1.0 · April 2026 · Companion to `APScore5_Page_Types_and_Prismic_Slices.docx` and `APScore5_Pillar_Page_Slice_Reference.md`*

---

## 1. Goal

Ship a `topic_page` custom type whose rendered output is **visually indistinguishable** from the two reference HTMLs (`apscore_5_microtopic_page__9_.html` and `apscore_5_microtopic_rostows_stages.html`) — same fonts, color tokens, spacing, motion, and component shapes. Only the global header (`site_header`) and footer (`site_footer`) are replaced with the platform's shared chrome; everything between hero and footer matches the samples pixel-for-pixel.

The output of this plan is a route at `/{course-slug}/{topic-slug}` (e.g., `/ap-human-geography/malthusian-theory`) that an editor authors entirely in Prismic, that an automated Claude skill can draft, that the migration script can publish, and that the validator can gate.

---

## 2. Visual fidelity contract

These tokens are extracted directly from the samples. They are non-negotiable for the topic page and will live in `tokens.css`. No component on the topic page is permitted to introduce its own font, radius, or color outside this set.

### 2.1 Color tokens

| Token | Hex | Where used |
|---|---|---|
| `--navy` | `#0a0f5a` | Hero gradient base, brand text |
| `--navy-2` | `#101973` | Hero gradient end |
| `--blue` | `#7ba3e8` | Hero gradient highlight, accents |
| `--blue-light` | `#eef4ff` | Eyebrow chip background, table header |
| `--orange` | `#f59e0b` | Primary CTA, premium accent |
| `--orange-dark` | `#d97706` | CTA hover |
| `--white` | `#ffffff` | Surface |
| `--text` | `#172033` | Body text |
| `--muted` | `#64748b` | Secondary text, captions |
| `--border` | `#e2e8f0` | Hairlines, card borders |
| `--bg` | `#f8fafc` | Page background |
| `--success` | `#16a34a` | Correct MCQ option |
| `--danger` | `#dc2626` | Incorrect MCQ option |

### 2.2 Type, radius, shadow

- **Font stack:** `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Inter is loaded once at the app layout level. Headings use the same family with tight `letter-spacing: -0.055em` on H1 and `-0.02em` on H2.
- **H1:** `clamp(2.1rem, 5vw, 4rem)`, line-height 1.04.
- **Radius:** `--radius: 22px` for panels, `999px` for chips and buttons, `28px` for the hero progress card.
- **Shadow:** `--shadow: 0 18px 45px rgba(10, 15, 90, 0.10)`.
- **Container:** max-width 1120px, side padding 20px.

### 2.3 Reusable visual components

Lifted directly from the sample CSS — these become CSS modules in `components/topic-page/`:

`.panel`, `.section-eyebrow`, `.simple-box`, `.next-grid`, `.next-card`, `.summary-list`, `.faq-card` (native `<details>`), `.flip-card-stage` + `.flip-card-inner` + `.flip-face`, `.question-card`, `.options`, `.explanation`, `.score-pill`, `.register-inline`, `.sticky-register`, `.video-placeholder`, `.play-circle`, `.micro-ad`, `.inline-ad-after-options`, `.hero-card`, `.hero-stat-grid`, `.progress-bar`, `.progress-fill`.

The implementation copies these classes directly from the samples into the slice components rather than re-styling from scratch — that's how we guarantee zero visual drift.

---

## 3. Custom type: `topic_page`

### 3.1 Document-level fields

These live on `data` directly (not inside any slice), matching the convention from `APScore5_Pillar_Page_Slice_Reference.md` §1. The fields are grouped by purpose: identity, topic attributes, unit context (denormalized), learning attributes, engagement stats (auto-computed), SEO, and lifecycle. Every field's `Authored by` column makes clear who or what fills it.

#### Identity & relationships

| Field | API ID | Type | Authored by | Notes |
|---|---|---|---|---|
| UID | `uid` | UID | Editor | e.g. `malthusian-theory`, `rostows-stages-of-economic-growth` |
| Course | `course_uid` | Content Relationship → `course_pillar_page` | Editor | Drives breadcrumb course label, parent link, and `course_id` derivation |
| Unit | `unit_uid` | Content Relationship → `unit_page` | Editor | Drives breadcrumb unit label, sidebar Unit Path, prev/next nav |
| Related topics | `related_topics` | Group of Content Relationships → `topic_page` | Editor | Powers "Continue learning"; minimum 4 entries |
| Prerequisites | `prerequisites` | Group of Content Relationships → `topic_page` | Editor | Topics the student should know first; surfaces in dashboard "you might want to review" |

#### Topic attributes

| Field | API ID | Type | Authored by | Notes |
|---|---|---|---|---|
| Topic number | `topic_number` | Number | Editor | Position within the unit (1, 2, 3…); validator enforces uniqueness within `unit_uid`; powers prev/next |
| Topic title | `topic_title` | Text | Editor | Used in H1 and breadcrumb |
| Topic summary | `topic_summary` | Text (max 240 chars) | Editor | 1–2 sentence summary for dashboard cards, search results, and OG fallback |
| Estimated time (minutes) | `estimated_time_minutes` | Number (3–30) | Editor | Surfaces in dashboard cards; supports the 5-minute promise |
| Difficulty | `difficulty` | Select — `["foundational", "moderate", "advanced"]` | Editor | Drives personalization in dashboard recommendations |
| FRQ skill | `frq_skill` | Select | Editor | Which FRQ skill this topic builds — see §3.1.1 below for the taxonomy. Powers the AP-readiness skill tracker on the dashboard. |
| Learning objectives | `learning_objectives` | Group of Text (3–5 entries) | Editor | "By the end, you will be able to…" — surfaces in dashboard and JSON-LD `LearningResource` schema |

#### Unit context (denormalized — auto-filled by migration script, validator-enforced)

| Field | API ID | Type | Authored by | Notes |
|---|---|---|---|---|
| Unit number | `unit_number` | Number | Migration script | Mirrored from related `unit_uid.unit_number`. Validator hard-fails on mismatch. |
| Unit title | `unit_title` | Text | Migration script | Mirrored from related `unit_uid.unit_title`. |
| Exam weight | `exam_weight` | Text (e.g., `"12–18%"`) | Migration script | Mirrored from related `unit_uid.exam_weight`. Text not Number because it's a range. |

#### Engagement stats (auto-computed by migration script, validator-enforced)

| Field | API ID | Type | Authored by | Notes |
|---|---|---|---|---|
| Flipcard count | `flipcard_count` | Number | Migration script | Equal to `flashcard_deck.items.length`. |
| MCQ count | `mcq_count` | Number | Migration script | Equal to `practice_mcq_quiz.items.length + quiz_block.items.length`. |
| Question count | `question_count` | Number | Migration script | Equal to `flipcard_count + mcq_count`. Used in dashboard "questions practiced" total. |

#### SEO / Meta

| Field | API ID | Type | Authored by | Notes |
|---|---|---|---|---|
| Meta title | `meta_title` | Text | Editor | `<title>` — pattern: `What is {topic}? \| {course} \| APScore5` |
| Meta description | `meta_description` | Text | Editor | ~155 chars |
| Canonical URL | `canonical_url` | Link (Web) | Editor | `https://apscore5.com/{course-slug}/{topic-slug}` |
| OG image | `og_image` | Image | Editor or Migration script | Open Graph share card; defaults to `topic_banner` if blank |
| Primary keyword | `primary_keyword` | Text | Editor | The single SEO target the page is built around. Used by the validator for the 65% heading-match rule. |
| Secondary keywords | `secondary_keywords` | Group of Text | Editor | Long-tail variations; not validator-enforced but surfaced in the keyword-mapper skill |

#### Lifecycle

| Field | API ID | Type | Authored by | Notes |
|---|---|---|---|---|
| Published at | `published_at` | Date | Set on first publish (system) | First-publish timestamp; never changes after creation |
| Last reviewed | `last_reviewed` | Date | Editor / refresh skill | Surfaces in `topic_hero` kicker; required for freshness signal; updated weekly |
| No index | `no_index` | Boolean | Editor | Default `false`. `true` for staging/test docs only |

**Note on color.** Orange `#f59e0b` is the universal CTA / accent color across every course's topic page — there is no per-course accent tinting at the topic level. The `topic_banner` image carries the course-specific visual identity; everything else (CTAs, progress fills, callout borders, premium chips) uses the platform orange. This matches the reference samples 1:1.

#### 3.1.1 FRQ skill taxonomy

The `frq_skill` Select carries the AP-readiness categories. The taxonomy is shared across courses but each course's content team confirms which skills apply.

| Value | Meaning | Typical AP question verbs |
|---|---|---|
| `define_identify` | Recall a term, name, or concept | "Identify…", "Define…", "Name…" |
| `describe_explain` | State the mechanism or process | "Describe…", "Explain how…" |
| `compare_contrast` | Show similarities and differences between two concepts | "Compare…", "Contrast…", "Distinguish…" |
| `cause_effect` | Connect a cause to a consequence (or vice versa) | "Explain why…", "What causes…?" |
| `evaluate_argue` | Defend a position with evidence | "Evaluate the extent to which…", "Make an argument…" |
| `apply_concept` | Use a model or theory in a new scenario | "Apply…", "How would [model] explain…?" |
| `read_visual` | Extract information from a map, graph, chart, or image | "Using the map/graph/chart…" |

The dashboard surfaces a per-skill mastery bar — a student who has practiced 3 topics in `cause_effect` sees their progress on that skill specifically, not just an aggregate score. This is what your `frq_skill` field is doing in the schema.

### 3.2 Slice zone (canonical order)

The renderer emits slices in this order. If a slice is missing, it's skipped with a warning — never a hard fail.

1. `topic_banner` — wide course-tinted banner
2. `topic_hero` — title, breadcrumb, badge, lede, CTAs, progress aside
3. `simple_explanation` — eyebrow + H2 + paragraph + AP-shortcut callout
4. `video_summary` — eyebrow + H2 + paragraph + 90-second video embed
5. `flashcard_deck` — sequential flip cards with ad pacing
6. `card_grid` *(repeatable across the page)* — 2/3/4-column card grid; used for real-world examples, case studies, application clues, word-count expansion, continue-learning, etc.
7. `definition_block` — eyebrow + H2 + 3-paragraph definition triple (Definition / Simple terms / AP exam use)
8. `deep_dive` — eyebrow + H2 + collapsible 30-second deep-dive
9. `comparison_table` — eyebrow + H2 + paragraph + 3-column comparison
10. `text_block` — single-column eyebrow + H2 + body (e.g. "Why students get this wrong")
11. `summary_list` — eyebrow + H2 + checked bullets (memory hooks, mistakes, mini summary)
12. `practice_mcq_quiz` — 5 inline preview MCQs with ad-after-options + score feedback
13. `frq_skill` — eyebrow + H2 + paragraph + sample-sentence callout + checked bullets
14. `register_block` — eyebrow + H2 + paragraph + register-inline CTA
15. `quiz_block` — **30-question gated AP-style test (10 easy + 10 medium + 10 hard)**, ad after every 2 answers, video ad at difficulty transitions, detailed feedback signup-gated
16. `progress_path` — eyebrow + H2 + paragraph + 4-step grid + score-nudge callout
17. `faq_accordion` — eyebrow + H2 + paragraph + repeatable Q/A (renders FAQPage JSON-LD)
18. `final_recap` — eyebrow + H2 + 2 callouts + summary list + register-inline (closing)

Slices 6 and 11 are reused multiple times in the same document. The `card_grid` slice carries a `variation` of `2_col` / `3_col` / `4_col` and a `with_links` boolean controlling whether each card is a hyperlink. The samples use `card_grid` six different times — keeping it as one slice with variations is what lets editors compose pages without ballooning the slice count.

The two quiz slices have different jobs: `practice_mcq_quiz` (slice 12) is a 5-question inline preview that lives in the page flow and pulls users into the funnel; `quiz_block` (slice 15) is the gated 30-question full test, sitting after the registration push so saving progress unlocks the value.

### 3.3 Slices that are *not* on this page

- **Sidebar (right column with Unit Path, Progress Tracking card, Premium upsell)** — global Next.js component, not a Prismic slice. Same component is reused on unit pages. Driven by `unit_uid` relationship + Supabase progress + Stripe entitlement.
- **Sticky register bar** — global Next.js component, hidden for premium users via Supabase entitlement check.
- **Site header / footer** — global chrome from `APScore5_Page_Types_and_Prismic_Slices.docx` §6.2.
- **Display ads** — injected by the `flashcard_deck` and `practice_mcq_quiz` slice components themselves at the cadence specified in the parent doc (every 5 cards, every 2 questions). They are not separate slices.

---

## 4. Slice contracts

This section extends the contract pattern from `APScore5_Pillar_Page_Slice_Reference.md` §3. Every slice envelope is:

```json
{ "slice_type": "<api_id>", "slice_label": null, "variation": "default", "version": "initial", "primary": {…}, "items": [...] }
```

Only the new shapes are documented below. Existing shapes (StructuredText blocks, span types, Link shapes) are inherited from the pillar reference §4 and §5.

### 4.0 Heading hierarchy (applies to every slice)

The page is structured for both human readability and crawler/AEO snippet extraction. Editors get the full H1 → H2 → H3 → H4 range; the schema enforces where each level may appear.

| Level | Where it appears | Field type |
|---|---|---|
| **H1** | Topic title — exactly once per page | `topic_hero.headline` (StructuredText, `single: heading1`) |
| **H2** | Each slice's section headline — every other slice | `<slice>.headline` (StructuredText, `single: heading2`) |
| **H3** | Sub-section titles, card titles, step titles, flashcard front/back, definition sub-blocks | Dedicated H3 fields (StructuredText, `single: heading3`) **OR** inline within any body field |
| **H4** | Deep sub-sections inside long body content (rare but allowed) | Inline within any body field |

**Body rich-text fields** (`body`, `card_body`, `step_body`, `bullet`, `answer`, etc.) accept `paragraph, heading3, heading4, strong, em, hyperlink, list-item, o-list-item`. Editors can structure content properly when a section needs sub-divisions.

**Callout fields** (`ap_shortcut`, `score_feedback`, `gate_message`, `sample_sentence`, `shortcut_callout`, `confidence_callout`) accept `paragraph, strong, em, hyperlink` only — no headings. These render as highlighted prose blocks (`.simple-box`), not sections, so a heading inside them would break the document outline.

**Slices with explicit H3 sub-fields:**
- `card_grid.items[].card_title` — H3
- `progress_path.items[].step_title` — H3
- `flashcard_deck.items[].front_text` and `.back_text` — H3
- `definition_block` — three H3 sub-blocks (definition / simple terms / AP exam use) each with their own heading + paragraph

**FAQ questions stay as plain Text** (not H3). They render inside the native `<summary>` element of `<details>`, and the `FAQPage` JSON-LD schema handles SEO regardless. Wrapping a `<summary>` content in an H3 would be redundant and visually noisy.

The validator enforces: exactly one H1 in the rendered DOM, no skipped levels (no H2 followed directly by H4 without an H3 in between), and the `simple_explanation` slice's first paragraph carries the AEO snippet target as already specified.

### 4.1 `topic_banner`

**Purpose.** Wide course-tinted banner above the hero. Pulled from the branded banner system in `APScore5_Claude_Skills_and_Banner_System.docx` §5.

**primary**

| API ID | Type |
|---|---|
| `banner_image` | Image (1600×600) |
| `banner_alt` | Text — required, validator-enforced |

No `items`.

### 4.2 `topic_hero`

**Purpose.** First above-the-fold block. Carries breadcrumb, engagement badge, H1, lede, two CTAs, and the progress aside with 4 stat tiles.

**primary**

| API ID | Type |
|---|---|
| `breadcrumb_text` | Text — `"AP Human Geography › Unit 2 › Population & Migration"` |
| `badge_text` | Text — `"⚡ High-engagement microtopic lesson"` |
| `headline` | StructuredText `heading1` |
| `lede` | StructuredText `paragraph` (with `strong` spans permitted) |
| `primary_cta_text` | Text |
| `primary_cta_link` | Link (Web, anchor `#video` typical) |
| `secondary_cta_text` | Text |
| `secondary_cta_link` | Link (Web, anchor `#cards` typical) |
| `progress_label` | Text — `"Unit 2 Progress"` |
| `progress_percent` | Number 0–100 — used for logged-in users from Supabase. **Guests see a static "Sign in to see your progress" pill instead of a percentage** — the bar is rendered empty with a CTA overlay. |
| `progress_caption` | StructuredText `paragraph` |

**items** (4 stat tiles, fixed length)

| API ID | Type |
|---|---|
| `stat_value` | Text — `"10"`, `"5"`, `"12–18%"`, `"3 → 4+"` |
| `stat_label` | Text |

### 4.3 `simple_explanation`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `ap_shortcut` | StructuredText `paragraph` (rendered inside `.simple-box`) |

No `items`.

### 4.4 `video_summary`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `video_embed_url` | Link (Web) — YouTube embed; nullable until video is published 48–72h after launch |
| `video_thumbnail` | Image — fallback before embed lands |
| `video_caption` | Text |

No `items`.

### 4.5 `flashcard_deck`

**Purpose.** Sequential flip cards. Tap reveals back. Ad shown after every 5th card. Component handles state and ad injection — Prismic only carries the data.

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `ad_pacing_every_n` | Number — default 5 |

**items** (10 cards, validator-enforced minimum/maximum 8–12)

| API ID | Type |
|---|---|
| `kicker` | Select — `["Definition", "Core idea", "AP phrase", "Example", "Criticism", "Comparison", "Exam trap", "FRQ skill", "Final check"]` |
| `front_text` | StructuredText `heading3` |
| `back_text` | StructuredText `heading3` |

### 4.6 `card_grid`

**Purpose.** General-purpose 2/3/4-column card grid, used many times. Variations differentiate column count; a per-card optional link makes it serve both "next learning" cards (linked) and "real-world examples" (unlinked).

**variations:** `two_col`, `three_col`, `four_col` *(default = `four_col`)*

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` (optional) |
| `with_links` | Boolean — when true, each item is a hyperlink card |
| `closing_callout` | StructuredText `paragraph` (optional, rendered as `.simple-box` below the grid; used by `progress_path`) |

**items**

| API ID | Type |
|---|---|
| `card_title` | StructuredText `heading3` |
| `card_body` | StructuredText `paragraph` |
| `card_link` | Link (Web or Document) — required when `with_links = true` |

### 4.7 `definition_block`

Three H3 sub-blocks, each with its own heading and paragraph. This structure is far better for SEO and AEO snippet extraction than the strong-led paragraph pattern — each sub-block becomes a queryable target ("malthusian theory definition" → first H3, "malthusian theory in simple terms" → second H3, etc.).

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `definition_h3` | StructuredText `heading3` — e.g., `"Malthusian Theory definition"` |
| `definition_paragraph` | StructuredText `paragraph` |
| `simple_terms_h3` | StructuredText `heading3` — e.g., `"In simple terms"` |
| `simple_terms_paragraph` | StructuredText `paragraph` |
| `ap_use_h3` | StructuredText `heading3` — e.g., `"AP Human Geography use"` |
| `ap_use_paragraph` | StructuredText `paragraph` |

No `items`.

### 4.8 `deep_dive`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `summary_label` | Text — `"Open the 30-second explanation"` default |
| `body` | StructuredText `paragraph` (with `strong`, `em`, `hyperlink` spans) |

Renders as native `<details><summary>` collapsed by default.

### 4.9 `comparison_table`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `column_1_label` | Text — `"Concept"` |
| `column_2_label` | Text — `"Main focus"` |
| `column_3_label` | Text — `"AP exam clue"` |

**items** (3–6 rows)

| API ID | Type |
|---|---|
| `cell_1` | Text (or StructuredText to allow `strong`) |
| `cell_2` | StructuredText `paragraph` |
| `cell_3` | StructuredText `paragraph` |

### 4.10 `text_block`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` (multiple paragraphs allowed) |

### 4.11 `summary_list`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` (optional) |

**items**

| API ID | Type |
|---|---|
| `bullet` | StructuredText `paragraph` (with `strong` spans for the lede) |

### 4.12 `practice_mcq_quiz`

**Purpose.** Inline AP-style MCQ block. The samples show 1 question; the spec calls for 5 inline. Ads inject after each question's options. Detailed feedback is signup-gated.

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `score_feedback` | StructuredText `paragraph` (rendered as `.simple-box` after submission) |

**items** (5 questions)

| API ID | Type |
|---|---|
| `question_index` | Number |
| `course_label` | Text — `"AP Human Geography"` |
| `question_stem` | StructuredText `paragraph` |
| `option_a` | Text |
| `option_b` | Text |
| `option_c` | Text |
| `option_d` | Text |
| `correct_index` | Select — `["1","2","3","4"]` |
| `explanation` | StructuredText `paragraph` |

### 4.13 `frq_skill`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `sample_sentence` | StructuredText `paragraph` (rendered as `.simple-box`) |

**items**

| API ID | Type |
|---|---|
| `bullet` | StructuredText `paragraph` |

### 4.14 `register_block`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `tracker_lede` | Text — `"Your free progress dashboard will track:"` |
| `tracker_items` | Text — pipe-delimited or join-rendered: `"Completed topics | Question accuracy | Weak units | Daily streak | Test readiness"` |
| `cta_text` | Text |
| `cta_link` | Link (Web) — `/signup?next=…` |

### 4.15 `quiz_block` — full 30-question gated test

**Purpose.** End-of-topic AP-style test. 30 questions split 10 easy / 10 medium / 10 hard. Detailed feedback, score breakdown, and weak-area tagging are signup-gated. Display ad shown after every 2 answers (pacing rule from `APScore5_Page_Types_and_Prismic_Slices.docx` §6.2). Video ad shown at the easy→medium and medium→hard difficulty transitions.

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text — `"Take the full test"` |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |
| `gate_message` | StructuredText `paragraph` — copy shown to guests after question 3 (encourages signup) |
| `pass_threshold_percent` | Number — default 70; used for "ready to advance" feedback messaging |
| `display_ad_every_n` | Number — default 2 |
| `video_ad_at_difficulty_transitions` | Boolean — default `true` |

**items** (exactly 30 questions, validator-enforced)

| API ID | Type |
|---|---|
| `difficulty` | Select — `["easy", "medium", "hard"]` |
| `question_index` | Number 1–30 |
| `question_stem` | StructuredText `paragraph` |
| `question_image` | Image (optional — for image-based MCQs in courses like AP Bio, AP Physics) |
| `question_image_alt` | Text (required when `question_image` is present) |
| `option_a` | Text |
| `option_b` | Text |
| `option_c` | Text |
| `option_d` | Text |
| `correct_index` | Select — `["1","2","3","4"]` |
| `explanation` | StructuredText `paragraph` |
| `exam_tip` | Text — short AP-strategy hint shown after the answer |
| `related_topic` | Link (Document → `topic_page`) — for "review this concept" link in feedback |

**Validator rules specific to this slice:**
- `items.length === 30` (hard fail otherwise)
- Exactly 10 items at each difficulty (`easy`, `medium`, `hard`)
- Items must be ordered: 10 easy → 10 medium → 10 hard (so the difficulty-transition video ads land in the right slots)
- Every question must have an `explanation` and `exam_tip`
- Every question must reference a `related_topic` (broken doc relationships are a fail)

**Behavior:**
- Guests can attempt the first 3 questions ungated. After question 3, a soft signup gate appears (the `gate_message` block); they can dismiss it once and continue, but full feedback unlock requires account creation.
- Logged-in free members get the full test, full feedback, and weak-area tags saved to their dashboard.
- Premium users get the full test with no ads and no signup gate.

### 4.16 `progress_path`

Implemented as a `card_grid` variation with `closing_callout`. See §4.6.

### 4.17 `faq_accordion`

**Purpose.** The bulk word-count carrier. All closed by default. Renders FAQPage JSON-LD in the slice component.

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `body` | StructuredText `paragraph` |

**items** (8–14 FAQs, validator-enforced minimum 6)

| API ID | Type |
|---|---|
| `category` | Select — `["Definition", "Real-life example", "Validity", "Criticism", "Comparison", "AP exam use", "History", "Logistics"]` |
| `question` | Text |
| `answer` | StructuredText `paragraph` (with `strong`, `em`, `hyperlink`) |

### 4.18 `final_recap`

**primary**

| API ID | Type |
|---|---|
| `eyebrow` | Text |
| `headline` | StructuredText `heading2` |
| `shortcut_callout` | StructuredText `paragraph` (rendered as `.simple-box`) |
| `confidence_callout` | StructuredText `paragraph` (rendered as `.simple-box`) |
| `next_topic_lede` | Text |
| `next_topic_caption` | Text |
| `next_topic_cta_text` | Text |
| `next_topic_cta_link` | Link (Document → `topic_page`) |

**items**

| API ID | Type |
|---|---|
| `bullet` | StructuredText `paragraph` |

---

## 5. Wireframe — what changes

The current wireframe in `APScore5_Page_Wireframes.html` shows the topic page with 10 slices. The updated wireframe (delivered as `APScore5_Topic_Page_Wireframe.html`) reflects the 17-slice composition above. Key visual changes vs the old wireframe:

The hero gains a right-side **progress aside** with a 4-stat grid and an inline progress bar — mirroring the samples. The old wireframe showed a single-column hero. After the hero, a **simple_explanation** slice is inserted before the video to deliver the AP-shortcut callout early (this is the page's primary AEO answer block; AEO crawlers want the direct answer in the first 200 words). The **flashcard_deck** moves up to position 5 (was further down) because in the samples it follows the video summary directly — this matches the pacing the samples use to build engagement before introducing dense text. New blocks added between the existing `concept_explanation` and `quiz_block` of the old spec: **definition_block**, **deep_dive**, **comparison_table**, **text_block** (student confusion), **summary_list** ×3 (memory hooks, mistakes, mini summary), **practice_mcq_quiz**, **frq_skill**, **register_block**, **progress_path**. A **final_recap** closes the page above the FAQ-after-FAQ position.

The right-rail sidebar (Unit Path, Progress Tracking, Premium box) and the bottom sticky-register bar are added as global Next.js components. Both were absent from the old wireframe.

A focused visual wireframe for just the topic page is delivered alongside this plan.

---

## 6. GitHub repository structure

The topic page lives inside the existing Next.js monorepo (assumed root: `apscore5-web/`). New files only — no existing files are renamed.

```
apscore5-web/
├── app/
│   └── [course-uid]/
│       └── [topic-uid]/
│           ├── page.tsx                 ← route handler (NEW)
│           ├── opengraph-image.tsx      ← per-topic OG image (NEW)
│           └── not-found.tsx            ← 404 fallback for unmatched UIDs
├── components/
│   └── topic-page/
│       ├── TopicBanner.tsx              ← slice 1
│       ├── TopicHero.tsx                ← slice 2
│       ├── SimpleExplanation.tsx        ← slice 3
│       ├── VideoSummary.tsx             ← slice 4
│       ├── FlashcardDeck.tsx            ← slice 5 (carries flip + ad logic)
│       ├── CardGrid.tsx                 ← slice 6 (variations: 2/3/4 col)
│       ├── DefinitionBlock.tsx          ← slice 7
│       ├── DeepDive.tsx                 ← slice 8
│       ├── ComparisonTable.tsx          ← slice 9
│       ├── TextBlock.tsx                ← slice 10
│       ├── SummaryList.tsx              ← slice 11
│       ├── PracticeMcqQuiz.tsx          ← slice 12 (carries MCQ + ad logic)
│       ├── FrqSkill.tsx                 ← slice 13
│       ├── RegisterBlock.tsx            ← slice 14
│       ├── QuizBlock.tsx                ← slice 15 (30-question gated test, ad pacing, transition video ads)
│       ├── ProgressPath.tsx             ← slice 16 (wraps CardGrid)
│       ├── FaqAccordion.tsx             ← slice 17 (emits FAQPage JSON-LD)
│       ├── FinalRecap.tsx               ← slice 18
│       ├── TopicSidebar.tsx             ← global sidebar (Unit Path / Tracking / Premium)
│       ├── StickyRegisterBar.tsx        ← global sticky bar (premium-aware)
│       └── topic-page.module.css        ← all sample CSS lifted verbatim
├── lib/
│   ├── prismic/
│   │   ├── client.ts                    ← existing
│   │   ├── types.generated.ts           ← regenerated after custom type lands
│   │   └── topic-page.fragments.ts      ← GraphQuery fragments for the route (NEW)
│   ├── seo/
│   │   ├── breadcrumb-schema.ts         ← BreadcrumbList JSON-LD
│   │   ├── faq-schema.ts                ← FAQPage JSON-LD
│   │   └── article-schema.ts            ← LearningResource / Article schema
│   └── progress/
│       └── topic-progress.ts            ← Supabase read for hero progress aside
├── customtypes/
│   └── topic_page/
│       └── index.json                   ← Prismic Custom Type JSON (NEW)
├── slices/
│   └── (one folder per slice — auto-generated by Slice Machine)
├── scripts/
│   ├── html-to-prismic.cjs              ← existing — extend to handle new slices
│   └── validators/
│       └── topic-page.js                ← validator extension (NEW)
└── docs/
    └── APScore5_Topic_Page_Plan.md      ← this file, committed for reference
```

### 6.1 Branching workflow

Per `Tools_and_Methodology` and `Content_Creation_Workflow`:

- `main` — production. Public, indexable.
- `dev` — integration branch.
- `feature/topic-page-custom-type` — this work. Vercel preview on every push, password-protected, `noindex` via env-flag in `next.config.js`.
- Open PR `feature/topic-page-custom-type → dev`. Reviewer merges. After end-to-end validation on `dev` preview, PR `dev → main`. Production deploys on merge.

### 6.2 Environment separation guarantees

- Preview deployments serve `X-Robots-Tag: noindex, nofollow` on every route. Logic lives in `middleware.ts` reading `process.env.VERCEL_ENV !== 'production'`.
- Prismic draft content is only fetched when `?preview=true` and a valid `prismic-preview` cookie is present — prevents draft content from appearing on live URLs.
- The `topic_page` route uses `generateStaticParams()` over published Prismic UIDs at build time + ISR (`revalidate: 60`) so weekly content refreshes propagate without a Vercel redeploy.

### 6.3 GitHub Actions

Two workflows added:

`.github/workflows/topic-page-validate.yml` — runs on every PR touching `app/[course-uid]/[topic-uid]/**`, `components/topic-page/**`, or `customtypes/topic_page/**`. Steps: install, lint, typecheck, run `scripts/validators/topic-page.js` against every published topic in Prismic, fail the PR on any validator error.

`.github/workflows/prismic-types-sync.yml` — runs on every push to `dev` and `main`. Calls `slicemachine push` to keep the Prismic custom-type definition in lockstep with what's checked in. Prevents the Prismic UI definition from drifting away from the repo.

---

## 7. Next.js component architecture

### 7.1 Route handler (`app/[course-uid]/[topic-uid]/page.tsx`)

Responsibilities:

The route fetches the `topic_page` document by `course_uid + topic_uid` from Prismic using the GraphQuery fragment in `topic-page.fragments.ts` (which expands `course_uid`, `unit_uid`, and `related_topics` content relationships in a single call). It calls `generateMetadata` to emit `<title>`, `<meta description>`, OpenGraph, Twitter card, and canonical link tags from the doc-level fields. It composes `BreadcrumbList`, `FAQPage`, and `LearningResource` JSON-LD into a single `<script type="application/ld+json">` block. It invokes `<SliceZone>` which iterates `data.slices` and renders the matching component from `components/topic-page/`. The right-rail sidebar (`<TopicSidebar>`) and bottom sticky bar (`<StickyRegisterBar>`) are rendered outside the slice zone; both receive Supabase progress + Stripe entitlement state from server-side fetch.

### 7.2 Slice components

Each slice component is a server component by default. Four slices upgrade to client components because they carry interactivity:

`FlashcardDeck.tsx`, `PracticeMcqQuiz.tsx`, `QuizBlock.tsx`, and `StickyRegisterBar.tsx` declare `"use client"` at the top. All other slice components are server-rendered, which means the page ships almost no JS by default — critical for the SEO target (LCP under 1.8s, total JS under 50kb on initial render before client hydration).

The CSS is a single CSS Module (`topic-page.module.css`) lifted verbatim from the samples and imported once at the route level. Tailwind is **not** used on this page — the samples are hand-rolled CSS, and replicating them in Tailwind would risk subtle drift. Sticking to the original CSS guarantees fidelity.

**Inter is self-hosted via `next/font/google`.** Loaded once in `app/layout.tsx`:

```ts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
```

This is the Next.js 14+ default best practice and is the right call here because: (1) Next.js inlines the font CSS at build time, eliminating an extra DNS lookup to `fonts.googleapis.com` on first paint; (2) the `font-display: swap` strategy is configured to prevent CLS (Cumulative Layout Shift) from affecting Core Web Vitals; (3) no user data leaks to Google's font CDN, which matters because we have minor users; (4) it works offline / under flaky networks. Using `<link>` to Google Fonts directly would lose all four benefits for zero gain.

### 7.3 ISR + on-demand revalidation

`export const revalidate = 60;` on the route. A Prismic webhook hits `/api/revalidate?path=/{course}/{topic}` whenever an editor publishes, so urgent corrections go live in seconds rather than waiting 60s.

---

## 8. Frontend JS interactions

Four interactive surfaces. Each lives inside its slice component; nothing touches the global window beyond Supabase auth state.

**Flashcard deck** — state hooks: `currentCard`, `flipped`. Click on `.flip-card-stage` toggles `.flipped` class. `Next` increments `currentCard`, `Prev` decrements. After every Nth card (from `ad_pacing_every_n`, default 5), the `.micro-ad` slot becomes visible. The full card array comes from props; no fetch. Keyboard handling: Space and Enter flip; left/right arrows navigate. Lifted directly from the sample's bottom `<script>` block — only converted from imperative DOM to React state.

**Practice MCQ** (5-question preview) — state hooks: `currentQuestion`, `selectedIndex`, `submitted`. Click on an `.option` button sets `selectedIndex`, locks the other options (`disabled = true`), reveals the explanation, sets the correct/incorrect classes, and unlocks `Next Question`. Score feedback (`scoreFeedback`) appears once any answer is submitted. After the 2nd answer, an inline `.inline-ad-after-options` slot becomes visible (cadence rule from `APScore5_Page_Types_and_Prismic_Slices.docx`). After question 5, the score-pill text changes to "Save your progress to continue" if the user is unauthenticated.

**Quiz block** (30-question gated test) — state hooks: `currentQuestion`, `answers[]`, `gateShown`, `entitlement`. Same per-question interaction model as the practice MCQ, but with three additional behaviors. (1) **Ad pacing:** display ad slot toggles visible after every 2nd answer; on questions 11 and 21 (the difficulty-transition slots), a video ad slot replaces the display slot. (2) **Soft signup gate:** for guests, after question 3, the `gate_message` block slides into view with `Save progress to continue` and `Continue without saving` actions. Choosing the latter dismisses the gate for the rest of this attempt; the gate re-appears at the score screen for full feedback unlock. (3) **Score screen:** after question 30, the component computes percentage by difficulty bucket, renders the score breakdown, and writes results to `quiz_attempts` in Supabase if the user is authenticated. Premium users skip all ad slots and the gate entirely — the entitlement flag short-circuits both branches.

**Sticky register bar** — visibility state: hidden if `entitlement === 'premium'`, hidden if dismissed (sessionStorage flag), shown otherwise. Reads `entitlement` from a server component prop wrapped in a client provider. CSS transform-based slide-in after 200ms scroll.

No other JS. The hero progress bar, FAQ accordions, and all other animations are pure CSS — `<details>` for FAQ, transitions for hover, no client work needed.

---

## 9. SEO / AEO requirements

### 9.1 On-page

| Requirement | Source field | Renderer |
|---|---|---|
| `<title>` | `meta_title` | `generateMetadata` |
| `<meta name="description">` | `meta_description` | `generateMetadata` |
| `<link rel="canonical">` | `canonical_url` | `generateMetadata` |
| OpenGraph + Twitter card | `og_image` + meta fields | `generateMetadata` |
| `BreadcrumbList` JSON-LD | `course_uid` + `unit_uid` + `topic_title` | route handler |
| `FAQPage` JSON-LD | `faq_accordion.items[]` | `FaqAccordion.tsx` |
| `LearningResource` JSON-LD | doc-level + slices | route handler |
| `lastReviewed` visible date | `last_reviewed` | `TopicHero.tsx` kicker |

### 9.2 AEO

The first 200 words after H1 carry the direct answer. The `simple_explanation` slice runs immediately after the hero precisely so the AP-shortcut callout (`<strong>AP exam shortcut:</strong> Population grows fast → food grows slower → pressure builds.`) lands inside the first paragraph block — answer engines extract this as the snippet. The validator enforces this: the first paragraph of `simple_explanation` must contain at least one sentence ≤25 words that begins with `<strong>`.

### 9.3 Sitemap + robots

`app/sitemap.ts` queries Prismic for every published `topic_page` and emits a URL entry per page with `lastmod = last_reviewed`, `changefreq = weekly`, `priority = 0.7`. `robots.txt` allows everything under `/{course}/{topic}` and disallows `/dashboard`, `/signup`, `/login`. Preview environments emit `Disallow: /` via `middleware.ts`.

---

## 10. Migration & validator

### 10.1 Parser extension

`scripts/html-to-prismic.cjs` (existing, defined in `APScore5_Pillar_Page_Slice_Reference.md` §6) is extended with handlers for the 18 topic slices. The HTML comment convention from §6 of that file is preserved — every section in a Claude-generated topic HTML carries `<!-- @slice:topic_hero ... -->` etc. The parser registers new handlers under `parsers/topic/*.js`, each implementing the same signature: `(yamlBlock, sectionEl) => primaryAndItems`.

**Auto-fill step (new for topic pages).** Before writing the document, the migration script runs an `enrich(doc)` step that (a) fetches the related `unit_uid` document and copies `unit_number`, `unit_title`, and `exam_weight` onto the topic doc; (b) computes `flipcard_count`, `mcq_count`, and `question_count` from the slice items it just parsed; (c) sets `published_at` if this is a first-publish (idempotent — never overwrites). The validator then sanity-checks all auto-filled values before the doc is POSTed to Prismic. This is the mechanism that prevents drift between unit-level facts and the topic copies of them.

### 10.2 Validator (`scripts/validators/topic-page.js`)

The validator runs on every PR and on every published topic on `dev`. It enforces:

- Document has `type: "topic_page"`, `lang: "en-us"`, all required doc-level fields populated.
- `data.slices` ordered per §3.2; missing slices logged as warnings, never errors.
- Hero progress aside has exactly 4 stat tiles.
- `flashcard_deck.items` is 8–12 entries.
- `practice_mcq_quiz.items` is exactly 5 entries; every item has a valid `correct_index`.
- `quiz_block.items` is exactly 30 entries; exactly 10 at each difficulty (`easy`, `medium`, `hard`); items ordered easy → medium → hard; every item has `explanation`, `exam_tip`, and a resolvable `related_topic`.
- `comparison_table` has 3–6 rows.
- `faq_accordion.items` is at least 6 entries.
- Every `card_grid` with `with_links = true` has a non-empty `card_link` on every item.
- Banner alt text non-empty.
- Banned words list (`Banned_Words` project file) intersects zero with concatenated body text.
- ≤65% of headings match `primary_keyword` (humanization checklist rule from `APScore5_Claude_Skills_and_Banner_System.docx` §3.2).
- AEO check: first paragraph of `simple_explanation` contains a sentence ≤25 words beginning with `<strong>`.
- All link UIDs resolve to existing Prismic documents (no broken document relationships).

**Heading hierarchy rules (§4.0):**

- The rendered DOM contains exactly one H1, sourced from `topic_hero.headline`.
- Every other slice's `headline` field renders as H2.
- No heading level skipped — an H4 in body content is invalid unless an H3 precedes it within the same slice.
- `card_grid.items[].card_title`, `progress_path.items[].step_title`, and the three `definition_block` sub-headings render as H3.
- Callout fields (`ap_shortcut`, `score_feedback`, `gate_message`, `sample_sentence`, `shortcut_callout`, `confidence_callout`) contain no heading blocks — only `paragraph`, `strong`, `em`, `hyperlink`. The validator inspects the StructuredText array and rejects any block with `type` matching `heading*`.

**Metadata-specific rules (§3.1):**

- `topic_number` is unique within `unit_uid` — no two topics in the same unit can claim position 4.
- `unit_number === unit_uid.unit_number`, `unit_title === unit_uid.unit_title`, `exam_weight === unit_uid.exam_weight`. The migration script auto-fills these; the validator hard-fails on any drift.
- `flipcard_count === flashcard_deck.items.length`.
- `mcq_count === practice_mcq_quiz.items.length + quiz_block.items.length`.
- `question_count === flipcard_count + mcq_count`.
- `estimated_time_minutes` between 3 and 30 (sanity bound).
- `difficulty` is one of `["foundational", "moderate", "advanced"]`.
- `frq_skill` is one of the values in §3.1.1 taxonomy.
- `learning_objectives` has 3–5 entries; each is non-empty Text.
- `topic_summary` is ≤240 chars.
- `primary_keyword` is non-empty and appears in the H1 (`topic_hero.headline`).
- `published_at` is never edited after first publish (the migration script writes-once and the validator catches mutations).
- `last_reviewed` is within the last 14 days for production publishes (warns if older — the weekly refresh skill should keep this current).

The validator exits non-zero with a path like `data.flipcard_count: expected 10 (from flashcard_deck.items), got 8` — same UX as the existing pillar validator.

---

## 11. Claude content skill

The existing skill `Create a Blog (Topic) Page` (catalogued in `APScore5_Claude_Skills_and_Banner_System.docx` §2.2) is rewritten against this plan. The new skill:

Reads the brand tone file, banned-words list, the target keyword, and the target unit. Reads `course_uid` and `unit_uid` to pull the parent course pillar's slice content for tone consistency. Produces the outline first (slice list with H2s and section eyebrow text per §3.2). Drafts each slice's content in the format demanded by §4 of this plan, embedding the YAML-in-comment block per the parser convention. Generates the banner prompt for the `topic_banner` slice using the course color token and motif. Runs the humanization checklist before delivery. Outputs a single staging HTML file that the parser can convert deterministically into a Prismic document.

Skill output checklist:

- 18 sections, each with `<!-- @slice:... -->` header and matching HTML.
- 10 flashcards with kicker/front/back.
- 5 inline preview MCQs with correct answers and explanations.
- 30 full-test questions split 10 easy / 10 medium / 10 hard, each with explanation, exam tip, and `related_topic` reference.
- 8–14 FAQs.
- 3-row comparison table.
- 4 cards in each `card_grid` invocation.
- Banner prompt at the top of the file as a comment (consumed by the banner-image skill in a follow-up step).

---

## 12. Heading Hierarchy Guide

A topic page must read like a properly outlined document, not a flat list of H2s. The hierarchy below is what every published topic page produces in its rendered HTML — it gives one H1, ~20 H2s for major sections, ~50 H3s for sub-elements (cards, question stems, FAQ questions), with H4 available inside long-form rich text bodies.

### 12.1 The outline

```
H1  Topic title                                             [topic_hero.headline]
│
├─ H2  Simple explanation                                   [simple_explanation.headline]
│
├─ H2  Watch the 90-second summary                          [video_summary.headline]
│
├─ H2  Master one idea at a time                            [flashcard_deck.headline]
│   ├─ H3  Front of card 1                                  [flashcard_deck.items[0].front_text]
│   ├─ H3  Back of card 1                                   [flashcard_deck.items[0].back_text]
│   └─ ... (10 cards × 2 faces = 20 H3s)
│
├─ H2  Where it shows up in real life                       [card_grid.headline]
│   ├─ H3  Food insecurity                                  [card_grid.items[0].card_heading]
│   ├─ H3  Water scarcity                                   [card_grid.items[1].card_heading]
│   ├─ H3  Urban overcrowding                               [card_grid.items[2].card_heading]
│   └─ H3  Climate stress                                   [card_grid.items[3].card_heading]
│
├─ H2  Definition + AP exam use                             [definition_block.headline]
│   ├─ H3  Definition                                       [definition_block.definition_label]
│   ├─ H3  In simple terms                                  [definition_block.simple_terms_label]
│   └─ H3  AP exam use                                      [definition_block.ap_use_label]
│
├─ H2  Why did Malthus think...?                            [deep_dive.headline]
│   └─ (body may contain H3/H4 for layered explanation)     [deep_dive.body — rich_body]
│
├─ H2  Quick comparison                                     [comparison_table.headline]
│
├─ H2  Why students get this wrong                          [text_block.headline]
│   └─ (body may contain H3/H4)                             [text_block.body — rich_body]
│
├─ H2  Memory hooks                                         [summary_list.headline]
│
├─ H2  Check your understanding                             [practice_mcq_quiz.headline]
│   ├─ H3  Question 1 stem                                  [practice_mcq_quiz.items[0].question_stem]
│   └─ ... (5 questions = 5 H3s)
│
├─ H2  How to use this in an FRQ                            [frq_skill_block.headline]
│
├─ H2  Don't lose your AP streak                            [register_block.headline]
│
├─ H2  Take the full test                                   [quiz_block.headline]
│   ├─ H3  Question 1 stem                                  [quiz_block.items[0].question_stem]
│   └─ ... (30 questions = 30 H3s)
│
├─ H2  Your score path                                      [progress_path.headline]
│   ├─ H3  Step 1: Define                                   [progress_path.items[0].step_heading]
│   ├─ H3  Step 2: Compare                                  [progress_path.items[1].step_heading]
│   ├─ H3  Step 3: Apply                                    [progress_path.items[2].step_heading]
│   └─ H3  Step 4: Score                                    [progress_path.items[3].step_heading]
│
├─ H2  Keep going — no dead ends                            [card_grid.headline (with_links=true)]
│   └─ H3 × 4  (related topic cards)                        [card_grid.items[].card_heading]
│
├─ H2  FAQ (questions students actually ask)                [faq_accordion.headline]
│   ├─ H3  What is Malthusian Theory in simple terms?       [faq_accordion.items[0].question, inside <summary>]
│   ├─ H3  What is a real-life example?                     [faq_accordion.items[1].question]
│   ├─ ... (8–14 FAQs)
│   └─ (each answer body may contain H3/H4)                 [faq_accordion.items[].answer — rich_body]
│
└─ H2  One-minute recap for AP exam                         [final_recap.headline]
```

Total per published topic page: **1 H1, ~20 H2s, ~50 H3s, ~0–10 H4s** (depending on how editors structure long answers).

### 12.2 Visual fidelity

Promoting elements from `<strong>` (in the samples) to `<h3>` changes semantics, not appearance. The CSS module has rules that style `.next-card h3`, `.question-card h3.mcq-stem`, `.faq-card summary h3`, and similar to match the samples' original bold-strong treatment exactly. The rendered page is pixel-identical to the samples — only the underlying HTML structure has improved.

### 12.3 What goes in each level

| Level | Used for | Where |
|---|---|---|
| **H1** | The topic itself, exactly once | `topic_hero.headline` only |
| **H2** | Each slice's main page section | Every slice's `headline` field |
| **H3** | Sub-elements that are themselves headings: cards, question stems, FAQ questions, sub-sections | `card_heading`, `step_heading`, `question_stem`, `front_text`, `back_text`, `question` (in summary), `definition_label` etc. |
| **H4** | Deep nesting inside long-form rich text bodies | Optional inside `deep_dive.body`, `text_block.body`, `faq_accordion.answer`, definition bodies |

### 12.4 Rich-text fields that allow H3/H4 inline

Editors can drop H3 or H4 inside these body fields when content benefits from layered structure:

- `simple_explanation.body`
- `video_summary.body`
- `deep_dive.body`
- `text_block.body`
- `definition_block.{definition,simple_terms,ap_use}_body`
- `frq_skill_block.body`
- `faq_accordion.items[].answer`
- `card_grid.items[].card_body`

Short-form fields (ledes, captions, callouts, score feedback) do **not** allow inline headings — those carry only paragraph + strong/em/hyperlink spans.

### 12.5 Validator additions

Two new rules in `scripts/validators/topic-page.js`:

- **Hierarchy outline check**: parse all rendered headings in document order. Fail if more than one H1, fail if any H3 appears before any H2, fail if any H4 appears outside a long-form body field.
- **H3 sub-element completeness**: for `card_grid` items, require every `card_heading` is non-empty; for `progress_path` items, require every `step_heading`; for `practice_mcq_quiz` and `quiz_block`, require every `question_stem`; for `faq_accordion`, require every `question`.

---

## 13. Phase-1 delivery checklist

This is what "done" looks like for the first topic page.

| # | Deliverable | Owner | Status |
|---|---|---|---|
| 1 | `customtypes/topic_page/index.json` checked in | Eng | — |
| 2 | 17 slice components built in `components/topic-page/` | Eng | — |
| 3 | Route handler `app/[course-uid]/[topic-uid]/page.tsx` | Eng | — |
| 4 | CSS module lifted verbatim from samples | Eng | — |
| 5 | `<TopicSidebar>` + `<StickyRegisterBar>` global components | Eng | — |
| 6 | Parser handlers for 17 slices in `scripts/html-to-prismic.cjs` | Eng | — |
| 7 | Validator `scripts/validators/topic-page.js` | Eng | — |
| 8 | Two GitHub Actions workflows | Eng | — |
| 9 | Updated Claude `Create Blog (Topic) Page` skill | Content | — |
| 10 | First migration: `malthusian-theory` topic published from sample HTML | Content + Eng | — |
| 11 | Visual diff vs sample HTML on staging — pass | QA | — |
| 12 | Lighthouse mobile ≥ 90 across all four scores | QA | — |
| 13 | FAQPage + BreadcrumbList + LearningResource schema validates in Google Rich Results Test | QA | — |
| 14 | Production deploy via `dev → main` PR | Eng | — |

---

## 14. Decisions locked in (sign-off)

These were the open questions in v1; all are now resolved.

1. **Accent color.** Orange `#f59e0b` is the universal CTA / accent across every course's topic page — no per-course tinting at the topic level. The `topic_banner` carries the only course-specific visual identity. The `course_accent` field is removed from the Custom Type.
2. **Quiz scope.** Two quiz slices ship together. `practice_mcq_quiz` is a 5-question inline preview at slice 12. `quiz_block` is the full 30-question gated test at slice 15, split exactly 10 easy / 10 medium / 10 hard, with display ads every 2 answers and video ads at the easy→medium and medium→hard transitions. Detailed feedback is signup-gated; guests can attempt the first 3 questions before the soft signup gate appears.
3. **Guest progress UX.** For unauthenticated users, the hero progress aside renders an empty bar with a "Sign in to see your progress" pill instead of a percentage. Logged-in users get their real Supabase value.
4. **Inter font loading.** Self-hosted via `next/font/google` in `app/layout.tsx`. This is the Next.js 14+ default best practice — inlines font CSS at build time, eliminates the extra DNS lookup, prevents CLS, doesn't leak user data to Google, and works offline. Locked in.
5. **Ad network integration.** Phase 1 ships the `.micro-ad` and `.inline-ad-after-options` slots as visible labeled placeholder DIVs ("Advertisement"). Real ad-network wiring (Mediavine / Raptive class) will be added in a later phase, not in this build.

---

*End of plan v1.2 — heading hierarchy fixed, ready for component build.*
