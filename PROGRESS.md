# Rewrite progress log

Working checkpoint for the rebuild described in `REWRITE_BRIEF.md`. Update this
file as phases complete so the work can resume cleanly across sessions/context
resets. Do not treat this as user-facing documentation — it's a build log.

> Note: this file was accidentally wiped once by `create-vite --overwrite`
> (which removes ALL existing files in the target dir, not just conflicting
> ones) during project scaffolding, then restored from conversation context.
> Nothing downstream of scaffolding was lost. Be careful re-running scaffolding
> commands with `--overwrite` in a non-empty directory.

## Decisions locked in with the user (2026-08-05)

- **PlatformSurfaces**: build both `PlatformSurfacesStacked` (scroll/wheel-driven,
  from `stacking-cards-section.tsx`) and `PlatformSurfacesTabbed` (click tabs,
  from `tabbed-surfaces-section.tsx`) — both ship side by side on the Home page
  for comparison, per the old `App.tsx`'s own stated intent.
- **Pages**: Home only for this pass. About Us / Why Rubrik deferred.
- **Fonts**: system-font fallback stack now (`--rubrik-font-sans` etc. already
  define fallbacks in the old `theme.css`), real FK Grotesk/FK Grotesk
  Mono/Tiempos Text files to be sourced later. Log in ASSUMPTIONS.md.
- **Grid**: 12 desktop / 8 tablet / 4 mobile columns. Breakpoints: mobile
  <768px, tablet 768–1199px, desktop ≥1200px. (Note: the old repo's hand-written
  components use a 992px desktop breakpoint for their own JS `matchMedia`
  checks — when reimplementing their behavior, the *interaction* breakpoint can
  stay conceptually "desktop vs. not" but should read from the new project's
  shared breakpoint token/hook, not a hardcoded 992 — reconcile against the
  1200px desktop breakpoint decision above and log any divergence.)

## Source content extraction (from old repo, read-only reference)

Full Guidelines.md and theme.css already read in full — see design tokens plan
below. The 5 hand-written components already read in full:
`stacking-cards-section.tsx`, `tabbed-surfaces-section.tsx`,
`faq-accordion.tsx`, `intro-section.tsx`, `expandable-card-carousel.tsx`.

An Explore agent grepped the 20,143-line generated
`src/imports/HomePage/index.tsx` for real copy (that file itself is NOT a
structural reference — only used to recover text/asset content the
hand-written components don't cover). Findings:

- **Nav**: logo = abstract inline-SVG mark, no wordmark text. Primary links:
  `Products`, `Solutions`, `Knowledge Hub`, `About Us`. Secondary links:
  `Zero Labs`, `CXO`, `Partners`, `Support`. Dark CTA: `Contact Sales`. **No AI
  search bar in Nav in the raw file** — the only search bar is inside Hero.
  Decision: skip the Nav-level AI-search toggle (not backed by real content);
  log as a gap.
- **Hero**: kicker `Rubrik Agent Cloud`. Headline `Built for the threats that
  don't exist yet.` (two lines). Subtitle `One platform. Data, identity, and AI
  unified from the foundation up. Not assembled. Not bolted on.` Two CTAs:
  Primary `Watch Demo Now →`, Secondary `Explore Rubrik's Platform →`. Search
  bar: placeholder `Ask Rubrik anything`, button `Ask`. Background image
  `afab740d54a91fd17a67f3e76b18a14e267633c1.png`. Below search bar: an empty
  dark placeholder slot (571px tall) — no content, product screenshot never
  filled in by design; carry over as an empty placeholder, log as a gap.
  "Trusted by" logo strip (`Frame70`) right after Hero is placeholder abstract
  vector shapes with **no captions, no alt text, no real company data** —
  decision: omit from the rewrite (not in Guidelines.md's documented page
  composition either), log as an omission.
- **PlatformIntro** (`Heading-Subheading-intro`, appears once in raw file,
  matches `intro-section.tsx` verbatim): heading `Most platforms are bolted
  together. Rubrik is the only platform for data, identity and AI.` body
  `Rubrik is built from the foundation up, not patched together from point
  solutions. The architecture holds regardless of what's happening: an attack,
  a scaling event, a new agent in production.` Only ONE instance exists with
  real content even though Guidelines.md's page-composition table lists
  "Heading/Subheading intro" twice (once pre-FAQ too) — log as a gap, only
  render it once (post-Hero position).
- **StatCardGrid**: raw file has 5 card slots but 3 are unfinished/duplicated
  Figma placeholder junk (repeated caption "E2E Resilience for M365", wrong
  chip labels, truncated heading text reused from intro). Decision: build only
  the 2 real ones per Guidelines.md's own page-composition note ("Stat Cards
  42%, 21%"): Card 1 — chip `AI`, stat `42%`, caption `Secure and Accelerate
  AI`, image `28e3da9661320bd1ff2a9070e053e05633e42f21.png`. Card 2 — chip
  `SaaS`, stat `21%`, caption `E2E Resilience for M365`, image
  `39d24c3c0d492129660c1c80e8c674cede8a6995.png`. Log the dropped 3 as an
  omission.
- **PlatformSurfacesStacked/Tabbed**: use the hand-written components' own
  CARD_DATA (4 real, fully-fleshed cards: Data Security/Threat
  Detection/Compliance/Cyber Resilience) — this supersedes the raw generated
  file's version of this section, which just repeats placeholder content
  (`DATA SECURITY` chip and `73%` stat on all 4 cards). Section heading above
  both: `One Architecture, Three Surfaces.` / `Data. Identity. AI. One shared
  platform.` (already present in both hand-written files).
- **Second Desktop Section (after Testimonial per Guidelines.md)**: no real
  content exists anywhere in the raw file for this — only one `Desktop
  Section` DOM node exists total, and it's the stacking-cards one already
  covered above. Decision: omit, log as a gap (don't invent content).
- **TestimonialCarousel**: use `expandable-card-carousel.tsx` content as-is (4
  real quotes/stats: 22% Samantha Dengate, 73% James Harrington, 99.9% Priya
  Nair, 4× Marcus Chen).
- **CtaBanner**: raw file has TWO different CTA Section blocks. Decision: use
  the two-card split version (dark form card + photo card) since it literally
  matches Guidelines.md's "CTA Section (split)" label — Left/dark card:
  heading `The foundation your enterprise needs. Start the conversation to
  find out how it's right for yours.`, email input placeholder `Email
  Address`, button `Submit`. Right/photo card: heading `When your data is
  secure, your business is unstoppable`, button `Contact Sales →`, background
  image `788bb905bb6769a224e32f3a48744d463d070606.png`. The OTHER raw CTA
  section (single centered card, button `Let's Talk`, true last element before
  footer) is dropped — log as an omission, flagged for design to confirm which
  is canonical.
