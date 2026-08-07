import { Fragment } from "react";
import { LOGO_GROUPS, type LogoMark, type LogoMarkGroup } from "../../../data/logoMarks";
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

/**
 * "Trusted by" logo strip, directly after Hero. No company names, alt
 * text, or links are attached to any of these marks in the source — but
 * they aren't abstract placeholders either: the extracted vector paths
 * render as recognizable real company logos (Adobe, Carhartt, Iron
 * Mountain, Pepsi, a certification seal). See ASSUMPTIONS.md #34.
 *
 * Rendered as a single flat row (not 3 nested group divs, despite the
 * source using 3 — Frame41/42/43) so nowrap + horizontal scroll on
 * narrow viewports has one container to apply to, not three independently
 * wrapping ones. Divider lines appear only between logos within the same
 * source group; the group boundary itself is marked only by a wider gap
 * (32px vs. 24px), matching the source's Frame70 layout exactly, via
 * `groupStart` bumping the gap with an extra margin rather than a divider.
 */
export function LogoStrip() {
  return (
    <div className={styles.strip} aria-hidden="true">
      {LOGO_GROUPS.map((group, gi) =>
        group.map((mark, mi) => (
          <Fragment key={`${gi}-${mi}`}>
            {mi > 0 && <span className={styles.divider} />}
            <MarkGroup group={mark} groupStart={gi > 0 && mi === 0} />
          </Fragment>
        ))
      )}
    </div>
  );
}
