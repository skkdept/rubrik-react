import { useRef } from "react";
import { Container } from "../../layout/Container/Container";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import styles from "./PlatformIntro.module.css";

function PlusMark({ style }: { style: React.CSSProperties }) {
  return (
    <svg className={styles.plusMark} style={style} viewBox="0 0 11.6211 11.6211" aria-hidden="true">
      <path d="M6.3916 5.22949H11.6211V6.3916H6.3916V11.6211H5.22949V6.3916H0V5.22949H5.22949V0H6.3916V5.22949Z" />
    </svg>
  );
}

export function PlatformIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={`${styles.divider} ${styles.dividerStart}`} aria-hidden="true" />
      <div className={`${styles.divider} ${styles.dividerEnd}`} aria-hidden="true" />

      <Container>
        <div className={styles.row}>
          <h2 className={styles.heading} data-reveal>
            Most platforms are bolted together. Rubrik is the only platform for
            data, identity and AI.
          </h2>

          <div className={styles.bodyWrap}>
            <p className={styles.body} data-reveal>
              Rubrik is built from the foundation up, not patched together from
              point solutions. The architecture holds regardless of what's
              happening: an attack, a scaling event, a new agent in production.
            </p>
            <PlusMark style={{ left: 6, top: 0 }} />
            <PlusMark style={{ left: 0, bottom: 0 }} />
            <PlusMark style={{ right: 6, top: 0 }} />
            <PlusMark style={{ right: 0, bottom: 0 }} />
          </div>
        </div>
      </Container>
    </section>
  );
}
