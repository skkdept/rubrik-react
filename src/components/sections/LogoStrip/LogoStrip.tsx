import { Fragment } from "react";
import { LOGO_GROUPS, type LogoMark, type LogoMarkGroup } from "../../../data/logoMarks";
import { usePrefersReducedMotion } from "../../../lib/usePrefersReducedMotion";
import styles from "./LogoStrip.module.css";

function Mark({ mark, className }: { mark: LogoMark; className?: string }) {
  return (
    <svg
      className={className ? `${styles.mark} ${className}` : styles.mark}
      style={{ width: mark.width, height: mark.height }}
      viewBox={`0 0 ${mark.width} ${mark.height}`}
      fill="none"
      aria-hidden="true"
    >
      {mark.paths.map((p, i) => (
        <path key={i} d={p.d} fill="#12201F" fillOpacity={0.83 * (p.opacity ?? 1)} />
      ))}
    </svg>
  );
}

function MarkGroup({ group, groupStart }: { group: LogoMarkGroup; groupStart?: boolean }) {
  const gapClass = groupStart ? styles.groupStart : undefined;
  if ("dual" in group) {
    const [icon, wordmark] = group.dual;
    return (
      <span className={gapClass ? `${styles.dual} ${gapClass}` : styles.dual}>
        <Mark mark={icon} />
        <span className={styles.dualWordmark}>
          <Mark mark={wordmark} />
        </span>
      </span>
    );
  }
  return <Mark mark={group} className={gapClass} />;
}

function LogoSequence({ keyPrefix, leadingGroupStart }: { keyPrefix: string; leadingGroupStart?: boolean }) {
  return (
    <>
      {LOGO_GROUPS.map((group, gi) =>
        group.map((mark, mi) => (
          <Fragment key={`${keyPrefix}-${gi}-${mi}`}>
            {mi > 0 && <span className={styles.divider} />}
            <MarkGroup group={mark} groupStart={mi === 0 && (gi > 0 || leadingGroupStart)} />
          </Fragment>
        ))
      )}
    </>
  );
}

/**
 * "Trusted by" logo strip, directly after Hero. No company names, alt
 * text, or links are attached to any of these marks in the source — but
 * they aren't abstract placeholders either: the extracted vector paths
 * render as recognizable real company logos (Adobe, Carhartt, Iron
 * Mountain, Pepsi, a certification seal). See ASSUMPTIONS.md #34.
 *
 * Continuous auto-scrolling marquee: the full sequence is rendered twice
 * back-to-back in one `translateX(-50%)` loop — since copy 2 is pixel-
 * identical to copy 1, the loop point is seamless. Paused on hover/focus so
 * a sighted user can pause it to look, and falls back to the original
 * single-copy, manually-scrollable row under prefers-reduced-motion (no
 * point rendering a duplicate copy that never moves).
 */
export function LogoStrip() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={styles.viewport}>
        <div className={styles.staticStrip} aria-hidden="true">
          <LogoSequence keyPrefix="a" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.viewport}>
      <div className={styles.track} aria-hidden="true">
        <LogoSequence keyPrefix="a" />
        <LogoSequence keyPrefix="b" leadingGroupStart />
      </div>
    </div>
  );
}
