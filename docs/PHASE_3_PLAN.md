# Phase 3 — Slices Refactor Plan

**Goal:** Every slice on staging uses the semantic class system documented in `docs/DESIGN_SYSTEM.md` and the header comment in `app/globals.css`. Inline styles and ad-hoc Tailwind soup are removed unless an existing class genuinely doesn't fit.

**Constraints (from user):**
- Skip `.btn-ghost` — use `.btn-s` for outline needs
- Skip section modifier classes — keep the bare `<section>` + global `padding:44px 0` pattern
- Skip body typography aliases — use `.sub` / default `<p>` / `.note`
- Skip standalone `.input` — extract on second use case
- PillarHero keeps its stronger navy hero look (pillar pages earn it)

**Out of scope:** Prismic field reads stay identical. No new slice components. No layout redesign.

---

## Slice-by-slice

Order: `PillarHero, CoursesHubHero, CourseGrid, WhyApMatters, ApPlanningPoll, ConversionBlock, FaqAccordion` (per user).

---

### 1. PillarHero — **Custom but justified** (new semantic classes needed)

**Current state:** All Tailwind utility soup, including arbitrary-value classes (`text-[clamp(40px,6vw,68px)]`, `mb-[22px]`, `before:[background-image:radial-gradient(...)]`, etc.). Uses theme tokens correctly (`bg-navy`, `text-orange`, `text-white`).

**Decision (per user):** Keep the navy hero treatment — pillar pages earn a stronger visual than the homepage `.hero`. **Refactor target = a new pillar-page-specific semantic class set, not the `.hero` pattern.**

**New CSS to add** (Phase 3 prep — small additive block in `app/globals.css`, inside `@layer base`, after `.hero` styles):

```css
/* Pillar-page hero — navy treatment (stronger than homepage .hero).
   Keep distinct from .hero, which is light-bg and homepage-only. */
.pillar-hero{
  position:relative;overflow:hidden;
  background:var(--navy);color:#fff;
  padding:72px 0 56px;
}
.pillar-hero::before{                 /* white dot pattern */
  content:"";position:absolute;inset:0;pointer-events:none;opacity:.8;
  background-image:radial-gradient(rgba(255,255,255,.06) 1.5px,transparent 1.5px);
  background-size:30px 30px;
}
.pillar-hero::after{                  /* blue radial glow, top-right */
  content:"";position:absolute;top:-120px;right:-120px;
  width:620px;height:620px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(47,102,208,.28) 0%,transparent 65%);
}
.pillar-hero > .container{position:relative;z-index:1}
.pillar-hero .eyebrow{                /* dark-bg variant: orange-tint pill */
  background:rgba(245,166,35,.10);
  border-color:rgba(245,166,35,.30);
  color:var(--orange);
}
.pillar-hero h1{
  color:#fff;font-weight:800;
  font-size:clamp(40px,6vw,68px);line-height:1.02;letter-spacing:-2px;
  margin-bottom:22px;max-width:900px;
}
.pillar-hero h1 em{                   /* orange accent w/ underline */
  font-style:normal;color:var(--orange);position:relative;display:inline-block;
}
.pillar-hero h1 em::after{
  content:"";position:absolute;left:0;right:0;bottom:-6px;
  height:4px;background:var(--orange);border-radius:6px;opacity:.4;
}
.pillar-hero .sub{
  color:rgba(255,255,255,.72);max-width:720px;margin-bottom:32px;
}
.pillar-hero .sub strong{color:#fff;font-weight:600}

.pillar-stats{
  display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:28px;
}
@media (min-width:768px){ .pillar-stats{grid-template-columns:repeat(5,1fr)} }
.pillar-stat{
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);
  backdrop-filter:blur(8px);
  border-radius:16px;text-align:center;padding:16px 14px;
}
.pillar-stat-num{
  color:var(--orange);font-size:26px;font-weight:800;
  line-height:1;letter-spacing:-.5px;margin-bottom:4px;
}
.pillar-stat-label{
  color:rgba(255,255,255,.65);font-size:10px;font-weight:500;
  text-transform:uppercase;letter-spacing:.05em;line-height:1.3;margin-bottom:4px;
}
.pillar-stat-cap{ color:rgba(255,255,255,.42);font-size:10px;line-height:1.3 }

/* Pillar-page CTAs — slightly squarer than homepage .btn (pill).
   Pillar treatment is heavier; pill buttons read too soft on navy. */
.btn-pillar-p{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:var(--orange);color:var(--navy);
  border:none;border-radius:9px;padding:14px 26px;
  font-family:inherit;font-size:15px;font-weight:700;
  cursor:pointer;text-decoration:none;
  transition:background .15s,transform .15s;
}
.btn-pillar-p:hover{background:#fbb83a;transform:translateY(-1px)}
.btn-pillar-s{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  background:transparent;color:rgba(255,255,255,.85);
  border:1.5px solid rgba(255,255,255,.25);
  border-radius:9px;padding:14px 22px;
  font-family:inherit;font-size:15px;font-weight:700;
  cursor:pointer;text-decoration:none;
  transition:border-color .15s,color .15s,transform .15s;
}
.btn-pillar-s:hover{border-color:rgba(255,255,255,.5);color:#fff;transform:translateY(-1px)}
```

