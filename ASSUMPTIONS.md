# Assumptions & gaps log

Every value or content decision below is either undocumented in the old repo's
`guidelines/Guidelines.md`, or a build-time judgment call made in its absence.
None of these are invented as final/confirmed — flag to design/content owners
before shipping. Organized to match `guidelines/Guidelines.md`'s own "Known
gaps" section plus build-specific gaps discovered while assembling the Home
page.

## Carried over from Guidelines.md's own "Known gaps"

1. **No error/destructive color documented.** Ported the old repo's
   placeholder red (`--primitive-color-destructive: #d4183d`) as-is. Get a
   real value from design before shipping any error/validation state.
2. **No dark-mode spec.** Only the occasional dark *section* pairing
   (Surface/Dark `#12201f` + Text/On Dark `#ffffff`) is documented — there's
   no site-wide dark theme. Not built; not needed for anything in this pass.
3. **Fonts aren't loaded.** FK Grotesk, FK Grotesk Mono, and Tiempos Text are
   referenced by name in `primitives.css` (`--primitive-font-family-*`) with
   system-font fallbacks (`ui-sans-serif`/`ui-monospace`/`Georgia`), per the
   user's own decision to ship with fallbacks now. Real font files/license
   needed before type renders as intended — swap by adding `@font-face` rules
   and nothing else needs to change, since every component reads the family
   custom properties rather than hardcoding a font name.
4. **Secondary CTA button border color** isn't given an exact hex in the
   source — used Deep Teal (`--primitive-color-deep-teal`) per Guidelines.md's
   own inference note (`--semantic-color-border-cta-secondary`).
5. **Gradient angle** for the Teal→Yellow decorative gradient
   (`--primitive-color-gradient-teal`/`-yellow` in `primitives.css`) isn't
   specified anywhere. Tokens exist but nothing in this build currently
   consumes them (no gradient-bearing decorative element was built this
   pass) — set a real angle before using them.
6. **Near-duplicate warm-beige surfaces** kept distinct per source rather than
   merged: Surface/Warm White `#faf5f1` (PlatformIntro, FaqSection
   background), FAQ item `#fae4e0`/`#f3efeb` (FaqSection per-item background,
   see #9 below), Banner `#f4ede8` (token defined, unused — no component in
   this pass needed the literal Banner surface). Flag to design whether these
   should consolidate to one token.
7. **FAQ transition duration/easing** isn't documented in Guidelines.md at
   all — only the old repo's hand-written `faq-accordion.tsx` specifies
   320ms/`cubic-bezier(0.33,1,0.68,1)` for the height animation and 250ms for
   the icon transform. Ported those exact values since the component is the
   best behavioral reference, but flagged here since Guidelines.md itself is
   silent on it.

## Build-specific gaps (this rewrite)

8. **Grid tablet column count & breakpoints** — not documented anywhere.
   Used the brief's recommended 8-column tablet (`--primitive-grid-columns-tablet`)
   and breakpoints mobile <768px / tablet 768–1199px / desktop ≥1200px
   (`src/lib/breakpoints.ts`), confirmed with the user. The old repo's
   hand-written components used a 992px cutoff for their own desktop/mobile
   JS checks — reimplemented against the new project's shared 1200px desktop
   breakpoint instead, so the "desktop" layout in this rewrite kicks in
   slightly later (1200px) than the old repo's equivalent components (992px).
   Confirm this reconciliation is acceptable, or adjust the shared breakpoint.
9. **FAQ accordion per-item surface color** (`#fae4e0` → `#f3efeb`, "warm
   beige shift") is documented in Guidelines.md §3 but the hand-written
   `faq-accordion.tsx` component never actually uses it (its section
   background stays Warm White throughout, only text/divider colors shift on
   open). This rewrite applies the documented per-item background shift on
   top of the component's structure (tokens: `--semantic-color-bg-surface-faq-item`
   / `-faq-item-clicked`) — a design call reconciling the mismatch, not a
   confirmed value. Flag to design.
