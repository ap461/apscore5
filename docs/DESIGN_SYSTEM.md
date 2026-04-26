# APScore5 Design System — Audit

**Source of truth:** `https://apscore5.com` (production). Captured 2026-04-26.

**Files audited:**
- `docs/live-homepage.html` — live homepage HTML (57 KB)
- `docs/live-css/main.css` — only `<link rel="stylesheet">` on the page; 13.9 KB; contains all design tokens, fonts, base styles, component classes, layout (cited as `main.css` below)

**Key findings up front:**
1. The live site has **one** CSS bundle. Zero inline `<style>` blocks. Zero external font CDN `<link>` tags — fonts come via `@import` and `@font-face` inside `main.css`.
2. The live homepage uses **no Tailwind utility classes**. Every element is styled via semantic classes (`.hero`, `.btn-p`, `.eyebrow`, `.kicker`, `.qcard`, `.ccard`, `.cta-box`, `.nl-box`, `.fi`, etc.). This is the system to codify.
3. Staging's `app/globals.css` is a near-verbatim copy of live's `main.css` — the same `:root` vars, the same component classes, the same media queries. It already IS the design system; it just hasn't been treated as one. The drift is in **slices**, not in `globals.css`.

---

## 1. Colors

All defined as CSS custom properties on `:root`. Verbatim from `main.css`:

```css
:root{
  --navy:#0a0f5a;
  --blue:#2f66d0;
  --lb:#5aa9ff;
  --orange:#f5a623;
  --white:#fff;
  --soft:#f6f8ff;
  --soft2:#eef4ff;
  --text:#0d1845;
  --muted:#3d4a7a;
  --border:#0a0f5a1a;       /* navy @ 10% */
  --border-mid:#0a0f5a2e;   /* navy @ 18% */
  --shadow:0 18px 50px #0a0f5a14;     /* navy @ ~8% */
  --shadow-sm:0 4px 16px #0a0f5a12;   /* navy @ ~7% */
  --radius:18px;
  --max:1140px;
}
```

| Role | Token | Hex | Usage |
|---|---|---|---|
| Brand primary | `--navy` | `#0a0f5a` | h1/h2 color, footer/hero-cta backgrounds, primary button bg |
| Accent | `--orange` | `#f5a623` | Stat numbers, accent button, eyebrow dot, newsletter button |
| Mid blue | `--blue` | `#2f66d0` | Eyebrow text, kicker text, link/secondary accents |
| Light blue | `--lb` | `#5aa9ff` | Footer headings, gradient endpoints |
| Body text | `--text` | `#0d1845` | Default body color |
| Muted text | `--muted` | `#3d4a7a` | Sub copy, captions, footer link color (when inverted) |
| Page bg | `--soft` | `#f6f8ff` | `body` background |
| Tinted bg | `--soft2` | `#eef4ff` | Tag/icon backgrounds, FAQ section bg |
| Border | `--border` | `rgba(10,15,90,.10)` | Card borders |
| Border (stronger) | `--border-mid` | `rgba(10,15,90,.18)` | Outline button border |
| Shadow | `--shadow` | `0 18px 50px rgba(10,15,90,.08)` | Hero card, CTA box |
| Shadow (small) | `--shadow-sm` | `0 4px 16px rgba(10,15,90,.07)` | Card hover lift |

Inverted-surface text colors used on navy backgrounds (footer / nl-box / hero-cta), verbatim:

| Hex literal | Computed | Used for |
|---|---|---|
| `#fff` | white | Headings on navy |
| `#ffffffa6` (≈65% white) | white/65 | Stat captions, footer body links |
| `#ffffff9e` (≈62% white) | white/62 | Newsletter description |
| `#ffffffd9` (≈85% white) | white/85 | FAQ answers (when on dark) |
| `#ffffffb3` (≈70% white) | white/70 | FAQ chevron arrow |
| `#fff6` (≈40% white) | white/40 | Newsletter fine print |
| `#ffffff1f` (≈12% white) | white/12 | Stat-bar dividers |
| `#fff3` (≈20% white) | white/20 | FAQ card border (on dark) |

State colors (used inline on `.opt` quiz states):

```css
.opt.chosen-correct{background:#eef6ff;border-color:#2f66d066}
.opt.chosen-wrong  {background:#fff3f3;border-color:#dc323259}
.opt.show-correct  {background:#eef6ff;border-color:#2f66d066}
.opt.chosen-wrong .letter{background:#e03030;color:#fff;border-color:#e03030}
```