**Slice JSX target:**

```tsx
<section className="pillar-hero" data-slice-type={...} data-slice-variation={...}>
  <div className="container">
    {slice.primary.eyebrow && (
      <div className="eyebrow"><span className="eydot" />{slice.primary.eyebrow}</div>
    )}
    <PrismicRichText field={slice.primary.headline} />            {/* renders <h1> */}
    <PrismicRichText field={slice.primary.subheadline}            {/* renders <p class="sub"> */}
      components={{
        paragraph: ({children}) => <p className="sub">{children}</p>,
        strong:    ({children}) => <strong>{children}</strong>,
      }}
    />

    {slice.items.length > 0 && (
      <div className="pillar-stats">
        {slice.items.map((item, i) => (
          <div key={i} className="pillar-stat">
            <div className="pillar-stat-num">{item.stat_number}</div>
            <div className="pillar-stat-label">{item.stat_label}</div>
            {item.stat_caption && <div className="pillar-stat-cap">{item.stat_caption}</div>}
          </div>
        ))}
      </div>
    )}

    <div className="hbtns">
      {slice.primary.primary_cta_text && (
        <PrismicNextLink field={slice.primary.primary_cta_link} className="btn-pillar-p">
          {slice.primary.primary_cta_text}
        </PrismicNextLink>
      )}
      {slice.primary.secondary_cta_text && (
        <PrismicNextLink field={slice.primary.secondary_cta_link} className="btn-pillar-s">
          {slice.primary.secondary_cta_text}
        </PrismicNextLink>
      )}
    </div>
  </div>
</section>
```

**Net diff:** PillarHero loses ~40 lines of Tailwind soup; gains ~5 semantic class references. New CSS adds ~70 lines to `globals.css` for the pillar pattern (one-time cost; reused if we ever build a second pillar variant or if other pillar slices need to nest on the navy bg).

**Risks:**
- The `.pillar-hero .eyebrow` override changes the eyebrow color/border on dark bg only (scoped via compound selector). Won't affect homepage `.eyebrow`.
- `.pillar-hero h1` overrides the global `h1`. Compound selector wins on specificity.
- `.btn-pillar-*` are new classes, don't collide with `.btn-p`/`.btn-s`.
- Visual parity check needed against the current PillarHero screenshot — sizes, spacing, hover states.

---

### 2. CoursesHubHero — **Needs refactor**

**Current state:**
```tsx
<section className="courses-hub-hero navy-bg p-8 text-center text-white" ...>
  <div className="container">
    <p className="eyebrow">{slice.primary?.eyebrow}</p>
    <PrismicRichText field={slice.primary?.headline} />
    <PrismicRichText field={slice.primary?.subheadline} />
  </div>
</section>
```

**Issues:**
- `courses-hub-hero` and `navy-bg` classes are not defined anywhere — silently no-op
- `p-8 text-center text-white` are Tailwind utilities; only `text-center` actually applies (Tailwind utilities work for layout primitives)
- `<p class="eyebrow">` — `.eyebrow` expects `<div>` markup with a `<div class="eydot">` child for the orange dot
- Headline RichText emits a default `<p>` for non-h1 blocks; no styling hook
- Renders as plain centered text (per the live `/courses` screenshot)

**Refactor target** — use the homepage-style centered section with kicker (per live `/courses` screenshot — heading "Every AP course. One path to a 5." sits above the course grid):

