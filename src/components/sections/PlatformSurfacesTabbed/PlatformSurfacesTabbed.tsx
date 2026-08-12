import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  PLATFORM_SURFACE_CARDS,
  PLATFORM_SURFACES_HEADING,
} from "../../../data/platformSurfaces";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import { usePrefersReducedMotion } from "../../../lib/usePrefersReducedMotion";
import { AnimatedHeading } from "../../ui/AnimatedHeading/AnimatedHeading";
import dataCenterImage from "../../../assets/data-center.webp";
import carharttVideo from "../../../assets/carhartt-snippet.mp4";
import styles from "./PlatformSurfacesTabbed.module.css";

// Matches PlatformSurfacesStacked's own per-element stagger step exactly, so
// a tab switch here and a card/slide advance there read as the same
// animation (see that file's `revealDelay`).
const REVEAL_STEP_MS = 70;

function revealDelay(step: number): CSSProperties {
  return { animationDelay: `${step * REVEAL_STEP_MS}ms` };
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.92 7h8.17M7.58 3.5 11.08 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6.5 4.5v11l9-5.5-9-5.5Z" fill="#12201F" />
    </svg>
  );
}

/**
 * A single video (a Carhartt customer story clip) stands in for every
 * card's play button for now — there's no per-category video content yet,
 * so this isn't wired through `platformSurfaces` data. Lives in its own
 * component (rather than inline) so its `playing` state resets whenever
 * the parent's `key={active}` remounts it on tab switch, instead of
 * carrying a played video over to a different, unrelated card.
 *
 * Autoplays muted (browsers block unmuted autoplay without a user gesture
 * — `controls` stays on so the user can unmute or pause). The `muted`/
 * `autoPlay` JSX props alone weren't reliably enough for Chromium to
 * actually start playback on mount (the element ends up in the document
 * with both set, `readyState` fully loaded, yet still paused) — calling
 * `.play()` imperatively once the element exists is the version that
 * actually plays. Under prefers-reduced-motion it starts on the static
 * thumbnail instead, requiring an explicit click, consistent with every
 * other autoplaying animation on this site.
 */
function TabPanelImage({ stat, statLabel }: { stat: string; statLabel: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!prefersReducedMotion);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [playing]);

  return (
    <div className={styles.panelImage}>
      {playing ? (
        <video ref={videoRef} className={styles.panelVideo} src={carharttVideo} controls muted playsInline />
      ) : (
        <>
          <img src={dataCenterImage} alt="" loading="lazy" decoding="async" />
          <div className={styles.playAvatarStack}>
            <button
              type="button"
              className={styles.playCircle}
              aria-label="Play video"
              onClick={() => setPlaying(true)}
            >
              <PlayIcon />
            </button>
          </div>
        </>
      )}
      {/* Slides in the moment playback actually starts, rather than sitting
          there statically or competing with the thumbnail's play button. */}
      <div
        className={playing ? `${styles.panelStatBox} ${styles.panelStatBoxSlideIn}` : styles.panelStatBox}
      >
        <p className={styles.panelStatValue}>{stat}</p>
        <p className={styles.panelStatLabel}>{statLabel}</p>
      </div>
    </div>
  );
}

export function PlatformSurfacesTabbed() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const card = PLATFORM_SURFACE_CARDS[active];

  // Gates the panel text's per-element fade-in (see .panelReveal below) so
  // the very first panel — mounted as part of the initial page render,
  // usually well below the fold — doesn't play and finish its entrance
  // off-screen before the user ever scrolls to it. By the time any tab is
  // clicked the section is necessarily already in view, so this is already
  // true, and every subsequent switch replays the animation immediately:
  // `key={active}` fully remounts the panel's DOM nodes on every switch, and
  // a CSS `animation` (unlike a `transition`) always plays on an element the
  // moment it's inserted — no re-triggering logic needed. (The old approach
  // relied on the sitewide `data-reveal`/useScrollReveal one-shot observer,
  // which only ever wired up the very first panel's elements and silently
  // never fired again on later tab switches.)
  //
  // Observes `revealAnchorRef` (the tab bar, right above the panel), NOT the
  // whole `<section>` — the section also includes the heading and a
  // 540px-tall image, so a 10%-of-the-whole-section threshold was
  // satisfied while just the heading peeked into view, firing (and fully
  // finishing, 500ms later) while the actual title/description were still
  // hundreds of pixels below the fold. The tab bar sits immediately above
  // the panel, so it becoming visible closely tracks the panel itself
  // being about to enter view. A deep `-40%` bottom rootMargin (rather than
  // a small threshold) requires the tab bar to reach well into the upper
  // part of the viewport before firing, not just barely peek into the
  // bottom edge — matches PlatformSurfacesStacked's own `hasEnteredView`.
  const revealAnchorRef = useRef<HTMLDivElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  useEffect(() => {
    const el = revealAnchorRef.current;
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

  const focusTab = (index: number) => {
    const wrapped = (index + PLATFORM_SURFACE_CARDS.length) % PLATFORM_SURFACE_CARDS.length;
    setActive(wrapped);
    tabRefs.current[wrapped]?.focus();
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(PLATFORM_SURFACE_CARDS.length - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="platform-surfaces-tabbed-heading"
    >
      <div className={styles.heading}>
        <AnimatedHeading
          as="p"
          text={PLATFORM_SURFACES_HEADING.title}
          id="platform-surfaces-tabbed-heading"
          className={styles.headingLine1}
        />
        <AnimatedHeading as="p" text={PLATFORM_SURFACES_HEADING.subtitle} className={styles.headingLine2} />
      </div>

      <div className={styles.tabBarWrap} ref={revealAnchorRef}>
        <div className={styles.tabBar} role="tablist" aria-label="Platform surfaces" onKeyDown={handleTabKeyDown}>
          {PLATFORM_SURFACE_CARDS.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={isActive ? 0 : -1}
                className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                onClick={() => setActive(i)}
              >
                {isActive && <span className={styles.tabDot} aria-hidden="true" />}
                <span className={styles.tabLabel} data-reveal>
                  {c.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={active}
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className={styles.panelWrap}
      >
        <div className={styles.panel}>
          <div className={styles.panelText}>
            <div className={styles.panelTextTop}>
              <h3
                className={hasEnteredView ? `${styles.panelTitle} ${styles.panelReveal}` : styles.panelTitle}
                style={hasEnteredView ? revealDelay(0) : undefined}
              >
                {card.title}
              </h3>
              <p
                className={hasEnteredView ? `${styles.panelDescription} ${styles.panelReveal}` : styles.panelDescription}
                style={hasEnteredView ? revealDelay(1) : undefined}
              >
                {card.description}
              </p>
              <ul className={styles.panelFeatures}>
                {card.features.map((feature, i) => (
                  <li
                    className={hasEnteredView ? `${styles.panelFeature} ${styles.panelReveal}` : styles.panelFeature}
                    style={hasEnteredView ? revealDelay(2 + i) : undefined}
                    key={feature}
                  >
                    <span className={styles.panelFeatureDot} aria-hidden="true" />
                    <p className={styles.panelFeatureText}>{feature}</p>
                  </li>
                ))}
              </ul>
            </div>

            <a
              className={hasEnteredView ? `${styles.exploreLink} ${styles.panelReveal}` : styles.exploreLink}
              style={hasEnteredView ? revealDelay(2 + card.features.length) : undefined}
              href="#"
            >
              Explore
              <ArrowRightIcon />
            </a>
          </div>

          <TabPanelImage stat={card.stat} statLabel={card.statLabel} />
        </div>
      </div>
    </section>
  );
}
