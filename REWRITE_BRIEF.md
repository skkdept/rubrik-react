# Rewrite brief: Rubrik marketing site → standalone React app

## Objective

Rebuild the Rubrik marketing site currently prototyped at `/Users/sravan/github/rubrik`
as a clean, production-quality, standalone React application in **this directory**
(`/Users/sravan/github/rubrik-react`) — a new project, not a modification of the old one.

The old repo is a Figma "Make" export: correct in visual design and content, but the
code itself is disposable — auto-generated component names (`Frame2147264933`,
`Group485`, `Rectangle34647390`), a single ~20,000-line generated file, and a global
`App.tsx` that reaches into the DOM with `document.querySelector` to bolt on
animations and portal content into placeholder divs. None of that structure should
carry over. Only the **visual design, copy, and interaction behavior** should.

## Source material (read-only reference — do not modify the old repo)

- `/Users/sravan/github/rubrik` — the existing prototype. Use it to see what the site
  looks like and how it behaves (scroll animations, tab switching, accordion,
  carousel) — not as a template for how to structure code.
- `/Users/sravan/github/rubrik/guidelines/Guidelines.md` — the authoritative style
  guide: color system, typography, spacing scale, component variants, documented
  accessibility contrast data, and page compositions. Treat every value in it as
  ground truth. Treat every item in its "Known gaps" section as something to flag,
  not invent.
- `/Users/sravan/github/rubrik/src/styles/theme.css` — the current primitive →
  semantic CSS custom-property mapping. Port the *values*, not the naming scheme
  (see Design tokens below — the new project uses a different, EDS-aligned naming
  convention).
- `/Users/sravan/github/rubrik/src/app/components/` — five hand-written (not
  Figma-generated) components: `stacking-cards-section.tsx`,
  `tabbed-surfaces-section.tsx`, `faq-accordion.tsx`, `intro-section.tsx`,
  `expandable-card-carousel.tsx`. These are the best reference for intended
  *behavior* — reimplement the same interactions cleanly; don't copy-paste as-is.

## Non-goals

- Don't touch or modify anything in `/Users/sravan/github/rubrik`.
- Don't redesign anything — this is a re-platform, not a refresh. Match existing
  visual design, copy, and layout.
- Don't invent values for anything Guidelines.md explicitly calls out as
  undocumented (responsive breakpoints, secondary-button border hex, gradient
  angle, dark-mode spec, error/destructive color, FAQ transition duration/easing).
  Log these to a running `ASSUMPTIONS.md` instead of guessing silently — same
  discipline Guidelines.md already applies to itself.

## New project setup

- Stack: React + TypeScript + Vite.
- Styling: plain CSS (one CSS Module per component), driven entirely by CSS
  custom-property design tokens — no Tailwind or other utility-class framework.
  This is deliberate: Edge Delivery Services (EDS) blocks are hand-written CSS
  files keyed to custom-property tokens, and utility-class markup doesn't
  translate to that model cleanly, while a token-driven CSS Module nearly does.
- Routing: none yet. Guidelines.md documents three page compositions (Home, About
  Us, Why Rubrik) but confirm with the user whether to build all three or just Home
  before adding a router.

## Component naming

Every component gets a real, semantic name describing what it is — never what
Figma called it.

- No `Frame…`, `Group…`, `Rectangle…`, numeric ID suffixes, or any other Figma
  layer name anywhere in the new codebase.
- PascalCase component names, kebab-case file names (matching the existing
  hand-written components' own convention, e.g. `FaqAccordion` in
  `faq-accordion.tsx`).
- Name components by role, e.g.: `SiteHeader`, `HeroSection`, `PlatformIntro`,
  `StatCardGrid`, `PlatformSurfacesStacked`, `PlatformSurfacesTabbed`,
  `TestimonialCarousel`, `FaqSection`, `CtaBanner`, `SiteFooter`.

## Design tokens (EDS-conversion-ready)

Mirror the three-tier token naming this workspace already uses for its AEM/EDS
design-token pipeline (see the `aem-design-tokens` skill), so a future EDS
conversion is a mechanical rename, not a redesign:

- **Tier 1 — Primitive**: `--primitive-color-*`, `--primitive-spacing-*`,
  `--primitive-font-*`, `--primitive-radius-*`, `--primitive-grid-*`, etc. Raw
  values only, ported from `theme.css` + Guidelines.md. Never referenced directly
  in component CSS.
- **Tier 2 — Semantic**: `--semantic-color-fg-*`, `--semantic-color-bg-*`,
  `--semantic-color-border-*`, `--semantic-text-*`, etc. Role-based aliases that
  resolve to primitives. **Components only ever reference these.**

