import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useIsTabletUp } from "../../../lib/useBreakpoint";
import { usePrefersReducedMotion } from "../../../lib/usePrefersReducedMotion";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import { AnimatedHeading } from "../../ui/AnimatedHeading/AnimatedHeading";
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

// Matches PlatformSurfacesTabbed's own per-element stagger step exactly, so
// advancing a card/slide here reads as the same animation as switching a tab
// there (see that file's `revealDelay`).
const REVEAL_STEP_MS = 70;

function revealDelay(step: number): CSSProperties {
  return { transitionDelay: `${step * REVEAL_STEP_MS}ms` };
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6.5 4.5v11l9-5.5-9-5.5Z" fill="#1F1F1F" />
    </svg>
  );
}

const CHEVRON_ROTATION = { up: "rotate(180deg)", down: undefined, left: "rotate(90deg)", right: "rotate(-90deg)" } as const;

function ChevronIcon({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ transform: CHEVRON_ROTATION[direction] }}>
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
  // Defaults to false, not true: `StaticList` (mobile/desktop with
  // prefers-reduced-motion) never passes this explicitly, since it renders
  // every card at once with no "current card" concept to reveal against.
  // When true, each text element gets `.enterOnActive` (hidden until its
  // ancestor's `data-active="true"`) plus a staggered `revealDelay`, so the
  // text visibly cascades in top-to-bottom rather than popping in as one
  // block — same stagger step PlatformSurfacesTabbed uses per element.
  revealChildren = false,
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
  revealChildren?: boolean;
  isActive?: boolean;
}) {
  const reveal = (step: number) =>
    revealChildren ? { className: styles.enterOnActive, style: revealDelay(step) } : { className: "", style: undefined };

  return (
    <div className={styles.cardInner}>
      <div className={`${styles.divider} ${reveal(0).className}`} style={{ left: "3.125rem", ...reveal(0).style }} aria-hidden="true" />
      <div className={`${styles.divider} ${reveal(0).className}`} style={{ right: "3rem", ...reveal(0).style }} aria-hidden="true" />

      <div className={styles.cardBody}>
        <div className={styles.textPanel}>
          <div className={`${styles.badgeRow} ${reveal(0).className}`} style={reveal(0).style}>
            <div className={styles.categoryRow}>
              <span className={styles.categoryDot} aria-hidden="true" />
              <span className={styles.category}>{card.category}</span>
            </div>
          </div>

          <h3 className={`${styles.title} ${reveal(1).className}`} style={reveal(1).style}>
            {card.title}
          </h3>

          <div className={styles.textBody}>
            <p className={`${styles.description} ${reveal(2).className}`} style={reveal(2).style}>
              {card.description}
            </p>
            <ul className={styles.features}>
              {card.features.map((feature, i) => (
                <li className={`${styles.feature} ${reveal(3 + i).className}`} style={reveal(3 + i).style} key={feature}>
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

/**
 * Scroll-jacking state machine shared by `DesktopStack`'s depth-stacked
 * cards and `MobileSlider`'s single-slide view — extracted so advancing a
 * card/slide behaves identically on both: locks page scroll while stepping
 * through one at a time (forward or back), releases it once you're past
 * the last one, and stepping back just steps back one at a time rather
 * than cycling through everything. `visible` is a 1-indexed "how many
 * cards has the user reached" count (matching `DesktopStack`'s original
 * model — card `i` is active when `i === visible - 1`); `MobileSlider`
 * derives its own 0-indexed `index` from it instead of duplicating the
 * state machine with an off-by-one variant.
 */
function useStackNavigation(total: number) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(1);
  const lockedRef = useRef(false);
  const animRef = useRef(false);
  const doneRef = useRef(false);
  const [visible, setVisible] = useState(1);

  // Card/slide 1 is visible from the very first render (`data-active` is
  // already true at mount for i=0), so without this its text would render
  // already fully revealed with no entrance to ever play — including when
  // the section first scrolls into view, which is exactly when we want it
  // to. Gating `data-active` on this too (in each consumer) turns that
  // mount-time "already true" into a genuine false->true change once the
  // section is actually visible, so `.enterOnActive`'s transition fires
  // for real. Cards/slides 2+ are unaffected: their own data-active flips
  // only ever happen via user interaction, which necessarily happens after
  // the section is in view, so `hasEnteredView` is already true by then
  // regardless.
  //
  // Observed with a deep `-40%` bottom rootMargin rather than a small
  // threshold on `sectionRef` itself: `sectionRef` here is the full 100svh
  // viewport container, and a plain 10%-of-height threshold fires once
  // just its top sliver is visible — long before the actual card text
  // (which sits within it) has scrolled into view. Requiring it to reach
  // well into the viewport avoids reveal-plays-off-screen, the same class
  // of bug PlatformSurfacesTabbed had.
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
    if (visibleRef.current >= total) {
      doneRef.current = true;
      unlock();
      return;
    }
    animRef.current = true;
    sync(visibleRef.current + 1);
    setTimeout(() => {
      animRef.current = false;
      if (visibleRef.current >= total) {
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
    doneRef.current = index >= total - 1;
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
        if (e.deltaY > 5 && !doneRef.current && visibleRef.current < total) {
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
        if (delta > 40 && !doneRef.current && visibleRef.current < total) {
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
    // `total` is a caller-supplied constant (TOTAL_CARDS), never reactive —
    // deliberately not a dependency, matching the original DesktopStack
    // effect this was extracted from.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sectionRef, visible, hasEnteredView, showNext, showPrev, jumpTo };
}

function DesktopStack() {
  const { sectionRef, visible, hasEnteredView, showNext, showPrev, jumpTo } = useStackNavigation(TOTAL_CARDS);

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
            data-active={depth === 0 && i < visible && hasEnteredView}
            style={{ zIndex: i + 1, transform, opacity }}
            aria-hidden={i >= visible}
          >
            <CardPanel
              card={card}
              revealChildren
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

/**
 * Mobile-only: one full-width slide at a time, advanced by the exact same
 * scroll-jacked stepping as `DesktopStack` (see `useStackNavigation`) —
 * scrolling/swiping the page moves to the next slide until the last one,
 * then releases the page to scroll normally; scrolling back while still
 * mid-stack steps back one slide at a time rather than racing through all
 * of them. A left/right arrow pair flanks the pill row (rather than
 * DesktopStack's up/down pair), matching the horizontal slide direction.
 *
 * `revealChildren`/`isActive` are wired the same way DesktopStack wires them
 * to its cards — every slide's text cascades in per-element via the shared
 * `.enterOnActive` the moment it becomes current (including slide 0, once
 * the slider has actually scrolled into view — see `hasEnteredView`), and
 * only the current slide's video autoplays — so advancing a slide here
 * looks and behaves identically to advancing a card there.
 */
function MobileSlider() {
  const { sectionRef, visible, hasEnteredView, showNext, showPrev, jumpTo } = useStackNavigation(TOTAL_CARDS);
  const index = visible - 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      showNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      showPrev();
    }
  };

  return (
    <div
      ref={sectionRef}
      className={styles.mobileSlider}
      onKeyDown={handleKeyDown}
      role="group"
      aria-roledescription="carousel"
      aria-label="Platform surfaces"
    >
      {PLATFORM_SURFACE_CARDS.map((card, i) => {
        const offset = i - index;
        const isCurrent = offset === 0;
        return (
          <div
            key={card.id}
            className={styles.mobileSlide}
            data-active={isCurrent && hasEnteredView}
            style={{ transform: `translateX(${offset * 100}%)`, opacity: isCurrent ? 1 : 0 }}
            aria-hidden={!isCurrent}
          >
            <CardPanel card={card} revealChildren isActive={isCurrent} />
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
          <ChevronIcon direction="left" />
        </button>
        <div className={styles.dots}>
          {PLATFORM_SURFACE_CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : i < index ? styles.dotSeen : ""}`}
              aria-label={`Show ${card.category.toLowerCase()} surface`}
              aria-current={i === index}
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
          <ChevronIcon direction="right" />
        </button>
      </div>
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
  // Tablet (iPad etc., >=768px) gets the same scroll-driven stack as
  // desktop, not the plain mobile list — only true mobile widths and the
  // reduced-motion fallback fall through to the simpler layouts below.
  const isTabletUp = useIsTabletUp();
  const prefersReducedMotion = usePrefersReducedMotion();
  const useStack = isTabletUp && !prefersReducedMotion;
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="platform-surfaces-stacked-heading"
    >
      <div className={styles.heading}>
        <AnimatedHeading
          as="p"
          text={PLATFORM_SURFACES_HEADING.title}
          id="platform-surfaces-stacked-heading"
          className={styles.headingLine1}
        />
        <AnimatedHeading as="p" text={PLATFORM_SURFACES_HEADING.subtitle} className={styles.headingLine2} />
      </div>

      {useStack ? <DesktopStack /> : isTabletUp ? <StaticList /> : <MobileSlider />}
    </section>
  );
}