- **FaqSection**: use `faq-accordion.tsx` as-is, including its own placeholder
  Q&A copy (`Question text here?` / `Answer text goes here.` × 6) — this is
  literally what exists in the source on both sides (hand-written component
  and raw generated file's FAQ heading `FAQ` / `Everything you need to know.`
  match). Log the placeholder Q&A copy as a content gap for real FAQ content.
- **SiteFooter**: real content exists in raw file. 4 columns:
  - **Platform**: Data Security Posture Management, Ransomware Protection,
    Cyber Recovery, Threat Analytics, Data Observability, Cloud Data Security,
    Microsoft 365 Security, Backup & Recovery
  - **Resources**: Blog, Case Studies, Webinars & Events, White Papers,
    Documentation, Community, Support Portal, Trust Center
  - **Solutions**: Healthcare, Financial Services, Government & Public Sector,
    Energy & Utilities, Retail & Manufacturing, Ransomware Recovery,
    Compliance & Governance, Business Continuity
  - **Company**: About Rubrik, Leadership Team, Careers, Partners &
    Integrations, Newsroom, Investor Relations, Contact Us, Security
    Disclosures
  - Copyright block: `© 2026 Rubrik, Inc.` + Privacy Policy / Cookie Settings /
    Terms of Use / Trust Center / Sitemap / Accessibility.
  - 3 social icons are bare grey circle placeholders with no icon/alt/href —
    log as a gap, render as decorative-only or omit hrefs.

Image assets: old repo's `ATTRIBUTIONS.md` confirms photos are Unsplash-licensed
(free to use) and shadcn/ui components are MIT — safe to copy the actual image
files (not code) into the new project's `src/assets/`.

Relevant source image files (in old repo's `src/imports/`, to copy over as
needed): `afab740d54a91fd17a67f3e76b18a14e267633c1.png` (hero bg),
`28e3da9661320bd1ff2a9070e053e05633e42f21.png` (stat card 1),
`39d24c3c0d492129660c1c80e8c674cede8a6995.png` (stat card 2),
`788bb905bb6769a224e32f3a48744d463d070606.png` (data-center photo, used in
PlatformSurfaces + CtaBanner), `7d4b7097ae5bbc5e4a914ed5fab026fad244baea.png`
(testimonial headshot, shared by all 4 carousel cards in the old repo).

## Build plan status — COMPLETE for this pass (Home page only)

- [x] Read Guidelines.md, theme.css, 5 hand-written components in full
- [x] Extract remaining Home-page copy from generated HomePage/index.tsx
- [x] Scaffold Vite + React + TS project (`npm create vite@latest . --
      --template react-ts`)
- [x] Design tokens (primitive + semantic CSS) + ASSUMPTIONS.md
- [x] Grid/layout primitives (Container, Grid/GridItem, breakpoints.ts)
- [x] Shared UI primitives (CtaButton ×4 variants ×3 sizes, FormInput, RubrikMark)
- [x] SiteHeader + HeroSection
- [x] PlatformIntro + StatCardGrid
- [x] PlatformSurfacesStacked (scroll-locked wheel/touch stacking, keyboard +
      dot-navigation added on top of the old behavior)