Port every value from `theme.css`'s `--rubrik-*` primitives and its
`--background`/`--foreground`/`--primary`/etc. semantic aliases into this
two-tier shape — don't drop a documented value, don't add ones Guidelines.md and
`theme.css` don't support. This includes: the full color system, the type scale
(sizes/line-heights/letter-spacing), the spacing scale (4/8/12/16/20/24/32/40/48/
64/80/96/120/160px), and the four CTA button styles (Primary/Secondary/Accent/
Dark) with their documented AAA contrast pairings.

## Grid system

- 12-column grid: **12 columns desktop, 8 columns tablet, 4 columns mobile.**
  (Tablet: use 8 rather than 6 — divides more evenly against a 12-column base.
  Log this choice in `ASSUMPTIONS.md`, since Guidelines.md doesn't specify it.)
- Breakpoints aren't documented in Guidelines.md either — use conventional values
  (e.g. mobile <768px, tablet 768–1199px, desktop ≥1200px) and log them the same
  way, flagged for design to confirm.
- Desktop content stays constrained to 1312px inside a 1440px page (64px side
  margins) per Guidelines.md — build the grid within that constraint, not
  full-bleed.

## Browser & device support

Target latest-stable only — no legacy fallback paths needed:

- Desktop: Chrome 149, Safari 26.5, Edge 149, Firefox 152
- Mobile: Android 17, iOS 26.5 / 26.5.1 (Mobile Safari)

These are all fully modern evergreen targets, so don't hold back on modern CSS —
container queries, `:has()`, native CSS nesting, `color-mix()`, `light-dark()`,
subgrid, and the native `<dialog>`/popover APIs are all safe to reach for where
they simplify the implementation. Avoid only genuinely experimental,
behind-a-flag features.

## Accessibility

Guidelines.md is explicit that its own accessibility section covers color
contrast only — nothing about keyboard nav, focus-visible, ARIA, or reduced
motion. Build those in anyway as standard practice: semantic landmarks
(`header`/`nav`/`main`/`section`/`footer`), a real heading hierarchy, visible
focus states, fully keyboard-operable tabs/accordion/carousel,
`prefers-reduced-motion` handling for every scroll/entrance animation, and alt
text on every image.

## Behavior to reimplement (reimplement, don't port the code)

- Hero entrance: fade + slide up, staggered per element, on load.
- Sitewide scroll-reveal: fade + slide up on first viewport entry, staggered —
  implement via `IntersectionObserver` scoped inside each section's own
  component (a hook/HOC is fine), not one global DOM-querying sweep like the old
  `App.tsx`.
- `PlatformSurfacesStacked`: scroll-locked card stacking (4 cards, wheel/touch
  driven, depth-scaled stacking effect).
- `PlatformSurfacesTabbed`: click-driven tabs over the same 4 pieces of content.
  Build both — ask the user which one ships on the real page, or whether both
  stay for a side-by-side comparison.
- `FaqSection`: accordion with animated height and the documented
  Default→Clicked color states.
- `TestimonialCarousel`: expandable card carousel.
- No global `document.querySelector`/DOM reach-arounds anywhere — everything
  scoped via refs/hooks inside the component that owns it.

## Execution plan

1. Scaffold the Vite + React + TS project in this directory.
2. Build the token layer (primitive + semantic CSS custom properties) from
   `theme.css` + Guidelines.md, and start `ASSUMPTIONS.md` for anything
   undocumented.
3. Build grid/layout primitives (container, 12/8/4-column grid, breakpoint
   hooks/mixins).
4. Build shared UI primitives: the 4 CTA button styles × 3 sizes, form input,
   tab, accordion item.
5. Build each section component one at a time, checking visual/behavioral parity
   against the running old site (`npm run dev` in `/Users/sravan/github/rubrik`).
6. Responsive QA at mobile/tablet/desktop breakpoints.
7. Accessibility pass: keyboard nav, focus states, reduced motion, screen-reader
   labels.
8. Spot-check in real Chrome/Safari/Firefox/Edge if available; otherwise rely on
   the modern-CSS baseline above.

## Ask the user before proceeding on

- Which `PlatformSurfaces` variant (stacked vs. tabbed) is the one to ship, or
  whether both stay.
- Whether to rebuild just the Home page, or About Us / Why Rubrik too.
- Font licensing — FK Grotesk, FK Grotesk Mono, and Tiempos Text aren't loaded
  anywhere yet in the old repo (Guidelines.md flags this); real font files are
  needed before type renders as intended.
- Tablet column count (8 recommended vs. 6) and the breakpoint values, since
  neither is documented in Guidelines.md.