```tsx
<section data-slice-type={slice.slice_type}>
  <div className="container" style={{textAlign:"center"}}>
    {slice.primary?.eyebrow && (
      <div className="kicker">{slice.primary.eyebrow}</div>
    )}
    <PrismicRichText field={slice.primary?.headline} />     {/* renders <h1>; global h1 styles apply */}
    <PrismicRichText field={slice.primary?.subheadline}
      components={{ paragraph: ({children}) => <p className="sdesc" style={{margin:"0 auto 22px"}}>{children}</p> }}
    />
  </div>
</section>
```

Notes:
- `.kicker` (not `.eyebrow`) — this is a section header, not a hero badge. Live homepage uses `.kicker` everywhere above section h2/h1.
- Centered alignment via `style={{textAlign:"center"}}` is the only inline that survives — there is no `.text-center` semantic class on live, and adding one for a single use case is a violation of the Phase 1/2 decisions.
- `.sdesc` gets `margin:0 auto 22px` so it centers under a centered headline (the default `.sdesc` is left-aligned with `max-width:620px`).

**No new CSS needed.**

**Risk:** None substantial — visual change will be small (already rendered on light bg; only the eyebrow vs kicker visual changes).

---

### 3. CourseGrid — **Already on-system** (one nit)

**Current state:** Uses `.kicker`, `.grid3`, `.ccard`, `.ctop2`, `.icon`, `.clink`. ✅

**One issue:** `<section className="course-grid py-12">` — `course-grid` does nothing; `py-12` (Tailwind = 48px) competes with the global `section{padding:44px 0}`. Drop both.

**Refactor target:**
```tsx
<section data-slice-type={slice.slice_type}>
  <div className="container">
    <div className="kicker">{slice.primary?.eyebrow}</div>     {/* was <p>, prefer <div> */}
    <PrismicRichText field={slice.primary?.headline} />
    <PrismicRichText field={slice.primary?.lede}
      components={{ paragraph: ({children}) => <p className="sdesc">{children}</p> }}
    />
    <div className="grid3" role="list">
      {slice.primary?.courses?.map((item, i) => (
        <PrismicNextLink key={i} field={item.course_link} className="ccard" role="listitem">
          <div className="ctop2">
            <div className="icon" aria-hidden="true">
              <PrismicNextImage field={item.course_icon} fallbackAlt="" />
            </div>
            {/* room here for a .qcount if Prismic provides a Q count later */}
          </div>
          <h3>{item.course_name}</h3>
          <p>{item.course_description}</p>
          <span className="clink">Explore course →</span>
        </PrismicNextLink>
      ))}
    </div>
  </div>
</section>
```

Changes: drop `course-grid py-12` from the section; change `<p class="kicker">` to `<div class="kicker">` to match live convention; collapse the wrapper `<div role="listitem">` so the `<a class="ccard">` is the list item directly (cleaner a11y and matches live).

The lede `PrismicRichText` previously had no styling hook — wrap via `paragraph` serializer to emit `.sdesc`.

**No new CSS needed.**

**Risk:** None.

---

### 4. WhyApMatters — **Needs refactor**

**Current state:**
```tsx
<section className="why-ap-matters py-12" ...>
  <div className="container">
    <p className="eyebrow">{slice.primary?.eyebrow}</p>     {/* wrong: kicker, not eyebrow */}
    <PrismicRichText field={slice.primary?.headline} />     {/* renders h1; should be h2 */}
    <div className="space-y-4">                              {/* Tailwind utility */}
      <PrismicRichText field={slice.primary?.body} />
    </div>
  </div>
</section>
```

**Issues:**
- `why-ap-matters py-12` — both ad-hoc/Tailwind, drop both
- `.eyebrow` used as a section label — should be `.kicker` (and `<div>` not `<p>`)
- Body `PrismicRichText` produces unstyled paragraphs; use a serializer to emit `.sub` for the lead and default `<p>` for body
- `space-y-4` (Tailwind) for vertical rhythm — replace with paragraph-level margins via CSS or a serializer

**Refactor target:**
```tsx
<section data-slice-type={slice.slice_type}>
  <div className="container">
    {slice.primary?.eyebrow && <div className="kicker">{slice.primary.eyebrow}</div>}
    <PrismicRichText field={slice.primary?.headline}
      components={{ heading1: ({children}) => <h2>{children}</h2> }}    {/* downgrade if Prismic emits h1 */}
    />
    <PrismicRichText field={slice.primary?.body}
      components={{
        paragraph: ({children}) => <p className="sdesc" style={{maxWidth:"720px",marginBottom:"14px"}}>{children}</p>,
        strong:    ({children}) => <strong>{children}</strong>,
      }}
    />
  </div>
</section>
```

