import { Container } from "../../components/layout/Container/Container";
import styles from "./ComponentDetails.module.css";

interface ComponentRow {
  name: string;
  animation: string;
  references: string;
  recommendation: string;
  edsCompatible: string;
  edsCompatibleNote: string;
  edsCompatibleSteps?: string[];
  imageAspectRatio: string;
}

const COMPONENT_ROWS: ComponentRow[] = [
  {
    name: "Nav",
    animation:
      "Sticky header that compacts on scroll: bar height 83px to 64px plus a box-shadow fade-in, 220ms ease, once scrollY exceeds 8px. Search bar width transition (220ms) once the query grows past 30 characters.",
    references: "CtaButton, FormInput",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote:
      "Maps to the standard header/nav block; the compact-on-scroll and search-width transitions are plain CSS/vanilla JS, no external dependency.",
    imageAspectRatio: "Not applicable, no images (logo is an SVG).",
  },
  {
    name: "HeroSection",
    animation:
      "One-time fade-up on page load, staggered per element (0/180/360/560ms delay, 1200ms cubic-bezier(0.19,1,0.22,1)); continuous WebGL grid-mesh \"press\" effect (PressGrid, via the ogl package) layered over the background grid, active on both desktop and mobile.",
    references: "Container, CtaButton",
    recommendation:
      "WebGL grid effect is applied on both desktop and mobile, which the component's own code comment calls a deliberate tradeoff since mobile is the majority of this page's traffic. Still worth disabling on mobile: the extra JS and WebGL payload plus the GPU work above the fold is a real cost on touch devices, for an effect people are less likely to interact with there anyway. Desktop only is the safer default, with the existing static CSS grid kept as the mobile fallback the same way it already covers prefers-reduced-motion.",
    edsCompatible: "DEPT EDS skills are not capable of this",
    edsCompatibleNote:
      "This actually works fine on EDS itself. A decorate() function is just JavaScript, so it can open a canvas, grab a WebGL context, and run a render loop without any trouble, and ogl (a plain ES module) can be pulled in straight from a CDN with a dynamic import, no bundler needed. What the existing eds-build-block skill can't do is generate this automatically, because it builds a block's markup and JS from authored content rows, and this effect has no authorable content at all. Nobody ever fills in a row for it in a doc, so there's nothing for the automation to work from. Here's what a developer would need to do by hand to get it working:",
    edsCompatibleSteps: [
      "Build the base hero block the normal way through eds-build-block: headline, subtitle, CTA, background image. That part is ordinary authored content and the automation handles it fine.",
      "Add a small script that dynamically imports ogl from a CDN (something like esm.run/ogl) and sets up the canvas over the hero. Load it from the hero block's own decorate(), or from the project's scripts.js during the delayed loading phase.",
      "Gate it behind a prefers-reduced-motion check and skip it on mobile, matching the tradeoff flagged in the Recommendation column above.",
      "Keep the existing static CSS grid as the fallback for when WebGL is skipped or unavailable, the same way the current React version already handles it.",
      "Treat the whole thing as a hand-maintained enhancement layered on top of the hero block rather than part of its generated code. A developer needs to re-check it whenever the hero block changes, since the skill won't regenerate or touch it.",
    ],
    imageAspectRatio:
      "Background photo fills the section; height is content-driven, not a fixed ratio. Desktop about 1.29:1, tablet about 0.85:1, mobile about 0.43:1 (measured at 1440/768/375px widths).",
  },
  {
    name: "LogoStrip",
    animation:
      "Continuous auto-scrolling marquee (36s linear infinite, translateX 0 to -50%), paused on hover/focus. Falls back to the original static, manually-scrollable row under reduced motion.",
    references: "None",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "Pure CSS keyframe marquee with a reduced-motion fallback; no JS dependency at all.",
    imageAspectRatio: "Not applicable, vector marks only.",
  },
  {
    name: "PlatformIntro",
    animation: "Shared scroll-reveal on heading, body copy, and the 4 corner plus-marks (cascading stagger).",
    references: "Container",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "IntersectionObserver-based scroll-reveal is a standard, low-cost vanilla-JS pattern.",
    imageAspectRatio: "Not applicable, no images.",
  },
  {
    name: "StatCardGrid",
    animation:
      "Independent per-card count-up (0 to target, linear, 1400ms) triggered by each card's own IntersectionObserver; replays every time that card re-enters view. Shared scroll-reveal on captions.",
    references: "Container",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "Count-up and scroll-reveal are both plain IntersectionObserver + vanilla JS, no external dependency.",
    imageAspectRatio:
      "Tall card image: fixed 2.7:1 at every breakpoint (explicit CSS aspect-ratio). Wide card images: fluid, content-driven height. Desktop about 0.94:1, tablet about 0.65:1, mobile about 0.76:1.",
  },
  {
    name: "PlatformSurfacesStacked",
    animation:
      "Desktop: scroll/wheel/touch/keyboard-jacked card stack (transform 650ms cubic-bezier(0.33,1,0.68,1), opacity 1100ms ease-out per card), content fade+slide-in on activation (500ms ease, 150ms delay), nav-dot resize (400ms). Mobile/tablet and reduced motion fall back to a static stacked list with no scroll-jack. Shared scroll-reveal on heading.",
    references: "None",
    recommendation:
      "None. The scroll-jacked stack already limits itself to desktop only, falling back to a static list on mobile and tablet and under reduced motion, which is the right call for both performance and accessibility.",
    edsCompatible: "Yes",
    edsCompatibleNote:
      "More build effort than most rows here, but no structural blocker. The scroll, wheel, touch, and keyboard jacked interaction is custom vanilla JS with no external dependency, so it's buildable as a block, just a larger hand built one than the reuse-first Block Collection set.",
    imageAspectRatio:
      "Desktop only: image hidden below 1200px, so not shown on tablet or mobile. Width is fluid (viewport minus the 477px text panel) and height fills the viewport (100svh), so there is no stable ratio; source art should be wide and tolerate cropping on both axes.",
  },
  {
    name: "PlatformSurfacesTabbed",
    animation:
      "Tab background transition (300ms) on switch. Panel fade-in (400ms cubic-bezier(0.33,1,0.68,1)) on every tab switch, gated behind a one-time check for whether the section has scrolled into view yet, so the very first panel doesn't play and finish off-screen before the page has been scrolled to it. Shared scroll-reveal on heading, tab labels, and the panel stat box.",
    references: "None",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "Matches the standard tabs pattern already in the Block Collection.",
    imageAspectRatio:
      "Fixed panel height, fluid width. Desktop about 1.60:1 (540px tall), tablet about 2.63:1 (280px tall), mobile about 1.23:1 (280px tall).",
  },
  {
    name: "TestimonialCarousel",
    animation:
      "Desktop: hover/focus-expanding cards (flex-basis 350ms cubic-bezier(0.4,0,0.2,1), text fade 350ms with a 150ms delay). Mobile: swipeable one-card-per-slide via native CSS scroll-snap, with dot pagination (400ms resize). Shared scroll-reveal on mobile card text.",
    references: "None",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote:
      "The mobile swipeable view matches the standard carousel block; the desktop hover-expand treatment is plain CSS transitions, no external dependency.",
    imageAspectRatio:
      "Desktop (hidden on tablet/mobile): the visible crop window is about 0.45:1, but the photo itself is deliberately rendered at 420% width for a hover pan effect, so source art needs to be about 1.88:1 or wider to have real content to reveal. Tablet about 3.67:1 and mobile about 1.71:1 for the swipeable card photo (fixed 200px height, hidden on desktop).",
  },
  {
    name: "Teaser50",
    animation: "Shared scroll-reveal on the two card headings.",
    references: "CtaButton, FormInput",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "Static content plus a scroll-reveal; maps to a standard two-up CTA/columns block.",
    imageAspectRatio:
      "Fixed 352px card height, fluid width. Desktop about 1.90:1, tablet about 2.09:1, mobile about 0.97:1.",
  },
  {
    name: "FaqSection",
    animation:
      "Accordion open/close (max-height 320ms cubic-bezier(0.33,1,0.68,1), icon bar scale 250ms). Shared scroll-reveal on kicker and heading.",
    references: "None",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "Matches the standard accordion pattern already in the Block Collection.",
    imageAspectRatio: "Not applicable, no images.",
  },
  {
    name: "Teaser100",
    animation: "Shared scroll-reveal on the heading.",
    references: "CtaButton, FormInput",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "Static full-width banner plus a scroll-reveal; maps to a standard CTA/banner block.",
    imageAspectRatio:
      "Full-bleed background photo, fixed section height. Desktop about 2.66:1 (542px tall), tablet about 1.85:1, mobile about 0.90:1 (416px tall).",
  },
  {
    name: "SiteFooter",
    animation: "None",
    references: "None",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "Matches the standard footer block.",
    imageAspectRatio: "Not applicable, no images (mark is an SVG).",
  },
  {
    name: "CtaButton",
    animation: "Hover/focus color transition (200ms ease, background/text/border).",
    references: "None",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote:
      "A shared button styling pattern handled by aem-boilerplate's own decorateButtons() utility, not a block of its own.",
    imageAspectRatio: "Not applicable, no images.",
  },
  {
    name: "FormInput",
    animation: "None",
    references: "None",
    recommendation: "None.",
    edsCompatible: "Yes",
    edsCompatibleNote: "A shared form field, achievable in vanilla JS within a form block.",
    imageAspectRatio: "Not applicable, no images.",
  },
];

