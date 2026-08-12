import { useRef, type CSSProperties } from "react";
import { Container } from "../../layout/Container/Container";
import { CtaButton } from "../../ui/CtaButton/CtaButton";
import { AnimatedHeading } from "../../ui/AnimatedHeading/AnimatedHeading";
import { PressGrid } from "./PressGrid";
import { usePrefersReducedMotion } from "../../../lib/usePrefersReducedMotion";
import heroBackground from "../../../assets/hero-background.webp";
import heroMedia from "../../../assets/hero.webp";
import styles from "./HeroSection.module.css";

function delayStyle(ms: number): CSSProperties {
  return { "--hero-delay": `${ms}ms` } as CSSProperties;
}

const TRANSITION_MS = 450; // must match .wordInner's transition duration
const HEADING_STAGGER_MS = 900;

// Chain each block's startDelayMs off the previous block's own reveal
// duration (stagger + flip transition) so each wave fully finishes before
// the next one begins, instead of rippling across the hero at once. The
// kicker ("Rubrik Agent Cloud") is plain static text with no animation, so
// the headline is the first animated element and starts immediately.
const HEADLINE_DELAY = 0;
const SUBTITLE_DELAY = HEADLINE_DELAY + HEADING_STAGGER_MS + TRANSITION_MS;
const CTA_DELAY = SUBTITLE_DELAY + HEADING_STAGGER_MS + TRANSITION_MS;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  // PressGrid renders the same grid via WebGL and takes over animating it,
  // on touch as well as hover-capable devices — the plain CSS grid stays as
  // the zero-JS fallback only for prefers-reduced-motion, so exactly one
  // grid is ever visible. Mobile is the majority of this page's traffic, so
  // this is a deliberate, called-out performance tradeoff (extra JS/WebGL
  // payload and GPU work above the fold on phones), not an oversight — see
  // PressGrid's own pointerup/pointercancel handling for the touch-specific
  // "press while dragging a finger" behavior this enables.
  const pressGridActive = !prefersReducedMotion;

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.backgroundArt} aria-hidden="true">
        <img src={heroBackground} alt="" fetchPriority="high" />
      </div>
      <div className={styles.backgroundVeil} aria-hidden="true" />
      <div
        className={pressGridActive ? `${styles.backgroundGrid} ${styles.backgroundGridHidden}` : styles.backgroundGrid}
        aria-hidden="true"
      />
      {pressGridActive && <PressGrid sectionRef={sectionRef} />}

      <Container>
        <div className={styles.content}>
          <p className={styles.kicker}>Rubrik Agent Cloud</p>

          <AnimatedHeading
            as="h1"
            id="hero-heading"
            text={"Built for the threats\nthat don't exist yet."}
            className={styles.headline}
            startDelayMs={HEADLINE_DELAY}
          />

          <AnimatedHeading
            as="p"
            text="One platform. Data, identity, and AI unified from the foundation up. Not assembled. Not bolted on."
            className={styles.subtitle}
            startDelayMs={SUBTITLE_DELAY}
          />

          <div className={`${styles.ctaRow} ${styles.heroItem}`} style={delayStyle(CTA_DELAY)}>
            <CtaButton variant="primary" size="large" href="#demo">
              Watch Demo Now →
            </CtaButton>
            <CtaButton variant="secondary" size="large" href="#platform">
              Explore Rubrik's Platform →
            </CtaButton>
          </div>
        </div>

        <div className={styles.mediaPlaceholder}>
          <img
            src={heroMedia}
            alt="Rubrik Security Cloud connecting AWS, Google Cloud, Microsoft, VMware, Salesforce, and SAP HANA"
            decoding="async"
          />
        </div>
      </Container>
    </section>
  );
}