Notes:
- The `heading1 → h2` downgrade is defensive — if a content editor accidentally typed an h1 in the body field, this prevents two h1s on the page. If the field is already h2-typed, this is a no-op.
- The body paragraphs adopt `.sdesc` styling (17px / muted) for a comfortable read width.

**No new CSS needed.**

**Risk:** Low. Visual change: eyebrow pill → blue uppercase kicker (intentional, matches live).

---

### 5. ApPlanningPoll — **Already on-system** (placeholder; minor cleanup)

**Current state:** Placeholder copy in centered container.

```tsx
<section className="ap-planning-poll py-12" ...>
  <div className="container text-center">
    <h2>AP Planning Poll</h2>
    <p>This is a placeholder for the AP Planning Poll slice.</p>
  </div>
</section>
```

**Issues:**
- `ap-planning-poll py-12` — drop both
- `text-center` is Tailwind utility — for a single-line placeholder, keep as Tailwind (`text-center` is a layout utility, not a design token, and removing it would just inline-style `text-align`). Acceptable per the "Tailwind for layout primitives" carve-out.

**Refactor target:**
```tsx
<section data-slice-type={slice.slice_type}>
  <div className="container text-center">
    <h2>AP Planning Poll</h2>
    <p>This is a placeholder for the AP Planning Poll slice.</p>
  </div>
</section>
```

**No new CSS needed. Risk: none.** This is essentially a placeholder that we'll replace properly when the real poll component is built.

---

### 6. ConversionBlock — **Needs heavy refactor**

**Current state:** Heavily inline-styled. `bg-gray-50` (Tailwind), `style={{textAlign:"center"}}`, `style={{marginTop:"1em",display:"inline-block"}}` on the button, hardcoded `color:"#666"` for the footnote (not `var(--muted)`), inline `display:grid;gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))";gap:"2em"` for the items grid, inline icon/title/description styles.

**Issues:**
- Section bg: `bg-gray-50` → there is no `--gray-50` in the system. Live uses bare `<section>` (transparent over body bg `var(--soft)`). Drop it.
- Footnote `color:#666` → `var(--muted)`. The system class for small print is `.note`.
- Centered text: inline `text-align:center` is fine for a one-shot section centering (no system class for this on live).
- Items grid: inline `repeat(auto-fit,minmax(220px,1fr))` doesn't match live patterns. The closest live pattern is `.grid3` (3-up). The benefits items number tends to be 3 or 4 — `.grid3` collapses 3→2→1 but won't give 4-up. If 4 items expected, propose a parallel `.grid4` (3 lines of CSS) or use `.grid3` and accept 3-up wrapping.
- Each benefit row: `<div>{icon}</div><h3>...</h3><p>...</p>` — basic mini-card. The closest live class is `.ccard` (full course card with hover). Lighter alternative: just inline structure with `.icon` for the emoji wrapper and unstyled h3/p.

**Refactor target** (resolves to live patterns):
```tsx
<section data-slice-type={slice.slice_type}>
  <div className="container" style={{textAlign:"center"}}>
    <PrismicRichText field={slice.primary?.headline}
      components={{ heading1: ({c}) => <h2>{c}</h2>, heading2: ({c}) => <h2>{c}</h2> }}
    />
    <PrismicRichText field={slice.primary?.subcopy}
      components={{ paragraph: ({c}) => <p className="sdesc" style={{margin:"0 auto 22px"}}>{c}</p> }}
    />

    {slice.primary?.cta_link?.url && slice.primary?.cta_text && (
      <a href={slice.primary.cta_link.url} className="btn btn-p">{slice.primary.cta_text}</a>
    )}
    {slice.primary?.footnote && (
      <p className="note" style={{marginTop:"12px"}}>{slice.primary.footnote}</p>
    )}

    {slice.items?.length > 0 && (
      <div className="grid3" style={{marginTop:"36px",textAlign:"left"}}>
        {slice.items.map((item, i) => (
          <div key={i}>
            <div className="icon" aria-hidden="true" style={{fontSize:"24px"}}>{item.benefit_icon}</div>
            <h3 style={{margin:"10px 0 4px"}}>{item.benefit_title}</h3>
            <p className="sdesc" style={{margin:0}}>{item.benefit_description}</p>
          </div>
        ))}
      </div>
    )}
  </div>
</section>
```

