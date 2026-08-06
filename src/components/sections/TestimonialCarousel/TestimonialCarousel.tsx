import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../../../data/testimonials";
import { RubrikMark } from "../../ui/RubrikMark/RubrikMark";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import headshot from "../../../assets/testimonial-headshot.png";
import styles from "./TestimonialCarousel.module.css";

function Badge() {
  return (
    <div className={styles.badge}>
      <RubrikMark className={styles.badgeMark} />
      <span className={styles.badgeText}>Rubrik</span>
    </div>
  );
}

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  useEffect(() => () => {
    if (idleRef.current) clearTimeout(idleRef.current);
  }, []);

  const handleEnter = (i: number) => {
    if (idleRef.current) clearTimeout(idleRef.current);
    setActiveIndex(i);
  };

  const handleRowLeave = () => {
    idleRef.current = setTimeout(() => setActiveIndex(0), 180);
  };

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Customer stories">
      {/* Mobile/tablet: static stacked cards, fully expanded */}
      <div className={styles.mobileList}>
        {TESTIMONIALS.map((t) => (
          <div className={styles.mobileCard} key={t.id}>
            <div className={styles.mobilePhoto}>
              <img src={headshot} alt="" />
              <Badge />
            </div>
            <div className={styles.mobileBody}>
              <p className={styles.stat} data-reveal>
                {t.stat}
              </p>
              <p className={styles.quote} data-reveal>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className={styles.byline}>
                <p className={styles.name} data-reveal>
                  {t.name}
                </p>
                <p className={styles.role} data-reveal>
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: hover/focus-expanding cards */}
      <div className={styles.desktopRow} onMouseLeave={handleRowLeave}>
        {TESTIMONIALS.map((t, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              type="button"
              key={t.id}
              className={isActive ? `${styles.desktopCard} ${styles.desktopCardActive}` : styles.desktopCard}
              onMouseEnter={() => handleEnter(i)}
              onFocus={() => handleEnter(i)}
              onClick={() => handleEnter(i)}
              aria-pressed={isActive}
              aria-label={`Show testimonial from ${t.name}, ${t.role}`}
            >
              <span className={styles.desktopCardShell}>
                <span className={styles.desktopCardInner}>
                  <span className={styles.photoStrip}>
                    <img src={headshot} alt="" style={{ left: t.imageOffset }} />
                    <Badge />
                  </span>

                  <span className={styles.textPanel}>
                    <span className={styles.textPanelInner}>
                      <span className={styles.textPanelTop}>
                        <span className={styles.desktopStat}>{t.stat}</span>
                        <span className={styles.desktopQuote}>&ldquo;{t.quote}&rdquo;</span>
                      </span>
                      <span>
                        <span className={styles.desktopName} style={{ display: "block" }}>
                          {t.name}
                        </span>
                        <span className={styles.desktopRole} style={{ display: "block" }}>
                          {t.role}
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
