# APScore5 — AP Human Geography Pillar Page Handoff

> Context document for Claude Code. Paste the contents of this file as your first message, then attach the staging HTML file. Do NOT skip reading the "State of play" section.

---

## Who am I (the user)

Aarush, founder of APScore5 — a free AP exam prep platform. Building solo, not a developer. I'm comfortable approving terminal commands but I don't write code. Long-term goal: 50-100 course and topic pages in Phase 1, scaling to thousands.

## What APScore5 is building

- **Stack:** Next.js (on Vercel), Prismic (headless CMS), Supabase (future: users + progress), Stripe, Resend
- **Domain:** apscore5.com (also apscore5.vercel.app)
- **GitHub repo:** Private, connected to Vercel for auto-deploy
- **Prismic repo:** `apscore5.prismic.io`
- **Brand:** Navy #0A0F5A, Blue #2F66D0, Orange #F5A623. Plus Jakarta Sans (body), JetBrains Mono (accent)
- **Voice:** Teacher tone — direct, calm, caring. Short sentences. No fluff or hype.

## State of play

### What's already done

**Prismic side:**
- 6 Custom Types defined: Course Pillar Page, Unit Page, Topic Blog Page, FAQ Block, Quiz Question, Homepage
- 12 Slices defined (all with the right fields modeled by the prior developer):
  1. PillarHero
  2. QuickAnswer
  3. DifficultySection
  4. ExamStructure
  5. UnitCardsGrid
  6. VideoEmbed
  7. ConversionBlock
  8. DiagnosticQuiz
  9. UnitQuestionBank
  10. StudyStrategy
  11. FlashcardCarousel
  12. FAQAccordion

**Document in Prismic (Draft status):**
- Document: `ap-human-geography` (Course Pillar Page type)
- UID: `ap-human-geography`
- URL for editor: `https://apscore5.prismic.io/builder/pages/aeaifRAAAB8AZWYG`

**Slices already populated (approx 90% complete):**
- ✅ Slice 1 — PillarHero (all 5 stats, headline, subheadline, CTAs, eyebrow — complete)
- ✅ Slice 2 — QuickAnswer (label, answer paragraph, expansion paragraph)
- ✅ Slice 3 — DifficultySection (headline, lede, all 4 difficulty cards with bullets and body)
- 🟡 Slice 4 — ExamStructure (partial: top fields + items 1-4 of repeatable zone; needs items 5-7 + top-section fields like Format Description, Weights Section Heading, Score Table Heading, Score Table Description)

**Slices with default content already (pre-populated by previous work, content not yet replaced):**
- DiagnosticQuiz has some default fields populated (Tag Label, Total Questions, Gate Title, Gate CTA Text, Footnote)

### What's still to do

**In Prismic (content):**
- Finish Slice 4 (ExamStructure) — items 5-7 of the repeatable zone + top fields
- Fill Slice 5 (UnitCardsGrid) — 7 units
- Fill Slice 6 (VideoEmbed) — placeholder video
- Fill Slice 7 (ConversionBlock) — Create Free Account CTA
- Complete Slice 8 (DiagnosticQuiz) — 3 full questions + 7 placeholders
- Fill Slice 9 (UnitQuestionBank) — 3 sample practice questions (placeholder for 67 more)
- Fill Slice 10 (StudyStrategy) — 3 cards
- Fill Slice 11 (FlashcardCarousel) — 4 flashcards (placeholder for 21 more)
- Fill Slice 12 (FAQAccordion) — 27 FAQs in 5 groups

**In GitHub (code):**
- **Unknown state.** The 12 slice components exist as files, but I do not know how well they are styled. They may render the data plainly. The goal is to match the attached HTML staging file (`ap-human-geography-pillar-STAGING.html`) — that HTML is the visual source of truth.

**In Vercel:**
- Should auto-deploy on each GitHub commit
- Live page target: `apscore5.vercel.app/ap-human-geography`

## Content source of truth

**Attached file: `ap-human-geography-pillar-STAGING.html`**

This single HTML file contains:
- Every visible text on the page (all copy, all FAQ answers, all question explanations)
- All SEO/schema markup (10 entities: Organization, WebSite, WebPage, BreadcrumbList, Course, ItemList, Quiz, HowTo, VideoObject, FAQPage)
- All styling (CSS with brand tokens as CSS variables)
- All JavaScript (interactive diagnostic, flashcard reveal, practice bank navigation, FAQ accordion)
- All ad slot positioning (hidden until answer, revealed after, per AdSense policy)