// Both hidden per request; data stays in COMPONENT_ROWS above so either can
// be switched back on without re-deriving anything. Column lettering in the
// note below is derived from these two flags rather than hardcoded, since
// with two independent optional columns a fixed "Column E"/"Column F" would
// silently go stale the moment only one of them is toggled.
const SHOW_EDS_COMPATIBLE = false;
const SHOW_IMAGE_ASPECT_RATIO = false;

const BASE_COLUMN_NOTES = [
  "component.",
  "animation applied.",
  "other components it references.",
  "recommendation, where one applies.",
];

const EDS_COMPATIBLE_NOTE =
  "whether adobe-eds-skills' eds-build-block can generate this as an EDS block automatically from a design spec, yes or no. It isn't a raw platform capability check, since EDS itself allows arbitrary JS, canvas and WebGL included. It's specifically about whether the component has authorable content for the automation to derive a block markup contract from.";

const IMAGE_ASPECT_RATIO_NOTE =
  "image aspect ratio needed at desktop, tablet, and mobile, measured at 1440px, 768px, and 375px viewport widths respectively.";

const COLUMN_NOTES = [
  ...BASE_COLUMN_NOTES,
  ...(SHOW_EDS_COMPATIBLE ? [EDS_COMPATIBLE_NOTE] : []),
  ...(SHOW_IMAGE_ASPECT_RATIO ? [IMAGE_ASPECT_RATIO_NOTE] : []),
];

