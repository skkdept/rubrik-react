import type { CSSProperties } from "react";
import { Container } from "../../layout/Container/Container";
import { CtaButton } from "../../ui/CtaButton/CtaButton";
import { FormInput } from "../../ui/FormInput/FormInput";
import heroBackground from "../../../assets/hero-background.png";
import styles from "./HeroSection.module.css";

function delayStyle(ms: number): CSSProperties {
  return { "--hero-delay": `${ms}ms` } as CSSProperties;
}

/** The AI search bar's sparkle icon, ported from the old repo's RubrikAIIcon. */
function SparkleIcon() {
  return (
    <svg viewBox="0 0 19.0342 18.926" fill="none" aria-hidden="true">
      <path
        d="M6.28882 13.1958C6.38315 13.5535 6.5558 13.9419 6.92223 13.9928C6.99736 14.0033 7.0736 14.004 7.14889 13.9951C7.52712 13.9501 7.7033 13.5466 7.79464 13.1768C8.03202 12.2158 8.59122 10.2911 9.43426 9.43377C10.2881 8.56545 12.2359 7.97783 13.1935 7.73043C13.5532 7.63752 13.9449 7.4656 13.9949 7.09749C14.0052 7.02155 14.0055 6.94453 13.9958 6.86853C13.9484 6.49535 13.5503 6.32193 13.1854 6.23037C12.2262 5.98966 10.2909 5.42009 9.43426 4.56749C8.57554 3.7128 7.99829 1.77562 7.75413 0.816147C7.66137 0.451625 7.48674 0.0546802 7.11362 0.00711921C7.03836 -0.00247372 6.96209 -0.002372 6.88686 0.00742437C6.51535 0.0557984 6.34119 0.450664 6.24818 0.813583C6.0028 1.77103 5.42321 3.70773 4.56859 4.56749C3.70957 5.43168 1.76234 6.02168 0.806737 6.2703C0.448673 6.36346 0.0590634 6.53491 0.00830667 6.9014C-0.0024251 6.97889 -0.00275822 7.05754 0.00730732 7.1351C0.0555281 7.50667 0.451618 7.67962 0.814876 7.77144C1.77203 8.01337 3.70695 8.58528 4.56859 9.43377C5.43897 10.2909 6.03674 12.2399 6.28882 13.1958Z"
        fill="currentColor"
      />
      <path
        d="M14.7948 18.4256C14.8581 18.6597 14.9761 18.9232 15.2187 18.926C15.4684 18.9289 15.5891 18.6553 15.6505 18.4132C15.7883 17.8702 16.0886 16.8768 16.5328 16.425C16.983 15.9672 17.9883 15.6519 18.5304 15.5082C18.7664 15.4456 19.0329 15.3276 19.0342 15.0834C19.0354 14.8362 18.7645 14.717 18.5251 14.6553C17.9826 14.5154 16.9842 14.2097 16.5328 13.7604C16.0801 13.3097 15.7703 12.3094 15.6286 11.7668C15.5662 11.5282 15.4467 11.259 15.2001 11.2594C14.9544 11.2597 14.8352 11.5275 14.7728 11.7651C14.6304 12.3067 14.3195 13.307 13.8688 13.7604C13.4164 14.2156 12.4124 14.5319 11.871 14.6765C11.6351 14.7395 11.3687 14.8578 11.3675 15.102C11.3663 15.3492 11.637 15.4687 11.8764 15.5308C12.4183 15.6715 13.4152 15.9783 13.8688 16.425C14.328 16.8772 14.6486 17.8845 14.7948 18.4256Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.backgroundArt} aria-hidden="true">
        <img src={heroBackground} alt="" />
      </div>
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

          <div className={`${styles.searchBar} ${styles.heroItem}`} style={delayStyle(740)}>
            <FormInput
              id="hero-ask"
              label="Ask Rubrik anything"
              placeholder="Ask Rubrik anything"
              type="search"
              icon={<SparkleIcon />}
              action={
                <button type="submit" className={styles.askButton}>
                  Ask
                </button>
              }
            />
          </div>
        </div>

        <div className={styles.mediaPlaceholder} aria-hidden="true" />
      </Container>
    </section>
  );
}
