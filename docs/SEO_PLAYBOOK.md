# APScore5 SEO + UX Playbook

Single source of truth for every public APScore5 page — pillar, unit, blog, hub.
Combines technical SEO/AEO requirements with page-design principles and cannibalization rules.
Every page must pass ALL checks before merge.

## The core principle (read this first)

> Make your page faster to understand, easier to scan, and more useful than anything else ranking on the same query.

If a section of this doc conflicts with that principle, the principle wins.

---

## Part 1 — Page design principles (the "why")

### 1. Start with intent, not content
Every page must answer four questions, in this order:
1. **What is this?**
2. **What's on it?**
3. **Why does it matter?**
4. **What should I do next?**

Don't write everything you know. Write what the user is searching for.

### 2. The 5-second test
A user must understand the page in 5 seconds. Above the fold MUST contain:
- Clear title (H1)
- One-line explanation (sub-headline)
- Key facts (stat strip, 3–5 numbers)
- Primary action (CTA button)

If someone has to read a paragraph before they understand the page, you've already lost them.

### 3. Structure beats prose
Good structure outranks good writing. Always:
- Paragraphs ≤3 lines
- Bullet points for lists of 3+ items
- Heading hierarchy: one H1, multiple H2s, H3 only inside H2s

Users scan first, read second. Design for the scanner.

### 4. Modular content (the "blocks" model)
Every page is composed of typed blocks (slices). Standard block library:
- Hero (kicker + H1 + lede + stats + CTA)
- Quick Answer (AEO featured-snippet card)
- Difficulty/decision section
- Content grid (cards for units/topics/items)
- Inline explanation block
- Highlight / proof / stat callout
- Conversion block (signup CTA)
- FAQ accordion
- Internal-link footer

New page types are built by recombining these blocks. New block types only when no existing block fits.

### 5. Make key info visually obvious
Numbers, dates, and percentages get visual weight: bold, larger font, or inside cards. If everything looks the same, nothing is important. Visual hierarchy guides the eye.

### 6. Write for engines AND humans
Use explicit, question-shaped headings:
- "What is X?"
- "How does X work?"
- "Is X hard?"
- "Why does X matter?"

Answer in 1–2 sentences immediately after the heading. This is how you win featured snippets and AI Overview citations.

### 7. Build a network, not isolated pages
Every important topic gets its own page. Pages link to each other naturally:
- Pillar ↔ Units ↔ Topics (bidirectional)
- Related topics link to each other
- "Next concept" link at every blog page bottom

Authority compounds with links. Orphan pages bleed equity.

### 8. Always include a next step
Every page guides the user forward:
- Practice this concept
- Learn more (next topic)
- Take a test
- Sign up to track progress

No dead ends. Every page is a node, not a destination.

### 9. Visual hierarchy is intentional
Not everything has equal weight. Use size, spacing, and color contrast deliberately. Most important: largest, brightest, most spaced. Least important: smallest, muted, dense.

### 10. Reduce cognitive load
Avoid: long paragraphs, dense explanations, unnecessary words, jargon without definition.
Prefer: simple language (10th-grade reading level for student-facing content), clear sections, generous whitespace.

### 11. Surface value early
Don't bury your best insight. Stats, results, unique data, exam tips — put them near the top. Front-load value; back-fill detail.

### 12. Mobile-first mentally
Most users skim on phones. Verify on mobile FIRST:
- Stacked layout (no side-by-side that breaks)
- Tap-friendly targets (44px minimum)
- Short sections (no walls of text)
- Test at 375px width

### 13. Consistency across pages
Same layout patterns, section order, and visual language across all pages of the same tier. A user moving from /ap-human-geography to /ap-biology should feel zero friction. Inconsistency reads as low-quality.

### 14. Differentiate or get ignored
Before publishing, answer: **"Why would someone choose my page over Fiveable, Albert.io, or Khan Academy?"** Differentiators must be visible above the fold:
- Unique data (avg score lift, real cohort numbers)
- Better tool (interactive diagnostic, progress tracking)
- Better UX (5-second understanding, no clutter)
- Honest content (real difficulty, real timing)

If the answer is "we say the same thing prettier," go back and find the angle.

### 15. Balance SEO and UX
SEO gets traffic. UX converts traffic. You need both.
- Keyword density without UX = high bounce rate, lost rankings
- Beautiful UX without SEO = no traffic to convert
Optimize for both at every step. They're not in tension when done right.

---

## Part 2 — Page tier → keyword type