export function ComponentDetails() {
  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Reference</p>
          <h1 className={styles.title}>Component Details</h1>
          <p className={styles.subtitle}>
            Every section and shared UI component in this build: the animation applied to each, and the other
            components it depends on.
          </p>
        </div>

        <section className={styles.section}>
          <p className={styles.sectionNote}>
            {COLUMN_NOTES.map((note, i) => `Column ${String.fromCharCode(65 + i)}: ${note}`).join(" ")}
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Animation applied</th>
                  <th>Other components referenced</th>
                  <th>Recommendation</th>
                  {SHOW_EDS_COMPATIBLE && <th>EDS automation compatible</th>}
                  {SHOW_IMAGE_ASPECT_RATIO && <th>Image aspect ratio (desktop / tablet / mobile)</th>}
                </tr>
              </thead>
              <tbody>
                {COMPONENT_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td className={styles.muted}>{row.animation}</td>
                    <td className={styles.muted}>{row.references}</td>
                    <td className={styles.muted}>{row.recommendation}</td>
                    {SHOW_EDS_COMPATIBLE && (
                      <td className={styles.muted}>
                        <span className={row.edsCompatible === "Yes" ? styles.edsYes : styles.edsNo}>
                          {row.edsCompatible}
                        </span>
                        {": "}
                        {row.edsCompatibleNote}
                        {row.edsCompatibleSteps && (
                          <ol className={styles.stepsList}>
                            {row.edsCompatibleSteps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        )}
                      </td>
                    )}
                    {SHOW_IMAGE_ASPECT_RATIO && <td className={styles.muted}>{row.imageAspectRatio}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
    </div>
  );
}
