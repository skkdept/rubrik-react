import { useRef } from "react";
import { Container } from "../../layout/Container/Container";
import { CtaButton } from "../../ui/CtaButton/CtaButton";
import { FormInput } from "../../ui/FormInput/FormInput";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import dataCenterImage from "../../../assets/data-center.png";
import styles from "./CtaBanner.module.css";

export function CtaBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Get in touch">
      <Container>
        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.cardDark}`}>
            <h2 className={styles.cardHeading} data-reveal>
              The foundation your enterprise needs. Start the conversation to find
              out how it's right for yours.
            </h2>
            <form
              className={styles.form}
              onSubmit={(e) => e.preventDefault()}
            >
              <FormInput
                id="cta-email"
                label="Email Address"
                placeholder="Email Address"
                type="email"
                variant="dark"
              />
              <CtaButton type="submit" variant="primary" size="medium">
                Submit
              </CtaButton>
            </form>
          </div>

          <div className={`${styles.card} ${styles.cardPhoto}`}>
            <img src={dataCenterImage} alt="" />
            <div className={styles.cardPhotoScrim} aria-hidden="true" />
            <h2 className={styles.cardHeading} data-reveal>
              When your data is secure,
              <br />
              your business is unstoppable
            </h2>
            <div className={styles.cardAction}>
              <CtaButton variant="accent" size="medium" href="#contact">
                Contact Sales →
              </CtaButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
