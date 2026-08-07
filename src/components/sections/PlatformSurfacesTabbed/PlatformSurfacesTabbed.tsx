import { useId, useRef, useState } from "react";
import {
  PLATFORM_SURFACE_CARDS,
  PLATFORM_SURFACES_HEADING,
} from "../../../data/platformSurfaces";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import dataCenterImage from "../../../assets/data-center.webp";
import styles from "./PlatformSurfacesTabbed.module.css";

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

export function PlatformSurfacesTabbed() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const card = PLATFORM_SURFACE_CARDS[active];

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
        <p className={styles.headingLine1} id="platform-surfaces-tabbed-heading" data-reveal>
          {PLATFORM_SURFACES_HEADING.title}
        </p>
        <p className={styles.headingLine2} data-reveal>
          {PLATFORM_SURFACES_HEADING.subtitle}
        </p>
      </div>

      <div className={styles.tabBarWrap}>
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
              <h3 className={styles.panelTitle} data-reveal>
                {card.title}
              </h3>
              <p className={styles.panelDescription} data-reveal>
                {card.description}
              </p>
              <ul className={styles.panelFeatures}>
                {card.features.map((feature) => (
                  <li className={styles.panelFeature} data-reveal key={feature}>
                    <span className={styles.panelFeatureDot} aria-hidden="true" />
                    <p className={styles.panelFeatureText}>{feature}</p>
                  </li>
                ))}
              </ul>
            </div>

            <a className={styles.exploreLink} href="#">
              Explore
              <ArrowRightIcon />
            </a>
          </div>

          <div className={styles.panelImage}>
            <img src={dataCenterImage} alt="" loading="lazy" decoding="async" />
            <div className={styles.playAvatarStack}>
              <div className={styles.playCircle} aria-hidden="true">
                <PlayIcon />
              </div>
            </div>
            <div className={styles.panelStatBox} data-reveal>
              <p className={styles.panelStatValue}>{card.stat}</p>
              <p className={styles.panelStatLabel}>{card.statLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