Notes:
- The CTA reuses live `.btn .btn-p` — pill, navy, white text. The live screenshot shows orange "Create a free account" — that would map to `.btn .btn-accent`. **Open question:** which is intended? Defer to user; default to `.btn-p` until told otherwise.
- The 4-card icons grid is the only awkward fit. Two acceptable solutions:
  - **(a)** Use `.grid3` and let 4 items wrap to 3+1 (live behavior is 3-up max).
  - **(b)** Add a one-time `.grid4` to globals (10 lines: `.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px} @media (max-width:900px){.grid4{grid-template-columns:1fr 1fr}} @media (max-width:768px){.grid4{grid-template-columns:1fr}}`). Justified if multiple slices need 4-up. Currently only ConversionBlock would.
  - I lean toward **(a)** for now. Revisit when a second 4-up slice appears.
- Inline `style={{textAlign:"center"}}` and a couple of margin one-shots remain. These are presentational one-offs, not design tokens, and adding utility classes for them violates Phase 1/2 decisions. Acceptable.

**No new CSS needed** (assuming `.grid3` for the items).

**Risk:** Visual diff vs current. Currently the 4-up grid uses `auto-fit/minmax(220px,1fr)` — could be 4 across at desktop. With `.grid3`, max 3 across. Want user to confirm before pushing.

---

### 7. FaqAccordion — **Needs heavy refactor + small CSS addition**

**Current state:** Doesn't use the live `.faq-wrap`/`.fi`/`.fiq`/`.fia`/`.arr` system AT ALL. Uses native `<details>`/`<summary>` with all-inline styling — borders, padding, `cursor:pointer`, font-weights, category-label badge styles, line-height.

**Issues:**
- All inline styles (`borderBottom`, `padding:"1.25em 0"`, `fontWeight:600`, `fontSize:"1.1em"`, etc.)
- Category-label badge inline-styled — could become a `.tag` (live: small UPPERCASE blue chip). Visually different from current grey chip but on-system.
- Lede wrapped in inline `style={{marginBottom:"2em",color:"#555"}}` — should be `.sdesc`.
- Headline RichText emits unstyled output.

**Two competing approaches:**

**(A) Native `<details>` + tiny CSS addition.** Keep the accessibility benefits of native `<details>` (keyboard-toggleable, no JS, content visible to crawlers when collapsed), but style via the live `.fi`/`.fiq`/`.fia` classes. Requires 4 lines of CSS to (i) hide the default disclosure triangle and (ii) drive open state from the `[open]` attribute.

Required additive CSS (Phase 3, inside `@layer base`, near the existing `.fi` block):
```css
details.fi summary.fiq{list-style:none}
details.fi summary.fiq::-webkit-details-marker{display:none}
.fi[open] .fia{display:block}
.fi[open] .arr{transform:rotate(180deg)}
```

**(B) Make FaqAccordion a client component with React state**, applying `.fiq.open` and `.fia.show` exactly as the legacy CSS expects. No CSS additions needed; matches existing class semantics 1:1. Downside: client component, manual a11y wiring (aria-expanded, keyboard handlers).

**Recommendation: (A).** The CSS cost is 4 lines, accessibility wins are real, and it fits the "semantic system first" ethos. Document the `[open]` variant in the header comment alongside the existing `.fi`/`.fiq`/`.fia` entries.

**Refactor target (with approach A):**
```tsx
<section className="faq-light" id="faq" data-slice-type={slice.slice_type}>
  <div className="container">
    {slice.primary?.eyebrow && <div className="kicker">{slice.primary.eyebrow}</div>}
    <PrismicRichText field={slice.primary?.headline}
      components={{ heading1: ({c}) => <h2>{c}</h2>, heading2: ({c}) => <h2>{c}</h2> }}
    />
    <PrismicRichText field={slice.primary?.lede}
      components={{ paragraph: ({c}) => <p className="sdesc">{c}</p> }}
    />

    {items.length > 0 && (
      <div className="faq-wrap">
        {items.map((item, i) => (
          <details key={i} className="fi" open={item.open_by_default}>
            <summary className="fiq">
              <span className="fiq-text">
                {item.category_label && <span className="tag" style={{marginRight:"10px"}}>{item.category_label}</span>}
                {item.question}
              </span>
              <span className="arr" aria-hidden="true">▾</span>
            </summary>
            <div className="fia">
              <PrismicRichText field={item.answer} />
            </div>
          </details>
        ))}
      </div>
    )}
  </div>
</section>
```