**Use the HTML file as the visual target when building slice components.** Content that goes into Prismic fields can be extracted from the HTML. Structure: each HTML `<section>` corresponds to one Prismic slice.

## Your job (Claude Code)

1. **Read the current project structure.**
   - `ls -la` the project root
   - Check `package.json`, `slicemachine.config.json`, `prismicio-types.d.ts`
   - Read one slice's `model.json` and `index.tsx` to understand the developer's patterns

2. **Tell me what's there.** Before writing anything, report back:
   - Next.js version and router type (App vs Pages)
   - Styling system (Tailwind? CSS Modules? vanilla CSS? styled-components?)
   - Existing slice component quality (empty placeholder? partially styled? matches staging HTML?)

3. **Ask me: replace existing components with staging-HTML-matched versions, OR adapt to existing structure?** I'll tell you.

4. **Then do the work, in this order:**
   a. Write a Migration API script (`scripts/migrate-ap-hug.mjs`) that fills the remaining Prismic slices from the HTML content
   b. Confirm with me, then run it — draft updates land in the Prismic Migration Release
   c. Write/update the 12 slice components to match the staging HTML's design
   d. Commit each slice as its own commit (so Vercel previews land incrementally)
   e. Verify the live URL: `apscore5.vercel.app/ap-human-geography`

## Rules of engagement

- **Never paste secrets in visible code.** Use `.env` files, never hardcode the Prismic Write Token.
- **Never push directly to `main`.** Always use a feature branch + PR, or at minimum ask before pushing to main.
- **Run `npm install` only if needed.** Check if dependencies are already installed.
- **Ask before running destructive commands.** If you want to delete or overwrite, confirm first.
- **Show diffs before committing.** For slice components, show me what changed.
- **The Prismic Write Token goes in `.env.local`**, never `.env` (which sometimes gets committed).

## Sensitive values I will provide when asked

Do NOT ask for these upfront. Only ask when you need them for a specific step:

- `PRISMIC_WRITE_TOKEN` — needed for Migration API calls (I'll paste when you're ready to run the script)
- GitHub repo URL — I'll paste when you need to push
- Vercel deploy hook URL — only if we need to manually trigger a rebuild

## Design tokens (for slice components)

```css
--navy: #0A0F5A
--navy-dark: #07093d
--navy-mid: #141a78
--blue: #2F66D0
--light-blue: #5AA9FF
--blue-soft: rgba(47,102,208,0.09)
--blue-xsoft: #EEF4FF
--orange: #F5A623
--orange-soft: rgba(245,166,35,0.1)
--white: #FFFFFF
--soft: #F6F8FC
--border: #E6EAF2
--body-text: #1a2332
--muted: #5B6478
--faint: #8E97A8

font-body: 'Plus Jakarta Sans', system-ui, sans-serif
font-accent: 'JetBrains Mono', monospace

--shadow-sm: 0 1px 2px rgba(10, 15, 90, 0.04), 0 2px 8px rgba(10, 15, 90, 0.04)
--shadow-md: 0 4px 16px rgba(10, 15, 90, 0.06), 0 8px 32px rgba(10, 15, 90, 0.04)
```

## Banned words (never write these in content)

delve, leverage, empower, unlock, unleash, seamless, seamlessly, game-changing, revolutionary, robust, synergy, synergistic, holistic, paradigm, disrupt, disruption, disruptor, plethora, myriad, bespoke, curated, cutting-edge, state-of-the-art, next-level, elevate, elevate your, transform your, level up, 10x, masterclass, unlock your potential, dive deep, dive in, in today's fast-paced world, in today's digital age, in the ever-evolving, at the end of the day, it's important to note, it's worth noting, in conclusion, in summary

## Starting command for Claude Code

Run this as your very first thing:

```bash
ls -la && cat package.json | head -40 && cat slicemachine.config.json 2>/dev/null && echo "---" && ls slices/ 2>/dev/null
```

Then report back what you see. Do not write any code yet.

---

*End of handoff document. Version: 1.0. Last updated: 2026-04-21.*
