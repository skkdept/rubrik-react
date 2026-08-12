import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../../../data/testimonials";
import { RubrikMark } from "../../ui/RubrikMark/RubrikMark";
import { usePrefersReducedMotion } from "../../../lib/usePrefersReducedMotion";
import { AnimatedHeading } from "../../ui/AnimatedHeading/AnimatedHeading";
import headshot from "../../../assets/testimonial-headshot.webp";
import styles from "./TestimonialCarousel.module.css";

const TOTAL = TESTIMONIALS.length;
// Per explicit request: auto-advance every 3.5s, looping from the last
// testimonial back to the first rather than stopping.
const AUTOPLAY_MS = 3500;

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
  const prefersReducedMotion = usePrefersReducedMotion();

  const mobileListRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileIndexRef = useRef(0);
  const mobileTickingRef = useRef(false);

  // Card/slide 0 is already "active" at the very first render (both
  // `activeIndex` and `mobileIndex` default to 0), so without this its
  // text would render already fully revealed with no entrance to ever
  // play — same gap fixed the same way in PlatformSurfacesStacked's
  // `DesktopStack`/`MobileSlider` (`hasEnteredView`). Every other card
  // only ever becomes active via user interaction or autoplay, both of
  // which necessarily happen after the section is already in view.
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setHasEnteredView(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -40% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (idleRef.current) clearTimeout(idleRef.current);
  }, []);

  // Pauses autoplay while a card is hovered OR focused (not just hovered —
  // a keyboard user tabbed into a card would otherwise have it yanked away
  // mid-read once the timer fires), rather than fighting either form of
  // manual interaction. `handleRowLeave` doubles as the blur handler: both
  // "mouse left the row" and "focus left the row" mean the same thing here.
  const isInteractingRef = useRef(false);

  const handleEnter = (i: number) => {
    if (idleRef.current) clearTimeout(idleRef.current);
    setActiveIndex(i);
  };

  const handleRowEnter = () => {
    isInteractingRef.current = true;
  };

  const handleRowLeave = () => {
    isInteractingRef.current = false;
    idleRef.current = setTimeout(() => setActiveIndex(0), 180);
  };

  // Focus bubbles through every card-to-card tab press within the row too
  // (not just when focus truly leaves it) — `relatedTarget` distinguishes
  // "moved to a sibling card" (ignore) from "left the row" (treat like
  // `handleRowLeave`), so tabbing through cards doesn't snap back to card 0
  // between every tab press.
  const handleRowBlur = (e: React.FocusEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    handleRowLeave();
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      if (isInteractingRef.current) return;
      setActiveIndex((i) => (i + 1) % TOTAL);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

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

  useEffect(() => {
    mobileIndexRef.current = mobileIndex;
  }, [mobileIndex]);

  // Pauses while an actual touch/drag is in progress on the list — the same
  // "don't fight manual interaction" rule as the desktop row's hover/focus
  // pause above, just via pointer events since there's no hover concept on
  // touch. Also paused by focus within the list or dots, same reasoning as
  // the desktop row's keyboard case.
  const isMobileInteractingRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      if (isMobileInteractingRef.current) return;
      scrollToMobileIndex((mobileIndexRef.current + 1) % TOTAL);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  const handleMobileInteractStart = () => {
    isMobileInteractingRef.current = true;
  };
  const handleMobileInteractEnd = () => {
    isMobileInteractingRef.current = false;
  };
  const handleMobileBlur = (e: React.FocusEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    isMobileInteractingRef.current = false;
  };

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Customer stories">
      {/* Mobile/tablet: one card per swipeable slide, dot pagination below */}
      <div
        className={styles.mobileList}
        ref={mobileListRef}
        onScroll={handleMobileScroll}
        onPointerDown={handleMobileInteractStart}
        onPointerUp={handleMobileInteractEnd}
        onPointerCancel={handleMobileInteractEnd}
        onFocus={handleMobileInteractStart}
        onBlur={handleMobileBlur}
        role="group"
        aria-roledescription="carousel"
        aria-label="Customer stories"
      >
        {TESTIMONIALS.map((t, i) => {
          const isMobileActive = i === mobileIndex;
          return (
            <div className={styles.mobileCard} key={t.id}>
              <div className={styles.mobileCardInner}>
                <div className={styles.mobilePhoto}>
                  <img src={headshot} alt="" loading="lazy" decoding="async" />
                  <Badge />
                </div>
                <div className={styles.mobileBody}>
                  <AnimatedHeading as="p" text={t.stat} className={styles.stat} revealed={isMobileActive && hasEnteredView} />
                  <AnimatedHeading
                    as="p"
                    text={`“${t.quote}”`}
                    className={styles.quote}
                    revealed={isMobileActive && hasEnteredView}
                    startDelayMs={80}
                  />
                  <div className={styles.byline}>
                    <AnimatedHeading
                      as="p"
                      text={t.name}
                      className={styles.name}
                      revealed={isMobileActive && hasEnteredView}
                      startDelayMs={160}
                    />
                    <AnimatedHeading
                      as="p"
                      text={t.role}
                      className={styles.role}
                      revealed={isMobileActive && hasEnteredView}
                      startDelayMs={200}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.mobileDots} onFocus={handleMobileInteractStart} onBlur={handleMobileBlur}>
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
      <div
        className={styles.desktopRow}
        onMouseEnter={handleRowEnter}
        onMouseLeave={handleRowLeave}
        onFocus={handleRowEnter}
        onBlur={handleRowBlur}
      >
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
                        <AnimatedHeading as="span" text={t.stat} className={styles.desktopStat} revealed={isActive && hasEnteredView} />
                        <AnimatedHeading
                          as="span"
                          text={`“${t.quote}”`}
                          className={styles.desktopQuote}
                          revealed={isActive && hasEnteredView}
                          startDelayMs={80}
                        />
                      </span>
                      <span>
                        <AnimatedHeading
                          as="span"
                          text={t.name}
                          className={styles.desktopName}
                          revealed={isActive && hasEnteredView}
                          startDelayMs={160}
                        />
                        <AnimatedHeading
                          as="span"
                          text={t.role}
                          className={styles.desktopRole}
                          revealed={isActive && hasEnteredView}
                          startDelayMs={200}
                        />
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