- [x] PlatformSurfacesTabbed (WAI-ARIA tabs pattern, roving tabindex)
- [x] TestimonialCarousel (hover + focus + click driven, keyboard-operable)
- [x] FaqSection (accordion, single-open, keyboard-operable)
- [x] CtaBanner + SiteFooter
- [x] Assemble Home page (`App.tsx`) + sitewide `useScrollReveal` hook
- [x] Type-check (`tsc -b`) and production build (`npm run build`) both clean
- [x] Functional verification via headless Chromium (Playwright, since
      `chromium-cli` wasn't available in this environment): desktop (1440px)
      and mobile (390px) screenshots, console/network error check (none),
      FAQ accordion open/close + keyboard (Tab+Enter) verified, tab-switch
      verified, PlatformSurfacesStacked dot-jump + counter + body-scroll-lock
      release verified, mobile menu toggle verified.
- [ ] Responsive QA at the tablet breakpoint specifically (768–1199px) not
      yet screenshotted — desktop and mobile both verified, tablet is the one
      tier not yet visually spot-checked.
- [ ] Real cross-browser spot-check (Safari/Firefox/real Edge) not done —
      relied on the modern-CSS baseline + Chromium verification per the
      brief's fallback allowance.
- [ ] Real font files, real FAQ content, real hero product screenshot, and
      the other content gaps in ASSUMPTIONS.md are still open — this was a
      structural/behavioral rewrite, not a content-completion pass.

## Round 2 fixes (2026-08-05, after user compared against the old site running live)

The user ran both sites side by side (old at :5174, new at :5173) and flagged
4 issues. All four were root-caused by direct comparison (Playwright
screenshots + DOM inspection of the old site) and fixed — see ASSUMPTIONS.md
entries #20–24 for full detail:

1. **"All animations are gone"** — root cause: `useScrollReveal` was only
   wired into 2 of 10 sections (PlatformIntro, StatCardGrid). The Hero
   entrance animation itself was actually working fine (verified via
   `getAnimations()` in a fresh page load). Fixed by wiring the hook into
   PlatformSurfaces (both variants), TestimonialCarousel (mobile cards only),
   FaqSection, and CtaBanner.
2. **"Hero is significantly different"** — root cause: (a) the hero's fine
   grid-line texture over the earth photo was missing entirely (recreated
   cleanly — the old site's own version is a broken Figma-export bug, a
   single line stretched via absurd `cqw`/`cqh` container-query units instead
   of tiling); (b) the headline was rendering at font-weight 500 instead of
   the documented 400 (Display/Hero is Regular per Guidelines.md, not
   Medium); (c) the AI search bar's leading sparkle icon (`RubrikAIIcon`) was
   missing — added back with its real SVG path.
3. **"Max width is 1440px for desktop"** — root cause: only the inner
   `Container` was capped at 1440px; section backgrounds (`width: 100%`)
   stretched full-bleed past it on wide viewports. Fixed with a single
   page-root wrapper (`App.module.css`) capping the whole app at 1440px,
   matching Guidelines.md's documented page width unconditionally (the old
   site's own Hero/Nav don't honor this — confirmed as a bug via a 1920px
   screenshot of the old site itself, not something to replicate).
4. **"Font on old site looks better"** — root cause: this rewrite's font
   fallback chain routed through `ui-sans-serif, system-ui` (→ San Francisco
   on macOS, a humanist typeface) before falling back, while the old site's
   inline styles hardcode literal `"FK Grotesk", sans-serif` bypassing any
   richer chain (→ generic `sans-serif` → Helvetica on macOS Chrome).
   Helvetica is a much closer stylistic match to FK Grotesk's actual
   grotesque-sans category than San Francisco. Fixed by pointing
   `--primitive-font-family-sans` straight at Helvetica Neue/Arial.

Verification: `tsc -b` clean, `npm run build` clean, re-screenshotted at
1920px (max-width cap confirmed: `.page` measures 1440px), 1440px (hero
close-up), and 390px (mobile regression check) — all clean, no console
errors. Full-page incremental-scroll test after the fixes: all 14
currently-visible `data-reveal` elements reached `is-revealed` (the other 16
are TestimonialCarousel's mobile-only cards, correctly inert at desktop width
since they're `display: none`).

Note on scroll-reveal verification: a naive full-page Playwright screenshot
(`fullPage: true`) showed PlatformIntro's and StatCardGrid's `data-reveal`
text as invisible — this turned out to be a screenshot-capture artifact
(Playwright's fullPage mode resizes the CDP viewport rather than performing
a real incremental scroll, so `IntersectionObserver` never fires for
below-the-fold content in that one-shot mode). A follow-up test that
actually scrolled the page in increments confirmed every `data-reveal`
element reaches `opacity: 1` / `is-revealed` correctly. Not a real bug —
noted here in case a future session sees the same artifact and wonders.