| Tier | Page | URL pattern | Owns | Forbidden (cannibalization) |
|---|---|---|---|---|
| 1 | Course pillar | `/course/{slug}` | head terms ("AP Human Geography course") | unit-N-* and topic terms |
| 2 | Unit | `/course/{slug}/unit-N-slug` | unit-N terms | topic terms |
| 3 | Topic blog | `/course/{slug}/{topic-slug}` | long-tail + PAA | head + unit terms |
| 4 | FAQ/Guide | `/guide/*` | parent + process queries | course-specific terms |

---

## Part 3 — Required on every page (technical)

1. **Title tag** ≤60 chars, primary keyword + brand once. Single brand suffix only.
2. **Meta description** ≤155 chars, CTA verb in last 30 chars.
3. **One H1** matching primary keyword cluster (natural, not exact-match).
4. **Heading mix:** ≤65% of H2/H3s keyword-matched. Rest are natural variations.
5. **Canonical** → self.
6. **Open Graph + Twitter Card** with banner image (1200×628).
7. **JSON-LD schemas:**
   - Pillar: `Course` + `FAQPage` + `BreadcrumbList` + `ItemList` (units)
   - Unit: `LearningResource` + `FAQPage` + `BreadcrumbList`
   - Topic: `Article` + `FAQPage` + `BreadcrumbList`
   - Quick Answer block (any tier): `QAPage`
8. **Visible breadcrumbs** at top of page matching BreadcrumbList schema.
9. **Last-reviewed date** visible to user, formatted "Last reviewed: Month DD, YYYY".
10. **Banner image** + 3–5 inline images. Every image: descriptive filename, descriptive alt text, lazy-loaded, WebP/AVIF.
11. **At least 1 YouTube embed** with title, description, lazy iframe.
12. **Internal linking footer** — every pillar links to all units + top 3 topic blogs.
13. **Body word count target by tier:**
    - Pillar: ~3,800 words body + FAQ bulk (≈6,500 total)
    - Unit: ~2,400 words body + FAQ (≈4,200 total)
    - Topic blog: ≥3,500 words with FAQ majority
    Length matters because long-form correlates with topical authority. But: never pad. If you can't hit the target without filler, you're missing real coverage — go find what competitors cover that you don't.

---

## Part 4 — AEO requirements

1. **FAQPage block** with 15–30 Q&A pairs, collapsed by default via native `<details>`.
2. Each FAQ answer: direct answer in first 2 sentences, expansion after.
3. **Quick Answer block** at top — Q in `<h2>`, definitive A in styled paragraph, with QAPage JSON-LD.
4. Numbers, ranges, and dates stated in plain text (not images) so AI engines can extract.
5. Question-shaped subheadings throughout body ("What is…", "How does…", "Is X hard?").
6. **Quick Answer Q/A ordering is non-negotiable.** The H2 must be the QUESTION (what users search). The body paragraph must be the ANSWER. Never the reverse. AI engines parse the H2 as the question being answered — flipping this breaks AEO extraction.

---

## Part 5 — Humanization checklist (8 items, all must pass)

1. "Explain like I'm 15" plain-language section exists somewhere on the page.
2. ≥1 real-world example tied to a concept.
3. "Common mistakes students make" block somewhere on page.
4. ≥1 AP-specific exam tip.
5. Zero banned words (see `/Banned_Words` in project root).
6. Heading-keyword ratio ≤65%.
7. Intro opens with a hook, not a definition.
8. FAQ answers put direct answer in first 2 sentences.

---

## Part 6 — Performance budget (Core Web Vitals = ranking factor)

- Mobile Lighthouse ≥90 on Performance, Accessibility, SEO, Best Practices
- LCP ≤2.5s on 4G simulated
- CLS ≤0.1
- INP ≤200ms
- Total CSS+JS ≤180KB gzipped (excluding video player)

---

## Part 7 — Pre-merge PR checklist

Copy into every PR description. All boxes must be checked.

