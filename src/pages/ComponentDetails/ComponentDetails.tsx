import { Container } from "../../components/layout/Container/Container";
import styles from "./ComponentDetails.module.css";

interface ComponentRow {
  name: string;
  animation: string;
  references: string;
  imageAspectRatio: string;
}

const COMPONENT_ROWS: ComponentRow[] = [
  {
    name: "Nav",
    animation:
      "Sticky header that compacts on scroll: bar height 83px to 64px plus a box-shadow fade-in, 220ms ease, once scrollY exceeds 8px. Search bar width transition (220ms) once the query grows past 30 characters.",
    references: "CtaButton, FormInput",
    imageAspectRatio: "Not applicable, no images (logo is an SVG).",
  },
  {
    name: "HeroSection",
    animation:
      "One-time fade-up on page load, staggered per element (0/180/360/560ms delay, 1200ms cubic-bezier(0.19,1,0.22,1)); continuous diagonal light sweep masked across the background grid overlay (8s linear infinite).",
    references: "Container, CtaButton",
    imageAspectRatio:
      "Background photo fills the section; height is content-driven, not a fixed ratio. Desktop about 1.29:1, tablet about 0.85:1, mobile about 0.43:1 (measured at 1440/768/375px widths).",
  },
  {
    name: "LogoStrip",
    animation:
      "Continuous auto-scrolling marquee (36s linear infinite, translateX 0 to -50%), paused on hover/focus. Falls back to the original static, manually-scrollable row under reduced motion.",
    references: "None",
    imageAspectRatio: "Not applicable, vector marks only.",
  },
  {
    name: "PlatformIntro",
    animation: "Shared scroll-reveal on heading, body copy, and the 4 corner plus-marks (cascading stagger).",
    references: "Container",
    imageAspectRatio: "Not applicable, no images.",
  },
  {
    name: "StatCardGrid",
    animation:
      "Independent per-card count-up (0 to target, linear, 1400ms) triggered by each card's own IntersectionObserver; replays every time that card re-enters view. Shared scroll-reveal on captions.",
    references: "Container",
    imageAspectRatio:
      "Tall card image: fixed 2.7:1 at every breakpoint (explicit CSS aspect-ratio). Wide card images: fluid, content-driven height. Desktop about 0.94:1, tablet about 0.65:1, mobile about 0.76:1.",
  },
  {
    name: "PlatformSurfacesStacked",
    animation:
      "Desktop: scroll/wheel/touch/keyboard-jacked card stack (transform 650ms cubic-bezier(0.33,1,0.68,1), opacity 1100ms ease-out per card), content fade+slide-in on activation (500ms ease, 150ms delay), nav-dot resize (400ms). Mobile/tablet and reduced motion fall back to a static stacked list with no scroll-jack. Shared scroll-reveal on heading.",
    references: "None",
    imageAspectRatio:
      "Desktop only: image hidden below 1200px, so not shown on tablet or mobile. Width is fluid (viewport minus the 477px text panel) and height fills the viewport (100svh), so there is no stable ratio; source art should be wide and tolerate cropping on both axes.",
  },
  {
    name: "PlatformSurfacesTabbed",
    animation:
      "Tab background transition (300ms) on switch. Panel fade-in (400ms cubic-bezier(0.33,1,0.68,1)) on every tab switch, gated behind a one-time check for whether the section has scrolled into view yet, so the very first panel doesn't play and finish off-screen before the page has been scrolled to it. Shared scroll-reveal on heading, tab labels, and the panel stat box.",
    references: "None",
    imageAspectRatio:
      "Fixed panel height, fluid width. Desktop about 1.60:1 (540px tall), tablet about 2.63:1 (280px tall), mobile about 1.23:1 (280px tall).",
  },
  {
    name: "TestimonialCarousel",
    animation:
      "Desktop: hover/focus-expanding cards (flex-basis 350ms cubic-bezier(0.4,0,0.2,1), text fade 350ms with a 150ms delay). Mobile: swipeable one-card-per-slide via native CSS scroll-snap, with dot pagination (400ms resize). Shared scroll-reveal on mobile card text.",
    references: "None",
    imageAspectRatio:
      "Desktop (hidden on tablet/mobile): the visible crop window is about 0.45:1, but the photo itself is deliberately rendered at 420% width for a hover pan effect, so source art needs to be about 1.88:1 or wider to have real content to reveal. Tablet about 3.67:1 and mobile about 1.71:1 for the swipeable card photo (fixed 200px height, hidden on desktop).",
  },
  {
    name: "Teaser50",
    animation: "Shared scroll-reveal on the two card headings.",
    references: "CtaButton, FormInput",
    imageAspectRatio:
      "Fixed 352px card height, fluid width. Desktop about 1.90:1, tablet about 2.09:1, mobile about 0.97:1.",
  },
  {
    name: "FaqSection",
    animation:
      "Accordion open/close (max-height 320ms cubic-bezier(0.33,1,0.68,1), icon bar scale 250ms). Shared scroll-reveal on kicker and heading.",
    references: "None",
    imageAspectRatio: "Not applicable, no images.",
  },
  {
    name: "Teaser100",
    animation: "Shared scroll-reveal on the heading.",
    references: "CtaButton, FormInput",
    imageAspectRatio:
      "Full-bleed background photo, fixed section height. Desktop about 2.66:1 (542px tall), tablet about 1.85:1, mobile about 0.90:1 (416px tall).",
  },
  {
    name: "SiteFooter",
    animation: "None",
    references: "None",
    imageAspectRatio: "Not applicable, no images (mark is an SVG).",
  },
  {
    name: "CtaButton",
    animation: "Hover/focus color transition (200ms ease, background/text/border).",
    references: "None",
    imageAspectRatio: "Not applicable, no images.",
  },
  {
    name: "FormInput",
    animation: "None",
    references: "None",
    imageAspectRatio: "Not applicable, no images.",
  },
];

// Column D is temporarily hidden per request; data stays in COMPONENT_ROWS
// above so it can be switched back on without re-deriving the measurements.
const SHOW_IMAGE_ASPECT_RATIO = false;

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
            Column A: component. Column B: animation applied. Column C: other components it references.
            {SHOW_IMAGE_ASPECT_RATIO &&
              " Column D: image aspect ratio needed at desktop, tablet, and mobile, measured at 1440px, 768px, and 375px viewport widths respectively."}
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Animation applied</th>
                  <th>Other components referenced</th>
                  {SHOW_IMAGE_ASPECT_RATIO && <th>Image aspect ratio (desktop / tablet / mobile)</th>}
                </tr>
              </thead>
              <tbody>
                {COMPONENT_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td className={styles.muted}>{row.animation}</td>
                    <td className={styles.muted}>{row.references}</td>
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