Notes:
- Section wrapper now uses **`.faq-light`** (Phase 2 add) instead of inline grey/white styling. Kept `id="faq"` as a belt-and-suspenders backstop while the legacy `#faq` block is still in place — both apply but the result is identical, and removing `id="faq"` everywhere is a separate cleanup pass once `.faq-light` is proven.
- Category labels become `.tag` (live: soft-blue UPPERCASE chip) instead of inline grey. Visual change — confirm before pushing.
- Lede uses `.sdesc`. Headline uses `<h2>` (down-cast from h1 if Prismic emits h1).
- Items detection (the lookup loop in lines 7–19 of current source) is preserved as-is — that's data wrangling, not styling.

**Required CSS additions:** 4 lines (see approach A above).

**Risk:**
- Native `<details>` styling differs subtly across browsers; the `::-webkit-details-marker` rule covers Safari, but Firefox/Chromium need `list-style:none` on `summary`. Both are in the proposed snippet.
- The FAQ that currently renders against the live `id="faq"` `!important` overrides will now ALSO get the `.faq-light` rules — they should be identical, but double-check the rendered colors match.

---

## Cross-cutting CSS additions

Total new CSS in Phase 3, all additive in `@layer base`:

| Block | Lines | Purpose |
|---|---|---|
| `.pillar-hero` + `.pillar-hero h1/em/.sub`, `.pillar-stats`, `.pillar-stat*` | ~50 | New pillar-page hero pattern |
| `.btn-pillar-p`, `.btn-pillar-s` | ~20 | Pillar-page CTAs (squarer than `.btn` pill) |
| `details.fi summary.fiq{list-style:none}` + 3 sibling rules | 4 | Native `<details>` accordion support |
| **Total** | **~74** | |

These are bundled with the slice refactors — not a Phase 2 amendment. Each block is justified by its slice; nothing is preemptive.

## Slice-side cleanup summary

| Slice | Lines removed (inline / ad-hoc) | Lines added (semantic) | Net |
|---|---|---|---|
| PillarHero | ~50 | ~30 | −20 |
| CoursesHubHero | ~5 | ~5 | 0 |
| CourseGrid | ~3 | ~3 | 0 |
| WhyApMatters | ~5 | ~10 | +5 |
| ApPlanningPoll | ~2 | ~1 | −1 |
| ConversionBlock | ~25 | ~20 | −5 |
| FaqAccordion | ~30 | ~25 | −5 |
| **Total** | **~120** | **~94** | **−26** |

## Verification gate (must pass before any push)

Per the user's standing requirement:

1. `tsc --noEmit` — clean
2. `next dev` — boots, no compile errors
3. Real-browser screenshots @ 1280×3000 (Chrome headless):
   - `/`
   - `/courses`
   - `/course/ap-human-geography`
4. Visual compare each against equivalent area on apscore5.com (typography / spacing / button styles)
5. PillarHero "Score a 5…" headline visible (white on navy)
6. No regression on `/`, `/courses`, `/course/ap-human-geography`

Push only after all 6 pass.

## Open questions before execution

1. **ConversionBlock CTA color** — `.btn-p` (navy, matches "Create a free account" navy variant on some pages) or `.btn-accent` (orange, matches the orange CTA visible on the live screenshot)? Default to `.btn-p` unless told otherwise.
2. **ConversionBlock items grid** — accept `.grid3` (3-up max, wraps to 3+1) or add a `.grid4` (10 lines)? Default to `.grid3`.
3. **FaqAccordion category badge** — keep `.tag` (soft-blue, UPPERCASE) or design a softer category chip closer to the current grey badge? Default to `.tag`.
4. **PillarHero CTA radius** — current `rounded-[9px]` is squarer than the live homepage pill `.btn`. Keep squarer for pillar pages (proposed `.btn-pillar-*` borrowed `border-radius:9px`)? Or unify to live's pill? Default: keep squarer (matches the heavier pillar treatment user authorized).

Awaiting answers to (1)–(4) plus general approval before starting execution. **No slice files have been modified yet.**