**Intent & structure**
- [ ] Page answers What/What's on it/Why/Next within first scroll
- [ ] 5-second test passes (clear title, sub-headline, key facts, CTA above fold)
- [ ] Differentiator visible above fold (why this page, not a competitor's)
- [ ] No dead ends — every page has a next step

**Technical SEO**
- [ ] Title ≤60 chars, no duplicate brand suffix
- [ ] Meta description ≤155 chars
- [ ] One and only one H1
- [ ] Heading-keyword ratio ≤65%
- [ ] Required schemas added and validated at validator.schema.org
- [ ] Visible breadcrumbs render
- [ ] Banner image + ≥3 inline images, all with alt text
- [ ] Last-reviewed date visible
- [ ] Body word count meets tier target (pillar ≥3,800 / unit ≥2,400 / blog ≥3,500)

**AEO**
- [ ] FAQPage block, 15–30 Q&A pairs, native `<details>`
- [ ] FAQ answers direct in first 2 sentences
- [ ] Question-shaped subheadings present
- [ ] Quick Answer block: H2 contains the question, body paragraph contains the answer
- [ ] QAPage JSON-LD validates

**Humanization**
- [ ] All 8 humanization checks pass
- [ ] Banned words: 0 occurrences (`grep -if Banned_Words`)

**UX**
- [ ] Tested at 375px mobile width — no horizontal scroll, tap targets ≥44px
- [ ] Lighthouse mobile ≥90 across all four scores
- [ ] Visual hierarchy clear: stats stand out, key insights weighted
- [ ] Cognitive load reduced: paragraphs ≤3 lines, generous whitespace

**Cannibalization**
- [ ] Page brief consulted at `docs/seo/pages/{slug}.md`
- [ ] Forbidden keywords from that brief do NOT appear in H2s, H3s, or 3+ body sentences
- [ ] No keyword overlap with other pages of the same tier

**Network**
- [ ] Internal links to all relevant sibling pages (units, topics)
- [ ] No orphan: this page is linked from at least one other page

---

## Part 8 — Live page audit template

Run this against every published page monthly, or before any major content push. Copy the table, fill in current state, fix anything red.

| Check | Brief target | Live status |
|---|---|---|
| H1 matches keyword cluster | primary keyword + outcome | |
| Title tag | <60 chars, single brand suffix | |
| Meta description | ≤155 chars, CTA verb | |
| Canonical | self | |
| Schemas (tier-appropriate) | all required validate at validator.schema.org | |
| Visible breadcrumbs | render at top | |
| Banner + inline images | 1 banner + ≥3 inline, all alt-tagged | |
| YouTube embed | ≥1 per page | |
| Heading-keyword ratio | ≤65% | |
| Last-reviewed date | visible to user | |
| Internal-link map | every sibling + 3 related | |
| FAQ block | 15–30 Q&A, native `<details>` | |
| AEO direct-answer | first 2 sentences of each FAQ | |
| Quick Answer Q/A | H2=question, body=answer | |
| Body word count | tier target met | |
| Banned words | 0 occurrences | |
| Mobile Lighthouse | ≥90 across all 4 scores | |
| 5-second test | passes | |
| Differentiator above fold | visible | |
| Cannibalization | no forbidden keywords from brief | |

---

## Part 9 — No cannibalization — keyword routing

Source of truth: project knowledge documents `AP_Course_Pillar_Page.docx`, `AP_Course_-_Unit_Page.docx`, and `Blog_Page_Guidelines.docx`. Distilled rules below.

### The cannibalization rule (non-negotiable)

Two pages on the site MUST NOT compete for the same keyword. If they do, Google splits ranking power between them and both lose.

### Routing decision tree

When you encounter a keyword, ask in order:

1. Does the keyword contain "Unit N" or "Unit {number}"? → **belongs on unit page**, NEVER on pillar
2. Does the keyword name a specific topic/concept (e.g. "Malthusian theory", "von Thünen model", "demographic transition")? → **belongs on topic blog page**, NEVER on pillar or unit
3. Is the keyword a generic course-level question ("is X hard", "what is X", "X course description")? → **belongs on pillar page** only
4. Is the keyword a parent/process query ("how many APs should my child take")? → **belongs on FAQ/guide page**, not pillar

### Per-page keyword briefs

Each public page gets its own keyword brief at `docs/seo/pages/{slug}.md`. The brief lists:
- Primary keyword (head term, 1 only)
- Secondary keywords (3–6, supporting)
- Long-tail keywords (5–10, FAQ + body content)
- Forbidden keywords (the ones that belong to OTHER pages)

When working on a page, ALWAYS consult the brief at `docs/seo/pages/{slug}.md` first. If the brief doesn't exist, the page hasn't been planned — STOP and ask the user before writing content.

### Validator for cannibalization

Before merging any content change:
1. Grep the new content against the "forbidden keywords" of the page brief
2. If any forbidden keyword appears as an H2, H3, or in 3+ body sentences, reject the change
3. The keyword belongs on its routed page, not this one
