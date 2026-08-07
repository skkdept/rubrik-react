import { Container } from "../../components/layout/Container/Container";
import styles from "./ComponentDetails.module.css";

interface ComponentRow {
  name: string;
  animation: string;
  references: string;
}

const COMPONENT_ROWS: ComponentRow[] = [
  {
    name: "Nav",
    animation:
      "Sticky header that compacts on scroll: bar height 83px to 64px plus a box-shadow fade-in, 220ms ease, once scrollY exceeds 8px. Search bar width transition (220ms) once the query grows past 30 characters.",
    references: "CtaButton, FormInput",
  },
  {
    name: "HeroSection",
    animation:
      "One-time fade-up on page load, staggered per element (0/180/360/560ms delay, 1200ms cubic-bezier(0.19,1,0.22,1)); continuous diagonal light sweep masked across the background grid overlay (8s linear infinite).",
    references: "Container, CtaButton",
  },
  {
    name: "LogoStrip",
    animation:
      "Continuous auto-scrolling marquee (36s linear infinite, translateX 0 to -50%), paused on hover/focus. Falls back to the original static, manually-scrollable row under reduced motion.",
    references: "None",
  },
  {
    name: "PlatformIntro",
    animation: "Shared scroll-reveal on heading, body copy, and the 4 corner plus-marks (cascading stagger).",
    references: "Container",
  },
  {
    name: "StatCardGrid",
    animation:
      "Independent per-card count-up (0 to target, linear, 1400ms) triggered by each card's own IntersectionObserver; replays every time that card re-enters view. Shared scroll-reveal on captions.",
    references: "Container",
  },
  {
    name: "PlatformSurfacesStacked",
    animation:
      "Desktop: scroll/wheel/touch/keyboard-jacked card stack (transform 650ms cubic-bezier(0.33,1,0.68,1), opacity 1100ms ease-out per card), content fade+slide-in on activation (500ms ease, 150ms delay), nav-dot resize (400ms). Mobile/tablet and reduced motion fall back to a static stacked list with no scroll-jack. Shared scroll-reveal on heading.",
    references: "None",
  },
  {
    name: "PlatformSurfacesTabbed",
    animation:
      "Tab background transition (300ms) on switch. Panel fade-in (400ms cubic-bezier(0.33,1,0.68,1)) on every tab switch, gated behind a one-time check for whether the section has scrolled into view yet, so the very first panel doesn't play and finish off-screen before the page has been scrolled to it. Shared scroll-reveal on heading, tab labels, and the panel stat box.",
    references: "None",
  },
  {
    name: "TestimonialCarousel",
    animation:
      "Desktop: hover/focus-expanding cards (flex-basis 350ms cubic-bezier(0.4,0,0.2,1), text fade 350ms with a 150ms delay). Mobile: swipeable one-card-per-slide via native CSS scroll-snap, with dot pagination (400ms resize). Shared scroll-reveal on mobile card text.",
    references: "None",
  },
  {
    name: "Teaser50",
    animation: "Shared scroll-reveal on the two card headings.",
    references: "CtaButton, FormInput",
  },
  {
    name: "FaqSection",
    animation:
      "Accordion open/close (max-height 320ms cubic-bezier(0.33,1,0.68,1), icon bar scale 250ms). Shared scroll-reveal on kicker and heading.",
    references: "None",
  },
  {
    name: "Teaser100",
    animation: "Shared scroll-reveal on the heading.",
    references: "CtaButton, FormInput",
  },
  {
    name: "SiteFooter",
    animation: "None",
    references: "None",
  },
  {
    name: "CtaButton",
    animation: "Hover/focus color transition (200ms ease, background/text/border).",
    references: "None",
  },
  {
    name: "FormInput",
    animation: "None",
    references: "None",
  },
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
            Column A: component. Column B: animation applied. Column C: other components it references.
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Animation applied</th>
                  <th>Other components referenced</th>
                </tr>
              </thead>
              <tbody>
                {COMPONENT_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td className={styles.muted}>{row.animation}</td>
                    <td className={styles.muted}>{row.references}</td>
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