Token candidates: `--ok-bg #eef6ff`, `--err-bg #fff3f3`, `--err-fg #e03030`.

---

## 2. Typography

### Font stacks

```css
body{font-family:Inter,system-ui,-apple-system,sans-serif;}
```

**Body font: Inter**, loaded via `@import` at the top of `main.css`:

```css
@import "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
```

Weights loaded: 400, 500, 600, 700, 800.

Geist Sans and Geist Mono are also embedded via `@font-face` (next/font output) and exposed as `--font-geist-sans` / `--font-geist-mono` CSS vars on the root element — **but neither is actually applied to body or any class on the live homepage**. They are inert on the rendered page.

### Scale

All from `main.css`:

| Element | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|
| `body` | `17px` | 400 | `1.75` | — | `var(--text)` |
| `h1` | `clamp(34px, 5.5vw, 62px)` | (default) | `1` | `-0.05em` | `var(--navy)` |
| `h2` | `clamp(30px, 4.5vw, 50px)` | (default) | `1.05` | `-0.04em` | `var(--navy)` |
| `.ccard h3` | `16px` | (default) | (default) | `-0.02em` | `var(--navy)` |
| `.nl-box h3` | `22px` | (default) | `1.2` | `-0.03em` | `#fff` |
| `.eyebrow` | `12px` | 700 | (default) | `0.06em` UPPERCASE | `var(--blue)` |
| `.kicker` | `13px` | 800 | (default) | `0.08em` UPPERCASE | `var(--blue)` |
| `.sub` (hero subhead) | `18px` | 400 | `1.75` | — | `var(--muted)` |
| `.sdesc` (section description) | `17px` | 400 | `1.75` | — | `var(--muted)` |
| `.note` (small) | `13px` | 400 | (default) | — | `var(--muted)` |
| `.tp` (trust pill) | `13px` | 600 | — | — | `var(--navy)` |
| `.tp span` (caption) | `11px` | 500 | — | — | `var(--muted)` |
| `.btn` | `15px` | 700 | — | — | (varies) |
| `.tag` | `11px` | 800 | — | `0.04em` UPPERCASE | `var(--blue)` |
| `.stat strong` | `24px` | 800 | `1` | — | `var(--orange)` |
| `.stat span` | `12px` | 400 | — | — | `#ffffffa6` |
| `footer h4` | `12px` | 800 | — | `0.05em` UPPERCASE | `var(--lb)` |
| `footer a, footer p` | `14px` | 400 | `2` | — | `#ffffffa6` |

Verbatim h1/h2:
```css
h1{letter-spacing:-.05em;color:var(--navy);margin-bottom:16px;font-size:clamp(34px,5.5vw,62px);line-height:1}
h2{letter-spacing:-.04em;color:var(--navy);margin-bottom:10px;font-size:clamp(30px,4.5vw,50px);line-height:1.05}
```

Mobile h1/h2 overrides at `≤768px`:
```css
h1{font-size:clamp(32px,8vw,48px);line-height:1.05}
h2{font-size:clamp(26px,6vw,40px)}
```

### Eyebrow vs Kicker

These are **different components**, not synonyms:

```css
.eyebrow{
  border:1px solid var(--border);
  letter-spacing:.06em;
  text-transform:uppercase;
  color:var(--blue);
  background:#ffffffe6;
  border-radius:999px;
  align-items:center;
  gap:8px;
  margin-bottom:20px;
  padding:8px 16px;
  font-size:12px;
  font-weight:700;
  display:inline-flex;
}
.eydot{
  background:var(--orange);
  border-radius:50%;
  flex-shrink:0;
  width:8px;height:8px;
}
```
→ Pill-shaped badge with a 8×8 orange dot inside, on light backgrounds. Used in the hero and CTA box.

```css
.kicker{
  letter-spacing:.08em;
  text-transform:uppercase;
  color:var(--blue);
  margin-bottom:8px;
  font-size:13px;
  font-weight:800;
}
```
→ Plain UPPERCASE label above an h2 (no pill, no border). Used at the top of every content section.

---

## 3. Spacing

### Page rhythm

```css
section{padding:44px 0}
```

Every `<section>` gets `44px` top + `44px` bottom by default. The hero is a `<div class="hero">` (not a `<section>`) and has its own padding:

