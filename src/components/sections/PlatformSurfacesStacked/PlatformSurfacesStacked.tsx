import { useEffect, useRef, useState } from "react";
import { useIsDesktop } from "../../../lib/useBreakpoint";
import { usePrefersReducedMotion } from "../../../lib/usePrefersReducedMotion";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import {
  PLATFORM_SURFACE_CARDS,
  PLATFORM_SURFACES_HEADING,
  type PlatformSurfaceCard,
} from "../../../data/platformSurfaces";
import dataCenterImage from "../../../assets/data-center.webp";
import styles from "./PlatformSurfacesStacked.module.css";

const TOTAL_CARDS = PLATFORM_SURFACE_CARDS.length;
const ANIM_MS = 650;

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6.5 4.5v11l9-5.5-9-5.5Z" fill="#1F1F1F" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ transform: direction === "up" ? "rotate(180deg)" : undefined }}>
      <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardPanel({
  card,
  entranceClass,
}: {
  card: PlatformSurfaceCard;
  entranceClass?: string;
}) {
  return (
    <div className={styles.cardInner}>
      <div className={`${styles.divider} ${entranceClass ?? ""}`} style={{ left: "3.125rem" }} aria-hidden="true" />
      <div className={`${styles.divider} ${entranceClass ?? ""}`} style={{ right: "3rem" }} aria-hidden="true" />

      <div className={styles.cardBody}>
        <div className={`${styles.textPanel} ${entranceClass ?? ""}`}>
          <div className={styles.badgeRow}>
            <div className={styles.categoryRow}>
              <span className={styles.categoryDot} aria-hidden="true" />
              <span className={styles.category}>{card.category}</span>
            </div>
          </div>

          <h3 className={styles.title}>{card.title}</h3>

          <div className={styles.textBody}>
            <p className={styles.description}>{card.description}</p>
            <ul className={styles.features}>
              {card.features.map((feature) => (
                <li className={styles.feature} key={feature}>
                  <span className={styles.featureDot} aria-hidden="true" />
                  <p className={styles.featureText}>{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.imagePanel}>
          <img src={dataCenterImage} alt="" loading="lazy" decoding="async" />
          <div className={styles.playButton} aria-hidden="true">
            <PlayIcon />
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{card.stat}</p>
            <p className={styles.statLabel}>{card.statLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(1);
  const lockedRef = useRef(false);
  const animRef = useRef(false);
  const doneRef = useRef(false);
  const [visible, setVisible] = useState(1);

  const sync = (n: number) => {
    visibleRef.current = n;
    setVisible(n);
  };

  const lock = () => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    document.body.style.overflow = "hidden";
  };

  const unlock = () => {
    if (!lockedRef.current) return;
    lockedRef.current = false;
    document.body.style.overflow = "";
  };

  const inView = () => {
    if (!sectionRef.current) return false;
    const r = sectionRef.current.getBoundingClientRect();
    return r.top <= 0 && r.bottom > 0;
  };

  const showNext = () => {
    if (animRef.current) return;
    if (visibleRef.current >= TOTAL_CARDS) {
      doneRef.current = true;
      unlock();
      return;
    }
    animRef.current = true;
    sync(visibleRef.current + 1);
    setTimeout(() => {
      animRef.current = false;
      if (visibleRef.current >= TOTAL_CARDS) {
        doneRef.current = true;
        unlock();
      }
    }, ANIM_MS);
  };

  const showPrev = () => {
    if (animRef.current) return;
    if (visibleRef.current <= 1) {
      unlock();
      return;
    }
    animRef.current = true;
    sync(visibleRef.current - 1);
    setTimeout(() => {
      animRef.current = false;
      if (visibleRef.current <= 1) unlock();
    }, ANIM_MS);
  };

  const jumpTo = (index: number) => {
    doneRef.current = index >= TOTAL_CARDS - 1;
    sync(index + 1);
  };

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      if (r.bottom < 0 && visibleRef.current > 1) {
        unlock();
        doneRef.current = false;
        animRef.current = false;
        sync(1);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!inView()) return;

      if (!lockedRef.current) {
        if (e.deltaY > 5 && !doneRef.current && visibleRef.current < TOTAL_CARDS) {
          e.preventDefault();
          lock();
          showNext();
        }
        if (e.deltaY < -5 && doneRef.current) {
          e.preventDefault();
          doneRef.current = false;
          lock();
          showPrev();
        }
        return;
      }

      e.preventDefault();
      if (e.deltaY > 5) showNext();
      else if (e.deltaY < -5) showPrev();
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!inView()) return;
      const delta = touchY - e.changedTouches[0].clientY;
      if (!lockedRef.current) {
        if (delta > 40 && !doneRef.current && visibleRef.current < TOTAL_CARDS) {
          lock();
          showNext();
        } else if (delta < -40 && doneRef.current) {
          doneRef.current = false;
          lock();
          showPrev();
        }
        return;
      }
      if (delta > 40) showNext();
      else if (delta < -40) showPrev();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (lockedRef.current) e.preventDefault();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      document.body.style.overflow = "";
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      showNext();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      showPrev();
    }
  };

  return (
    <div
      ref={sectionRef}
      className={styles.stackViewport}
      onKeyDown={handleKeyDown}
      role="group"
      aria-roledescription="carousel"
      aria-label="Platform surfaces"
    >
      {PLATFORM_SURFACE_CARDS.map((card, i) => {
        const depth = visible - 1 - i;
        let transform: string;
        let opacity = 1;
        if (i >= visible) {
          transform = "translateY(105%)";
          opacity = 0;
        } else if (depth === 0) {
          transform = "translateY(0) scale(1)";
        } else {
          const scale = Math.max(0.86, 1 - depth * 0.04);
          const ty = -depth * 18;
          transform = `translateY(${ty}px) scale(${scale})`;
        }

        return (
          <div
            key={card.id}
            className={styles.card}
            data-active={depth === 0 && i < visible}
            style={{ zIndex: i + 1, transform, opacity }}
            aria-hidden={i >= visible}
          >
            <CardPanel card={card} entranceClass={i > 0 ? styles.enterOnActive : undefined} />
          </div>
        );
      })}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          onClick={showPrev}
          disabled={visible <= 1}
          aria-label="Previous surface"
        >
          <ChevronIcon direction="up" />
        </button>
        <div className={styles.dots}>
          {PLATFORM_SURFACE_CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              className={`${styles.dot} ${i === visible - 1 ? styles.dotActive : i < visible ? styles.dotSeen : ""}`}
              aria-label={`Show ${card.category.toLowerCase()} surface`}
              aria-current={i === visible - 1}
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.navButton}
          onClick={showNext}
          disabled={visible >= TOTAL_CARDS}
          aria-label="Next surface"
        >
          <ChevronIcon direction="down" />
        </button>
      </div>

      <p className={styles.counter} aria-hidden="true">
        {String(visible).padStart(2, "0")} / {String(TOTAL_CARDS).padStart(2, "0")}
      </p>
    </div>
  );
}

function StaticList() {
  return (
    <div className={styles.staticList}>
      {PLATFORM_SURFACE_CARDS.map((card) => (
        <div className={styles.staticItem} key={card.id}>
          <CardPanel card={card} />
        </div>
      ))}
    </div>
  );
}

export function PlatformSurfacesStacked() {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();
  const useStack = isDesktop && !prefersReducedMotion;
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="platform-surfaces-stacked-heading"
    >
      <div className={styles.heading}>
        <p className={styles.headingLine1} id="platform-surfaces-stacked-heading" data-reveal>
          {PLATFORM_SURFACES_HEADING.title}
        </p>
        <p className={styles.headingLine2} data-reveal>
          {PLATFORM_SURFACES_HEADING.subtitle}
        </p>
      </div>

      {useStack ? <DesktopStack /> : <StaticList />}
    </section>
  );
}
