import { useRef } from "react";
import { CtaButton } from "../../ui/CtaButton/CtaButton";
import { FormInput } from "../../ui/FormInput/FormInput";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import dataCenterImage from "../../../assets/data-center.webp";
import styles from "./Teaser100.module.css";

/**
 * Full-width "CTA Section" that sits after FAQ — a distinct section from
 * the split 2-card `Teaser50` above FAQ, per the source
 * (`src/imports/HomePage/index.tsx:20138-20140`, `Frame58`). Reuses the
 * same photo asset as `Teaser50`'s photo card (confirmed identical file).
 * See ASSUMPTIONS.md.
 */
export function Teaser100() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Start the conversation">
      <img src={dataCenterImage} alt="" className={styles.photo} loading="lazy" decoding="async" />
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.content}>
        <h2 className={styles.heading} data-reveal>
          The foundation your enterprise needs. Start the conversation to find out
          how it's right for yours.
        </h2>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <FormInput
            id="cta-full-email"
            label="Email Address"
            placeholder="Email Address"
            type="email"
            variant="pill"
            action={
              <CtaButton type="submit" variant="primary" size="small">
                Let's Talk
              </CtaButton>
            }
          />
        </form>
      </div>
    </section>
  );
}