```css
.hero{ ...padding:52px 0 40px... }
@media (max-width:768px){ .hero{padding:32px 0 28px} }
```

### Container

```css
.container{max-width:var(--max);margin:0 auto;padding:0 24px}
@media (max-width:768px){ .container{padding:0 16px} }
```

`--max: 1140px`. Horizontal padding `24px` desktop, `16px` mobile.

### Inner gaps

| Where | Value | Source |
|---|---|---|
| Hero text-vs-card grid | `gap:44px` | `.hero-inner` |
| Hero CTA row | `gap:12px` | `.hbtns` |
| Hero trust row | `gap:8px` | `.trust` |
| Course-grid cards | `gap:14px` | `.grid3` |
| FAQ items | `gap:8px` | `.faq-wrap` |
| Quiz card content | `margin-bottom:14px` | `.prog`, `.opts`, `.question` |
| Below h1 | `margin-bottom:16px` | `h1` |
| Below h2 | `margin-bottom:10px` | `h2` |
| Below `.kicker` | `margin-bottom:8px` | `.kicker` |
| Below `.eyebrow` | `margin-bottom:20px` | `.eyebrow` |
| Below `.sub` | `margin-bottom:24px` | `.sub` |
| Below `.sdesc` | `margin-bottom:22px` | `.sdesc` |

### Border radii

| Use | Value |
|---|---|
| Buttons, badges, nav-links, prog bar | `999px` (pill) |
| Default card | `var(--radius)` = `18px` |
| Quiz card | `24px` |
| FAQ card | `14px` |
| Newsletter box | `22px` |
| CTA box | `26px` |
| Stat divider radius | n/a |
| Tag, letter circle | `999px` / 50% |

### Breakpoints

```css
@media (max-width:900px){ ...3-up grids → 2-up; nl-box, cta-box → 1col... }
@media (max-width:768px){ ...nav shrinks; nav-links/login hidden; h1/h2 shrink... }
@media (max-width:480px){ .footer-inner{grid-template-columns:1fr} }
```

---

## 4. Components

### Buttons (verbatim)

```css
.btn{
  cursor:pointer;
  white-space:nowrap;
  border:none;
  border-radius:999px;
  justify-content:center;
  align-items:center;
  gap:8px;
  padding:13px 22px;
  font-family:inherit;
  font-size:15px;
  font-weight:700;
  text-decoration:none;
  transition:transform .15s,opacity .15s;
  display:inline-flex;
}
.btn:hover{opacity:.93;transform:translateY(-1px)}

.btn-p{background:var(--navy);color:#fff;box-shadow:0 8px 24px #0a0f5a2e}
.btn-s{color:var(--navy);border:1.5px solid var(--border-mid);background:#fff}
.btn-accent{background:var(--orange);color:var(--navy)}
```

Mobile shrink:
```css
@media (max-width:768px){ .btn{padding:10px 16px;font-size:13px} }
```

| Variant | Class | Bg | Text | Border |
|---|---|---|---|---|
| Primary (navy) | `.btn .btn-p` | navy | white | none + soft navy shadow |
| Secondary (outline) | `.btn .btn-s` | white | navy | `1.5px` border-mid |
| Accent (orange) | `.btn .btn-accent` | orange | navy | none |

