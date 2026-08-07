import type { CSSProperties } from "react";
import { Container } from "../../layout/Container/Container";
import { CtaButton } from "../../ui/CtaButton/CtaButton";
import heroBackground from "../../../assets/hero-background.webp";
import styles from "./HeroSection.module.css";

function delayStyle(ms: number): CSSProperties {
  return { "--hero-delay": `${ms}ms` } as CSSProperties;
}

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.backgroundArt} aria-hidden="true">
        <img src={heroBackground} alt="" fetchPriority="high" />
      </div>
      <div className={styles.backgroundVeil} aria-hidden="true" />
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <Container>
        <div className={styles.content}>
          <p className={`${styles.kicker} ${styles.heroItem}`} style={delayStyle(0)}>
            Rubrik Agent Cloud
          </p>

          <h1 id="hero-heading" className={`${styles.headline} ${styles.heroItem}`} style={delayStyle(180)}>
            Built for the threats
            <br />
            that don't exist yet.
          </h1>

          <p className={`${styles.subtitle} ${styles.heroItem}`} style={delayStyle(360)}>
            One platform. Data, identity, and AI unified from the foundation up. Not
            assembled. Not bolted on.
          </p>

          <div className={`${styles.ctaRow} ${styles.heroItem}`} style={delayStyle(560)}>
            <CtaButton variant="primary" size="large" href="#demo">
              Watch Demo Now →
            </CtaButton>
            <CtaButton variant="secondary" size="large" href="#platform">
              Explore Rubrik's Platform →
            </CtaButton>
          </div>
        </div>

        <div className={styles.mediaPlaceholder} aria-hidden="true" />
      </Container>
    </section>
  );
}
