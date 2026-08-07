import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../../../data/testimonials";
import { RubrikMark } from "../../ui/RubrikMark/RubrikMark";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import headshot from "../../../assets/testimonial-headshot.webp";
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

  const mobileListRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileTickingRef = useRef(false);

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

  // One full-width slide per card (scroll-snap), so the current slide index
  // is just scroll position / slide width — simpler and more robust than
  // hand-rolled touch handling, and gets native swipe gestures for free.
  const updateMobileIndex = () => {
    const el = mobileListRef.current;
    if (!el || el.clientWidth === 0) return;
    setMobileIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const handleMobileScroll = () => {
    if (mobileTickingRef.current) return;
    mobileTickingRef.current = true;
    requestAnimationFrame(() => {
      mobileTickingRef.current = false;
      updateMobileIndex();
    });
  };

  // A transient scroll event can fire while layout is still settling (e.g.
  // lazy images reflowing as they load in), computing a wrong index from a
  // since-corrected scroll position with no further scroll event to fix it.
  // A ResizeObserver on the list itself recomputes whenever its size
  // actually changes — covers initial layout settling, later reflows, and
  // viewport resizes/rotation, not just a single mount-time snapshot.
  useEffect(() => {
    const el = mobileListRef.current;
    if (!el) return;
    updateMobileIndex();
    const observer = new ResizeObserver(updateMobileIndex);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToMobileIndex = (i: number) => {
    const el = mobileListRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Customer stories">
      {/* Mobile/tablet: one card per swipeable slide, dot pagination below */}
      <div
        className={styles.mobileList}
        ref={mobileListRef}
        onScroll={handleMobileScroll}
        role="group"
        aria-roledescription="carousel"
        aria-label="Customer stories"
      >
        {TESTIMONIALS.map((t) => (
          <div className={styles.mobileCard} key={t.id}>
            <div className={styles.mobileCardInner}>
              <div className={styles.mobilePhoto}>
                <img src={headshot} alt="" loading="lazy" decoding="async" />
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
          </div>
        ))}
      </div>

      <div className={styles.mobileDots}>
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            className={i === mobileIndex ? `${styles.mobileDot} ${styles.mobileDotActive}` : styles.mobileDot}
            aria-label={`Show testimonial from ${t.name}`}
            aria-current={i === mobileIndex}
            onClick={() => scrollToMobileIndex(i)}
          />
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
                    <img src={headshot} alt="" style={{ left: t.imageOffset }} loading="lazy" decoding="async" />
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