10. **Ad hoc colors in hand-written components not in Guidelines.md's
    documented palette** — mapped to the nearest documented primitive rather
    than introducing new undocumented tokens:
    - `#00EEDB` (active tab background in `tabbed-surfaces-section.tsx`) →
      mapped to Teal Light `#00d5c3`.
    - `#097D85` (arrow icon / "Explore →" link color) → mapped to Deep Teal
      `#144f53` (the documented safe-for-text brand teal).
    (A third instance, `#00C58A` on a reviewer-initial avatar badge, no
    longer applies — that badge was removed from `PlatformSurfacesTabbed` per
    the user's request; it was a hardcoded placeholder "J" with no real
    reviewer data behind it.)
11. **Nav has no AI Search bar in the raw generated source**, despite
    Guidelines.md's component inventory listing "AI Search bar" as a 2-state
    Nav variant. Only the Hero has a search bar in the actual generated file.
    Built the search bar in Hero only; Nav ships without one. Confirm whether
    the Nav-level search toggle is a real requirement that was never
    materialized in the Figma export, or should be dropped from the
    component inventory.
12. **Hero's product-screenshot slot is empty in the source** — an unfilled
    571px-tall dark rounded rectangle with no image or content. Rendered as-is
    (`.mediaPlaceholder` in `HeroSection.module.css`), `aria-hidden`, no real
    asset. Needs a real product screenshot/video before shipping.
13. ~~**"Trusted by" logo strip** ... Omitted from this rewrite.~~ **Correction
    (see #33): this assumption was wrong.** The marks are real, identifiable
    company logos (Adobe, Carhartt, Iron Mountain, Pepsi, a circular
    certification seal), not abstract placeholder shapes — added back per
    user request. Left here so the reasoning trail (and the correction) is
    visible.
14. **Stat Cards**: the raw source has 5 card slots but 3 are unfinished/
    duplicated Figma placeholder content (repeated caption, wrong chip
    labels, truncated heading text reused from the intro section). Built only
    the 2 real ones (42% / 21%), matching Guidelines.md's own page-composition
    note. The dropped 3 carried no real content to preserve.
15. **Second "Desktop Section" (after Testimonial) and second
    "Heading/Subheading intro" (before FAQ)** — both appear in Guidelines.md's
    page-composition table for Home but have no corresponding content
    anywhere in the raw generated source (grepped, zero matches beyond the
    one real instance of each). Omitted rather than invented; only one
    PlatformIntro instance and no second feature section were built.
16. **Two different "CTA Section" blocks exist in the raw source** with
    different copy/button labels (`Submit` mid-page split-card version vs.
    `Let's Talk` single-centered-card version at the true end of the page).
    Built the split two-card version as `CtaBanner` since it structurally
    matches Guidelines.md's "CTA Section (split)" label. The other variant
    (single centered card, `Let's Talk` button) was dropped — confirm which
    is canonical with design.
17. **FAQ content is entirely placeholder** — the source has six identical
    "Question text here?" / "Answer text goes here." entries with no real
    content anywhere (`src/data/faq.ts`). Needs real FAQ copy before shipping.
18. **Footer social icons** are bare grey circle placeholders in the source
    with no icon glyph, alt text, or href for any platform. Rendered as inert
    decorative circles (`aria-hidden`), not links. Needs real social links/
    icons before shipping.
19. **`data-center.png` source asset is 26MB** (uncompressed PNG). Copied
    as-is from the old repo for now — needs compression/resizing (WebP/AVIF,
    responsive `srcset`) before production; flagging rather than blocking the
    rewrite on image optimization tooling.
20. **Hero's fine grid-line texture over the earth photo is a clean
    recreation, not a port.** The old repo's version of this is a genuine
    rendering bug in the Figma Make export: a "repeat grid" exported as a
    single line stretched via absurd container-query units (e.g.
    `w-[93214300cqw]`, `h-[2331450cqh]`) that smears one line across the
    section instead of tiling, producing the striped/smeared look visible in
    the old site. `HeroSection.module.css`'s `.backgroundGrid` recreates the
    apparent intent (a subtle technical/data grid overlay) with a clean
    `repeating-linear-gradient`, at a judgment-call 44px cell size and 16%
    opacity — the real spacing is unrecoverable from the broken export.
21. **Font fallback stack changed from the initial pass.** Neither the old
    repo nor this rewrite has real font files loaded — both fall back to
    system fonts. But the old repo's individual elements hardcode literal
    `"FK Grotesk", sans-serif"` inline (bypassing any richer fallback chain),
    which resolves to the browser's generic `sans-serif` mapping (Helvetica
    on macOS Chrome). This rewrite's first pass instead routed through
    `ui-sans-serif, system-ui` before falling back, landing on San Francisco —
    a humanist font, stylistically wrong for a "Grotesk" (grotesque-style)
    typeface like Helvetica/Arial/Univers. `--primitive-font-family-sans` now
    goes straight to `"Helvetica Neue", Helvetica, Arial, sans-serif`, which
    both matches the old site's incidental rendering and is a closer
    style-category match to the real FK Grotesk. Still a fallback, not the
    real typeface — see gap #3.
