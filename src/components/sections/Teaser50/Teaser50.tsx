import { useRef } from "react";
import { CtaButton } from "../../ui/CtaButton/CtaButton";
import { FormInput } from "../../ui/FormInput/FormInput";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import { AnimatedHeading } from "../../ui/AnimatedHeading/AnimatedHeading";
import dataCenterImage from "../../../assets/data-center.webp";
import styles from "./Teaser50.module.css";

export function Teaser50() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Get in touch">
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.cardDark}`}>
          <AnimatedHeading
            text="The foundation your enterprise needs. Start the conversation to find out how it's right for yours."
            className={styles.cardHeading}
          />
          <form
            className={styles.form}
            onSubmit={(e) => e.preventDefault()}
          >
            <FormInput
              id="cta-email"
              label="Email Address"
              placeholder="Email Address"
              type="email"
              variant="pill"
              action={
                <CtaButton type="submit" variant="primary" size="small">
                  Submit
                </CtaButton>
              }
            />
          </form>
        </div>

        <div className={`${styles.card} ${styles.cardPhoto}`}>
          <img src={dataCenterImage} alt="" loading="lazy" decoding="async" />
          <div className={styles.cardPhotoScrim} aria-hidden="true" />
          <AnimatedHeading
            text={"When your data is secure,\nyour business is unstoppable"}
            className={styles.cardHeading}
          />
          <div className={styles.cardAction}>
            <CtaButton variant="secondary" size="large" href="#contact">
              Contact Sales →
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
