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
import carharttVideo from "../../../assets/carhartt-snippet.mp4";
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

/**
 * The same Carhartt customer story clip used in PlatformSurfacesTabbed
 * stands in for every card's play button here too — see that component
 * for why it isn't wired through `platformSurfaces` data.
 *
 * Unlike Tabbed's panels, these cards never unmount/remount as the stack
 * advances (`DesktopStack` repositions the same persistent DOM nodes via
 * transform rather than swapping them out), so `playing` can't reset for
 * free via a `key` change — it's driven directly off `isActive` instead,
 * autoplaying muted the moment a card becomes the top card and dropping
 * back to the thumbnail the moment it isn't, so returning to it later
 * (via the dots or scrolling back) starts fresh rather than picking up
 * mid-clip or continuing to play off-screen. `isActive` defaults to `true`
 * for the mobile/reduced-motion `StaticList` fallback, where every card is
 * just a normal stacked list item with no "current" card concept.
 */
function StackedPanelImage({
  stat,
  statLabel,
  isActive,
}: {
  stat: string;
  statLabel: string;
  isActive: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    setPlaying(isActive);
  }, [isActive, prefersReducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
  }, [playing]);

  return (
    <div className={styles.imagePanel}>
      {playing ? (
        <video ref={videoRef} className={styles.panelVideo} src={carharttVideo} controls muted playsInline />
      ) : (
        <>
          <img src={dataCenterImage} alt="" loading="lazy" decoding="async" />
          <button type="button" className={styles.playButton} aria-label="Play video" onClick={() => setPlaying(true)}>
            <PlayIcon />
          </button>
        </>
      )}
      {/* Slides in 2s after playback actually starts — see
          PlatformSurfacesStacked.module.css. */}
      <div className={playing ? `${styles.statBox} ${styles.statBoxSlideIn}` : styles.statBox}>
        <p className={styles.statValue}>{stat}</p>
        <p className={styles.statLabel}>{statLabel}</p>
      </div>
    </div>
  );
}

function CardPanel({
  card,
  entranceClass,
  // Defaults to false, not true: `StaticList` (mobile, and desktop with
  // prefers-reduced-motion) never passes this explicitly, and its
  // `.imagePanel` is hidden below 1200px regardless — defaulting to true
  // meant every one of its cards quietly autoplayed a muted video in the
  // background at once, invisible but still downloading/decoding 4 copies
  // of the clip for nothing. `false` just leaves it on the thumbnail,
  // which still supports a manual click-to-play if the panel ever is
  // visible (the desktop + reduced-motion case).
  isActive = false,
}: {
  card: PlatformSurfaceCard;
  entranceClass?: string;
  isActive?: boolean;
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

        <StackedPanelImage stat={card.stat} statLabel={card.statLabel} isActive={isActive} />
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
            <CardPanel
              card={card}
              entranceClass={i > 0 ? styles.enterOnActive : undefined}
              isActive={depth === 0 && i < visible}
            />
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