There is no `.btn-ghost` in the live system. (User's spec mentions one — flagging for Phase 2 decision.)

### Eyebrow (light bg)

```css
.eyebrow{...} .eydot{...}  /* see §2 */
```

Markup pattern: `<div class="eyebrow"><div class="eydot"></div>LABEL TEXT</div>`

### Kicker

```css
.kicker{letter-spacing:.08em;text-transform:uppercase;color:var(--blue);margin-bottom:8px;font-size:13px;font-weight:800}
```

Markup pattern: `<div class="kicker">SECTION KICKER</div>` placed directly above the section h2.

### Section description

```css
.sdesc{color:var(--muted);max-width:620px;margin-bottom:22px;font-size:17px;line-height:1.75}
```

The lead paragraph below an h2.

### Cards

**`.qcard`** — hero quiz/showcase card (large, white, big shadow):
```css
.qcard{border:1px solid var(--border);box-shadow:var(--shadow);background:#fff;border-radius:24px;padding:22px}
```

**`.ccard`** — course grid card (white, hover lift):
```css
.ccard{border:1px solid var(--border);border-radius:var(--radius);color:inherit;background:#fff;padding:18px;text-decoration:none;transition:all .15s;display:block}
.ccard:hover{box-shadow:var(--shadow-sm);border-color:#2f66d04d;transform:translateY(-2px)}
.ccard h3{color:var(--navy);letter-spacing:-.02em;margin-bottom:5px;font-size:16px}
.ccard p{color:var(--muted);margin-bottom:10px;font-size:13px;line-height:1.65}
```

**`.cp`** — checklist pill (one row of a key-points list):
```css
.cp{border:1px solid var(--border);color:var(--navy);background:#ffffffeb;border-radius:12px;padding:12px 14px;font-size:14px;font-weight:700}
```

**`.fi`** — FAQ accordion item (default style is for dark backgrounds):
```css
.fi{background:#ffffff1f;border:1px solid #fff3;border-radius:14px;overflow:hidden}
.fiq{cursor:pointer;color:#fff; ...padding:16px 18px;font-size:15px;font-weight:600;display:flex}
.fia{color:#ffffffd9;padding:0 18px 16px;font-size:15px;line-height:1.75;display:none}
.fia.show{display:block}
.arr{color:#ffffffb3;font-size:16px;transition:all .25s}
.fiq.open .arr{transform:rotate(180deg)}
```

The live FAQ section overrides this for **light** background via `#faq` selectors at the bottom of `main.css`:
```css
#faq{background:#eef4ff!important}
#faq .kicker{color:var(--blue)!important}
#faq h2{color:var(--navy)!important}
#faq .sdesc{color:var(--muted)!important}
#faq .fiq{color:var(--navy)!important}
#faq .fia{color:var(--muted)!important}
#faq .arr{color:var(--navy)!important}
#faq .fi{background:#fff!important;border-color:#0a0f5a1f!important}
```

This `#faq` ID-based override is fragile (every FAQ section needs `id="faq"` to pick up light styling). Phase 2 should introduce a `.faq-light` modifier class instead.

### Inputs

Only one input style exists, in the newsletter form:
```css
.nl-form input{
  border:none;
  border-radius:999px;
  outline:none;
  flex:1;
  min-width:0;
  padding:12px 16px;
  font-family:inherit;
  font-size:14px;
}
```

No standalone `.input` class. Phase 2 should extract one.

### Trust pill

```css
.tp{border:1px solid var(--border);color:var(--navy);background:#ffffffe0;border-radius:14px;padding:10px 13px;font-size:13px;font-weight:600}
.tp span{color:var(--muted);margin-top:2px;font-size:11px;font-weight:500;display:block}
```

Markup: `<div class="tp">95%<span>pass rate</span></div>`

### Tag

```css
.tag{background:var(--soft2);color:var(--blue);text-transform:uppercase;letter-spacing:.04em;border-radius:999px;flex-shrink:0;padding:5px 10px;font-size:11px;font-weight:800}
```

Smaller than eyebrow, no border, soft-blue chip.

### Links

```css
a{color:inherit;text-decoration:none}
.nav-link{color:var(--muted);white-space:nowrap;border-radius:999px;padding:8px 13px;font-size:14px;font-weight:500;transition:all .15s}
.nav-link:hover{color:var(--navy);background:var(--soft2)}
.clink{color:var(--blue);font-size:13px;font-weight:700}  /* "Explore more" link inside a course card */
.nudge a{color:var(--blue);font-weight:700}
```

---

## 5. Section patterns

### Hero (light, gradient)

```css
.hero{
  background:radial-gradient(circle at 88% 8%,#5aa9ff38,transparent 28%),
             radial-gradient(circle at 10% 6%,#f5a62329,transparent 26%),
             linear-gradient(180deg,#fff,var(--soft));
  padding:52px 0 40px;
  position:relative;
  overflow:hidden;
}
.hero:before{
  content:"";
  pointer-events:none;
  background-image:linear-gradient(#0a0f5a0a 1px,#0000 1px),
                   linear-gradient(90deg,#0a0f5a0a 1px,#0000 1px);
  background-size:44px 44px;
  position:absolute;inset:0;
}
.hero-inner{
  z-index:1;
  grid-template-columns:1.1fr .9fr;
  align-items:center;
  gap:44px;
  display:grid;
  position:relative;
}
```

Markup (from live homepage):
```html
<div class="hero">
  <div class="container">
    <div class="hero-inner">
      <div class="hero-text">
        <div class="eyebrow"><div class="eydot"></div>...</div>
        <h1>...</h1>
        <p class="sub">...</p>
        <div class="hbtns">...</div>
        <div class="note">...</div>
        <div class="trust"><div class="tp">...</div>...</div>
      </div>
      <div class="qcard">...quiz widget...</div>
    </div>
  </div>
</div>
```

→ Two-column grid (1.1fr / 0.9fr), text left, white card right. Soft pastel background with a faint dot grid overlay.

### Stats bar (navy band)

```css
.stats-bar{background:var(--navy);padding:20px 0}
.stats-inner{max-width:var(--max);flex-wrap:wrap;justify-content:center;gap:0;margin:0 auto;padding:0 24px;display:flex}
.stat{text-align:center;border-right:1px solid #ffffff1f;padding:8px 28px}
.stat:last-child{border:none}
.stat strong{color:var(--orange);font-size:24px;font-weight:800;line-height:1;display:block}
.stat span{color:#ffffffa6;margin-top:3px;font-size:12px;display:block}
```

→ Full-bleed navy band immediately under the hero, white-divided columns of stat numbers (orange) + caption (white/65).

### Course grid (3-up, light)

```css
.grid3{grid-template-columns:repeat(3,1fr);gap:14px;display:grid}
@media (max-width:900px){ .grid3{grid-template-columns:1fr 1fr} }
@media (max-width:768px){ .grid3{grid-template-columns:1fr} }
```

Each card:
```html
<a class="ccard" href="...">
  <div class="ctop2">
    <div class="icon">📊</div>
    <div class="qcount">120 Qs</div>
  </div>
  <h3>Course title</h3>
  <p>Short description.</p>
  <span class="clink">Explore more →</span>
</a>
```

Section wrapper:
```html
<section>
  <div class="container">
    <div class="kicker">BROWSE COURSES</div>
    <h2>All AP courses in one place</h2>
    <p class="sdesc">...</p>
    <div class="grid3">...cards...</div>
  </div>
</section>
```

### FAQ accordion (override-light pattern)

Live homepage uses `<section id="faq">` to flip the colors via the `#faq …!important` overrides documented above. Default `.fi/.fiq/.fia` styles assume a navy/dark surface; the `#faq` override switches them to white card on `#eef4ff` background.

### Newsletter band (navy, two-column)

```css
.nl-box{
  background:var(--navy);
  border-radius:22px;
  grid-template-columns:1fr 1fr;
  align-items:center;
  gap:24px;
  margin:0 0 20px;
  padding:28px;
  display:grid;
}
.nl-box h3{color:#fff;letter-spacing:-.03em;font-size:22px;line-height:1.2}
.nl-box p{color:#ffffff9e;margin-top:6px;font-size:14px;line-height:1.65}
.nl-form{gap:8px;display:flex}
.nl-form input{...pill input...}
.nl-form button{background:var(--orange);color:var(--navy);...font-weight:800}
.nl-note{color:#fff6;margin-top:8px;font-size:11px}
```

→ Sits inside a regular `<section>`, not full-bleed.

### CTA box (light, large radius)

```css
.cta-box{
  background:linear-gradient(135deg,#fff,var(--soft2));
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  border-radius:26px;
  grid-template-columns:1.2fr .8fr;
  align-items:center;
  gap:20px;
  padding:30px;
  display:grid;
}
.cta-box p{color:var(--muted);margin-top:10px;font-size:16px;line-height:1.75}
.cta-btns{flex-wrap:wrap;gap:10px;margin-top:16px;display:flex}
.cpoints{gap:8px;display:grid}
.cp{...checklist pill, see §4...}
```

Two-column inside; collapses to 1col at ≤900px.

### Footer (navy)

```css
footer{background:var(--navy);border-top:none;padding:30px 0 40px}
.footer-inner{grid-template-columns:1.2fr 1fr 1fr 1fr;gap:20px;display:grid}
.footer-logo{width:auto;height:42px;margin-bottom:10px;display:block}
footer h4{letter-spacing:.05em;text-transform:uppercase;color:var(--lb);margin-bottom:10px;font-size:12px;font-weight:800}
footer a,footer p{color:#ffffffa6;font-size:14px;line-height:2;display:block}
footer a:hover{color:#fff}
.disc{color:#fff6;margin-top:10px;font-size:12px;line-height:1.7}
```

→ 4-column grid (1.2/1/1/1), navy band, light-blue h4 labels, white/65 link text.

### Nav (sticky, blurred)

```css
.nav-wrap{
  z-index:100;
  -webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
  background:#fffffff2;     /* white @ 95% */
  position:sticky;top:0;
}
.nav{justify-content:space-between;align-items:center;gap:16px;height:72px;display:flex}
```

Mobile: `height:64px`, links and login hidden.

---

## 6. What's missing on live (Phase 2 candidates)

The live CSS is what it is, but the spec the user wrote calls out a few things that don't currently exist. Flagging for Phase 2 decisions:

1. **`.btn-ghost`** — not on live. Most likely the user means `.btn-s` (the outline button). Confirm before adding a new variant.
2. **`.section`, `.section-hero`, `.section-light`, `.section-cta`** — not on live. Live just uses bare `<section>` (with the global `section{padding:44px 0}` rule) and ID-based overrides like `#faq`. Phase 2 can introduce these as semantic modifiers without breaking anything (they'd be additive).
3. **`.body-lg`, `.body`, `.small`** — not on live. Today the patterns are `.sub` (18px), default body (17px), `.note`/`.disc` (13px/12px). Mapping: `.body-lg` → `.sub`, `.body` → default, `.small` → 13px @ var(--muted).
4. **Standalone `.input`** — not on live. Newsletter input style can be extracted.
5. **FAQ light variant** — currently keyed by `#faq` ID with `!important`. Phase 2 should add `.fi-light` / `.faq-light` as a class modifier so multiple FAQ blocks can coexist on a page.

---

## 7. Staging vs live — diff

I read staging's `app/globals.css` end-to-end. The relevant deltas:

- **Identical:** `:root` variables, `.btn`/`.btn-p`/`.btn-s`/`.btn-accent`, `.eyebrow`/`.eydot`, `.kicker`, `h1`/`h2`, `.sub`/`.sdesc`/`.note`/`.tp`, `.qcard`/`.ccard`/`.cp`, `.faq-wrap`/`.fi`/`.fiq`/`.fia`, `.nl-box`, `.cta-box`, `footer`, `.nav-wrap`, all media queries, the `#faq` override block.
- **Staging-only additions:** `@theme { --color-navy/--color-blue/--color-light-blue/--color-orange }` block (added in the recent PillarHero work) — keeps Tailwind utilities like `.bg-navy` available for slices that need them.
- **Staging-only structural change:** the legacy CSS is now wrapped in `@layer base { … }` (added when fixing the PillarHero invisibility bug) so Tailwind utilities can override.
- **Inert on live but loaded:** Inter via `@import` (live), Geist + Geist Mono via `next/font` `@font-face` (both), but body uses Inter only.

Net: **Phase 2 doesn't need to invent a design system.** It needs to (a) document/canonicalize the existing class names in CSS comments, (b) add the small set of missing modifiers (`.faq-light`, optional section-modifier classes, optional `.input`, optional typography aliases), and (c) keep the `@theme` mapping in sync so a slice can still use `bg-navy` Tailwind utilities when convenient.

The real work — and the source of the inconsistency the user is seeing — is **Phase 3: refactoring the slices** to actually use these classes instead of inline styles and ad-hoc Tailwind.

---

## 8. Slice-by-slice quick gap (information for Phase 3 — not part of this audit's mandate, but worth noting)

I scanned the existing slice files when generating the type bundle. Quick read of which use the system vs not (to be revisited and re-checked at the start of Phase 3, not acted on now):

- `HeroSection` — uses `.hero`, `.container`, `.hero-inner`, `.eyebrow`, `.btn`. **On-system.** ✅
- `CoursesGrid` — TBD (need to re-read at Phase 3).
- `CoursesHubHero`, `CourseGrid`, `WhyApMatters`, `ApPlanningPoll`, `ConversionBlock`, `FaqAccordion` — staging-era slices, mix of inline + ad-hoc.
- `PillarHero` (newly added) — pure Tailwind utilities (`bg-navy`, `text-white`, etc.) plus `@theme` mapping. **Off-system** by intent — the user can decide whether to refactor it to a `.pillar-hero` semantic class or to leave as Tailwind during Phase 3.
- `NewsletterSignup` — TBD.
- `TrustBar` — TBD.

These will be re-audited file-by-file at the start of Phase 3.

---

**End of audit.** No code changes have been made. Awaiting your approval to proceed to Phase 2 (codifying tokens + semantic component classes in `app/globals.css`).