22. **Hero headline was rendering at the wrong weight in the first pass** —
    used the Heading-1 token's weight (500/Medium) instead of Display/Hero's
    documented weight (400/Regular per Guidelines.md's type scale table).
    Fixed in `HeroSection.module.css`.
23. **Sitewide scroll-reveal was under-wired in the first pass** — only
    `PlatformIntro` and `StatCardGrid` had `useScrollReveal`/`data-reveal`
    applied, so most of the page had no entrance animation (the old repo's
    `initScrollReveal()` swept nearly every `<p>` sitewide except
    Hero/Nav/stacking-card-content). Now also wired into: PlatformSurfaces
    (both variants') section headings, TestimonialCarousel's mobile card text
    (desktop cards intentionally excluded — they already animate via
    hover/focus state), FaqSection's intro kicker/heading, and CtaBanner's two
    card headings.
24. **Whole page now capped at 1440px**, not just inner content. The old
    repo's hand-written components each wrap themselves in
    `maxWidth:1440/margin:auto` individually; the Figma-generated Hero/Nav
    don't (they use `w-full`, stretching full-bleed past 1440px on wide
    viewports — visibly confirmed as a bug in the old site itself at
    1920px). Guidelines.md documents 1440px as the standard page width
    unconditionally, so this rewrite applies the cap once at the App root
    (`App.module.css`), covering every section uniformly rather than
    replicating the old repo's inconsistency.
25. **Round-3 font fix: "Helvetica Neue" was a real bug, not a stylistic
    choice.** Round 2's fallback (`"FK Grotesk", "Helvetica Neue", Helvetica,
    Arial, sans-serif`) was wrong: on this macOS test system, "Helvetica
    Neue" measured as a genuinely different font from plain Helvetica (681.6px
    vs 671.5px rendered width for the same string) — not an alias. The old
    repo's own fallback skips straight from `"FK Grotesk:Regular"` to the bare
    `sans-serif` keyword, which resolves to plain Helvetica (671.5px, matches
    generic `sans-serif`/`Helvetica`/`Arial` exactly on this system). Naming
    "Helvetica Neue" explicitly ahead of the others silently substituted a
    different typeface. Fixed: `--primitive-font-family-sans` is now `"FK
    Grotesk", Helvetica, Arial, sans-serif` (no Helvetica Neue) — verified via
    `getBoundingClientRect()` width measurement to render byte-for-byte
    identically to the old repo's fallback chain on this system.
26. **Font-smoothing/text-rendering CSS removed.** `reset.css` had
    `-webkit-font-smoothing: antialiased` and `text-rendering:
    optimizeLegibility` on `body` — the old repo sets neither (computed value
    `auto`/`auto` everywhere). `-webkit-font-smoothing: antialiased` visibly
    thins text on WebKit/Blink; removed to match the old site's untouched
    browser defaults exactly, since round 2 still read as font-mismatched
    even after the family fix.
27. **Hero grid-line texture, re-measured empirically.** Round 2's grid
    (44px cells, single dark line color, `inset: 0`) was a rough guess. Since
    the source markup for this pattern is too mangled by the `cqw`/`cqh` bug
    to read real values from (see gap #20), this round instead extracted the
    actual rendered geometry from the old site's live DOM: every grid line's
    `getBoundingClientRect()` plus computed stroke/opacity, ~1,059 elements
    total. Findings: 61px grid cell size (both axes); two overlaid line
    colors — white lines (no explicit stroke-opacity, ~31% effective given
    the parent's `opacity-31` class) and dark `#12201F` lines (`stroke-
    opacity: 0.27` × parent 0.31 ≈ 8.4% effective); a real ~2.7%
    left/right / ~3.5% top inset from the Hero's edges (the individual
    lines' own absolute positions consistently start there, even though the
    intermediate "Group" wrapper divs carrying those same percentages in
    their class names are `display: contents` and don't actually clip
    anything — Figma's flattened export left the correct numbers on dead
    wrapper elements instead of the real ones). `HeroSection.module.css`'s
    `.backgroundGrid` now uses these measured values. Confirmed rendering via
    a cropped screenshot of a clean region of the background — the lines are
    real but intentionally subtle at these opacities, not bold.
28. **Grid rendering technique swapped for reliability.** The measured values
    above were initially implemented as four `repeating-linear-gradient`
    layers with 1px hard color-stops. That renders correctly in principle,
    but 1px hard-stops inside a *repeating* gradient are prone to sub-pixel
    antialiasing artifacts that vary by zoom level/display density — the
    gradient function is recomputed continuously across the whole element
    rather than tiling a fixed raster, so precision error compounds and can
    smear a line to near-invisibility on some displays even though computed
    styles/DOM inspection show it "working." Switched to the standard crisp-
    hairline-grid technique instead: four plain `linear-gradient`s (not
    repeating) combined with `background-size: 61px 61px` to tile — this
    renders far more consistently. Line opacities were also bumped up
    (white 31%→45%, dark 8.4%→14%) since the original measured values,
    combined with the rendering fragility above, were reportedly invisible
    in a real browser despite showing up in cropped test screenshots.
29. **PlatformSurfaces decorative Figma vector assets not reproduced** — the
    old `stacking-cards-section.tsx` used an SVG blob-mask around its photo
    panel plus a separate decorative drop-shadowed shape overlay
    (`imgRubrikBackgroundNyc34`, `svgPaths.p5acfd00`), both purely decorative
    Figma-exported vector paths. Simplified to a plain rounded-corner photo
    panel in both `PlatformSurfacesStacked` and `PlatformSurfacesTabbed` for
    this rewrite — a deliberate simplification (per the brief's own guidance
    not to port Figma-generated structure verbatim), not a data gap. Revisit
    if the blob-mask treatment turns out to be load-bearing for the brand
    look.
30. **Hero grid line/intersection weight bumped again.** Round 3's fix
    (linear-gradient tiling, 45%/14% opacity) was confirmed rendering, but
    reported as still too subtle in a real browser, particularly at
    intersections. Bumped line hard-stop width 1px→2px and opacity to
    60%/22%, and added a `::after` radial-gradient dot layer at the same 61px
    pitch so each crossing point reads as a distinct node — a 2px line
    crossing a 2px line only overlaps in a 2×2px square, which doesn't read
    as visibly heavier than the lines themselves at this scale without an
    explicit dot.
31. **"Tiempos Text" fallback corrected from `serif`/Georgia to `sans-serif`.**
    `--primitive-font-family-serif` (used for all "narrative" body text —
    captions, descriptions, testimonial quotes) was `"Tiempos Text", Georgia,
    "Times New Roman", serif`, a reasonable-looking but wrong guess. Every one
    of the old repo's ~36 literal `font-family: "Tiempos Text", sans-serif`
    declarations — across all 5 hand-written components and the generated
    HomePage file, with no exceptions — uses the generic `sans-serif` keyword,
    never `serif`. Since Tiempos Text isn't loaded anywhere, this is a
    consistent, deliberate fallback convention to match, not a typo: narrative
    text renders in the same sans fallback as everything else, not Georgia.
    Fixed to `"Tiempos Text", sans-serif`; verified identical computed
    `font-family` and pixel width to the old site for the same string.
32. **StatCardGrid rebuilt: correct visual style + all 5 card slots.** Two
    issues found comparing against the live old site. (1) Visual style was
    wrong — built as a photo with a gradient text overlay, but the real
    design is a photo on top (or left, for "wide" cards) with a *separate*
    solid `#f7f7f7` content block below/beside it, containing a square
    bordered chip (no border-radius, no pill shape) and a dark-on-light stat
    + caption, not light-on-dark over a photo. (2) Card count was wrong —
    the live old site's raw generated file (rendered as-is by the old
    `App.tsx`, unlike the 5 sections with dedicated hand-written components)
    has 5 stat-card slots in a 2-column masonry (left: 1 tall + 1 wide, right:
    3 wide), not 2. Only 2 of those 5 have real, non-broken content (42%
    AI / 21% SaaS, both already in Guidelines.md's own page-composition
    note); the other 3 reuse a duplicate caption ("E2E Resilience for M365")
    with a wrong stat, or reuse the truncated intro heading text as a fake
    stat value — confirmed a genuine content bug in the source, not a design
    intent to replicate verbatim. Per user decision, rebuilt to the full
    5-card layout (visual parity with the live source) but authored real,
    non-duplicate copy for the 3 extra cards, themed after the same
    categories PlatformSurfaces already uses (Cyber Resilience 90% faster
    ransomware recovery, Threat Detection 65% fewer undetected threats,
    Compliance 3x faster audit readiness) instead of copying the broken
    placeholder text. All 5 cards reuse the same 2 source photos (AI card's
    own photo for the tall card, the SaaS card's photo repeated across all 4
    wide cards) — matching the source's own reuse pattern rather than
    sourcing new photography.
33. **Hero grid intersections: dot layer removed, was a wrong fix.** #30's
    dot overlay (a `::after` radial-gradient at each 61px crossing) was
    reported as rendering round dots, not the crossed "+" shape visible on
    the live old site. Root cause: two perpendicular hairlines crossing
    *already* form a plus-shape on their own — no separate marker needed. The
    dot layer didn't enhance that, it replaced it with a filled circle.
    Removed; the crossing now comes from the existing horizontal/vertical
    gradient layers alone, same as the source.
34. **"Trusted by" logo strip restored — and item #13 above was wrong.**
    Investigated the actual vector path data behind `Frame70`'s 15 icon
    slots (extracted from the old repo's `svg-fhzbqb0r2z.ts` path constants)
    to rebuild it, since the user asked for it back. These are **not**
    abstract placeholder shapes — they render as real, identifiable company
    logos: Adobe, Carhartt, Iron Mountain, Pepsi, and a circular
    certification-style seal, repeated 3× across the strip (the source
    triples the same 5-logo sequence with distinct-but-visually-identical
    path constants per copy, statically — no scroll/marquee animation in the
    source, so none was added here either). Rebuilt as `LogoStrip` +
    `src/data/logoMarks.ts`/`logoMarkPaths.ts` (raw path data extracted
    verbatim), placed directly after Hero. **Flagging for the user:** since
    these are real third-party trademarks presented in a "trusted by"/
    customer-logo context, confirm this usage is authorized before this
    project is shared or shipped anywhere beyond internal comparison against
    the old prototype — I've matched the existing old-repo source as asked,
    but authorization to display these specific marks is a business/legal
    call, not a rebuild decision.
35. **Hero grid: root cause finally confirmed — it's the source's own bug,
    not a texture, and 3 rounds of measurement missed that.** Traced the
    actual component structure: 509 tiny "+" tick-mark components (a short
    vertical + short horizontal stroke per intersection — ~12px arms,
    ~1.9px thick, `#12201F` at ~8.4% effective opacity), each positioned via
    a zero-width Figma-exported anchor `div` with `container-type: size`,
    then a child sized in `cqw`/`cqh` relative to that zero-size box.
    Querying container units against a zero-size container is undefined;
    Chromium's fallback resolves it to garbage (`w-[93214300cqw]`). Measured
    live via `getBoundingClientRect`: 463 of the Hero's 1,061 grid-line
    elements render as thousand-plus-pixel rectangles (one measured
    14,564px wide at x=-6624), clipped by the Hero's `overflow: hidden` into
    what looks like solid dark bars slicing through the headline — confirmed
    against a fresh live screenshot of the old site, which shows exactly
    that. This is why the previous 3 rounds (#20, #27, #28, #30, #33) never
    converged: each treated it as a subtle-hairline-grid tuning problem
    (thickness/opacity/technique) when the actual live target was a
    bug-damaged checkerboard, and the "empirical measurement" behind #27 was
    itself wrong on two counts — it concluded continuous lines (not
    isolated ticks) and a second "white" line color that doesn't exist
    anywhere in the source (every one of the 509 tick components uses the
    same single dark color; "opacity-31" is a Tailwind opacity utility on
    the dark-colored element, not evidence of a separate white layer).
    Per user decision, rebuilt as the evident pre-bug intent — small
    isolated crosshair ticks with visible gaps between them, not connected
    lines — via a tiled inline SVG (`background-image: url("data:image/
    svg+xml,...")`, 61px tile, two 2px×12px rects forming a "+"), since a
    plain `linear-gradient` can't produce an isolated 2D mark, only
    full-length lines. Explicitly NOT reproducing the bug itself (thick bars
    over the headline) — see the "Reproduce the bug exactly" option this was
    weighed against.
36. **Nav rebuilt: two anchored groups, not one evenly-distributed row.**
    Source's `Nav` is `justify-between` with exactly 2 children —
    `Frame53` (logo + primary links: Products/Solutions/Knowledge Hub/About
    Us) and `Frame52` (secondary links: Zero Labs/CXO/Partners/Support + the
    CTA button) — which pins them to opposite ends with a large empty gap
    between. My version had 3 top-level children (logo, all-links, actions),
    which `justify-between` centers the middle one instead of leaving a gap.
    Restructured `SiteHeader.tsx` into `.primaryGroup`/`.secondaryGroup` to
    match.
37. **Logo: wordmark is a traced vector logotype, not text.** The source's
    header logo (`Group485`) is a single SVG combining the icon mark and the
    lowercase "rubrik" wordmark as two vector paths — a bespoke traced
    logotype, not the word "Rubrik" set in a font. My version rendered
    `RubrikMark` (icon only) next to HTML text "Rubrik" (capitalized, wrong
    font) as a stand-in. Extracted both paths (`pd54f7c0` symbol,
    `p32934080` wordmark) from `svg-fhzbqb0r2z.ts` into a new
    `RubrikLogotype` component (`viewBox 0 0 118.555 35.5869`), used only in
    `SiteHeader` — `RubrikMark` (icon-only) is kept as-is for
    `TestimonialCarousel`'s separate badge usage.
38. **CTA button "dark" variant: Guidelines.md's documented spec doesn't
    match any real instance.** Guidelines.md §4 says the Dark CTA variant
    uses "sharp corners" for editorial sections. Checked every actual `CTA
    Button` in the source (Nav's "Contact Sales", Hero's "Submit"/"Let's
    Talk" form buttons) — all 6 instances found are fully pill-shaped
    (`rounded-[100px]`), none are sharp-cornered, regardless of context.
    The documented guideline doesn't correspond to any shipped instance.
    Changed `.dark` in `CtaButton.module.css` from `border-radius: 0` to
    `var(--primitive-radius-full)` to match the live source rather than the
    written spec — consistent with how every other documentation-vs-source
    conflict in this project has been resolved (font fallback, hero
    max-width, button reset).
39. **"Rubrik.com Development Guardrails for Design" doc (2026-08-06):
    reconciled against 3 existing decisions, all kept as-is per the user.**
    The user shared a general company/agency grid+guidelines doc partway
    through this project. Checked it against what's already built:
    - **Font ("Inter only")**: kept FK Grotesk/Tiempos Text/FK Grotesk Mono.
      Treated the guardrail as a generic fallback for projects without
      established brand type — this project's typography matches the real
      Rubrik reference site's own `theme.css` and hand-written components,
      not a guess.
    - **Desktop grid (guardrails: 1480px/12-col/15px gutter+margin, vs.
      built: 1440px/64px margins/24px gap)**: kept the existing 1440px/64px
      values, since those were verified against the live old site's actual
      rendered layout (see #14 "why is this not 1440px" resolution), not
      derived from a generic spec. A literal 15px desktop margin would look
      cramped for this design. The guardrails doc also specifies no tablet
      breakpoint at all, so the existing 8-column tablet decision (locked in
      with the user at project start) is unaffected either way.
    - **Scroll-jack (guardrails explicitly discourage combining scroll-jack
      + sticky behavior — exactly what `PlatformSurfacesStacked` does)**:
      kept both `PlatformSurfacesStacked` and `PlatformSurfacesTabbed` on
      the page for now, per the original "build both for comparison"
      decision. Flagged as a real signal toward eventually dropping the
      Stacked variant, but not acted on yet — a product decision, not a
      bug fix.
    Revisit any of these if the guardrails doc turns out to carry more
    authority (e.g. an explicit stakeholder mandate) than assumed here.
40. **Nav sizing/spacing corrected via direct measurement.** #36/#37 fixed
    the nav's *structure* (2 groups, real logotype) but left several exact
    values off: logo measured 110×33px vs source's 118.55×35.58px; the whole
    header used the shared 64px page margin (`Container`) instead of the
    source's own fixed 24px nav padding at every breakpoint; nav height was
    73px vs source's 83px; inter-item gaps used 24-32px tokens vs source's
    uniform 16px; and the CTA button used the `medium` size (14px sans,
    12/20 padding) instead of `small` (12px mono uppercase, 10/20 padding,
    full pill) — the latter is what the Nav's actual "CONTACT SALES" button
    matches. Header no longer wraps in the shared `Container` — it has its
    own fixed-24px-padding, fixed-83px-height wrapper, since its spacing
    contract is genuinely different from the rest of the page, not a
    breakpoint variant of it. Re-measured after the fix: logo position/size
    and first-link position now match the source to sub-pixel precision.
41. **Hero grid: added continuous connecting lines back, on top of the
    crosshair ticks.** #35 built isolated "+" ticks with real gaps (the
    evident pre-bug intent, per source structure) and the user picked that
    over reproducing the bug — but seeing it live, isolated plus-signs with
    large gaps didn't read as "a grid" at all. Added a second background
    layer: continuous 1.5px hairlines at the same 61px pitch and opacity
    (0.084) as the crosshair ticks, offset by half a tile
    (`background-position: 30.5px 30.5px`) so the lines' crossings land
    exactly on the crosshair centers rather than the tile corners. Now reads
    as an actual connected grid with slightly reinforced intersections
    (from the two semi-transparent layers overlapping at each crossing),
    rather than either floating ticks or the bug's solid bars.
42. **CTA button radius is a SIZE property, not a variant one — #38's fix
    was incomplete.** #38 made the `dark` variant always pill-shaped, based
    on checking only small (~33-37px-tall) dark buttons (Nav, small
    form-embedded "Submit"/"Let's Talk"). Checked more instances after a
    further report: Hero's large Primary CTA ("Watch Demo Now", `#144f53`,
    47px tall) and its large Secondary CTA ("Explore Rubrik's Platform",
    white/outlined) are both **sharp-cornered** (`border-radius: 0` in the
    literal source), as is CtaBanner's white "Contact Sales" button (65px
    tall). So color/variant doesn't determine radius at all — every
    ~33-37px button is a full pill regardless of color, every ~46-65px
    button is sharp regardless of color. Guidelines.md's "sharp corners"
    (under the Dark row) and "full pill" (under the Small row) notes were
    each describing the same single axis from a different variant's
    example, not two independent rules. Fixed: `.large`/`.medium` in
    `CtaButton.module.css` now use `border-radius: 0` (were
    `var(--primitive-radius-lg)`, 10px); removed the `.dark`-specific pill
    override from #38 entirely, since `.small` alone already produces the
    correct pill shape for any size/variant combination.
43. **Button text weight was bold (700), should be medium (500).**
    `--semantic-text-ui-button-weight` mapped to
    `--primitive-font-weight-bold`, but every CTA button's text in the
    source is literally `"FK Grotesk(:Mono):Medium"` — weight 500. Fixed
    the semantic token to map to `--primitive-font-weight-medium`; verified
    via computed style (500) and a visual diff against the source's Hero
    CTAs, which now match padding/radius/weight exactly.
44. **Nav CTA button font fallback: `sans-serif`, not `monospace` — but only
    for this one instance.** The Nav's "Contact Sales" button comes from the
    raw generated file, where every one of its ~10 "FK Grotesk Mono"
    declarations falls back to the generic `sans-serif` keyword — the same
    convention already found for "Tiempos Text" (#31). But this doesn't
    hold project-wide the way Tiempos Text did: the 5 hand-written
    components (FaqSection, TestimonialCarousel/ExpandableCardCarousel,
    PlatformSurfacesStacked/Tabbed) all use literal inline
    `fontFamily: "'FK Grotesk Mono', monospace"` — the correct fallback for
    an actual mono font. So the raw file and the hand-written components
    disagree on this one detail. Rather than changing the shared
    `--primitive-font-family-mono` primitive (which would incorrectly flip
    the hand-written components' fallback too), added a scoped
    `.navCta` override in `SiteHeader.module.css` that applies only to this
    button, via `CtaButton`'s existing `className` passthrough. Verified via
    computed style: `"FK Grotesk Mono", sans-serif`, matching the source.
45. **PlatformSurfacesTabbed: scroll-reveal only covered the 2 heading
    lines, missing the rest.** The old site's global `initScrollReveal()`
    sweep applies to *every* `<p>` on the page except ones inside Hero/Nav/
    Stacking-Card-Content — and `TabbedSurfacesSection` isn't excluded, so
    every text element in it (tab category labels, panel title, description,
    each feature bullet, stat value, stat label) gets the fade+slide-up
    treatment on first scroll into view, not just the section heading. Added
    `data-reveal` to all of those. Panel content remounts on every tab
    switch (`key={active}`) and isn't re-observed by `useScrollReveal`
    (which only runs once, on mount) — same limitation the old site's
    one-shot sweep has for this component — but that's fine, since
    `.panelWrap`'s own `tabPanelFadeIn` keyframe animation already covers
    the transition on every tab switch regardless. Verified via a real
    incremental-scroll test: all 14 `data-reveal` elements in this section
    reach `opacity: 1` / `.is-revealed` after scrolling into view.
46. **Hero grid light sweep — new decorative addition, not from the source.**
    Added a diagonal "light" animation to `.backgroundGrid`: a bright-white
    copy of the same grid pattern, revealed only through a moving diagonal
    band (a CSS `mask-image`, not an actual light/glow filter) so the
    intersections appear to catch light as it passes top-left to
    bottom-right, then loops. Implementation notes for future reference:
    - `mask-position` percentages behave counterintuitively once
      `mask-size` exceeds 100% (the offset is relative to the oversized
      canvas, not the element) — switched to fixed pixel values throughout
      to keep the "band screen position = internal offset + mask-position"
      math simple and predictable.
    - First attempt used a fast, narrow band (~130px transition, full
      traverse in under 1s) — invisible in practice; a band that thin only
      dwells on any fixed point for ~0.15s. Widened and slowed
      (~120px transition, ~5.4s crossing within a 9s loop) so it reads as a
      slow-dawning glow.
    - A too-wide band, combined with the Hero's wide-but-short aspect ratio,
      can make the diagonal read as a broad wash rather than a line —
      narrowed back down after spotting this.
    - Verified with the Web Animations API (`animation.currentTime = …`)
      rather than wall-clock `waitForTimeout`, since real-time screenshot
      sampling kept missing the (correctly) narrow band between samples.
    - Respects `prefers-reduced-motion` (animation and pseudo-element both
      disabled via `content: none`), consistent with every other animation
      in this project.
47. **Scroll-reveal tuned to feel gradual, not a "splash."** Per feedback
    that elements appearing on scroll felt sudden. Changes to the shared
    `scroll-reveal.css` primitive and `useScrollReveal.ts` (site-wide,
    affects every section using the hook): transition duration 650ms→1100ms,
    initial `translateY` offset 16px→28px, per-element stagger
    100ms→160ms, and the `IntersectionObserver` now triggers slightly
    earlier (`threshold` 0.15→0.1, `rootMargin` bottom -10%→-5%) so the
    transition has more of its run visible while still scrolling into view
    rather than mostly finishing off-screen.
