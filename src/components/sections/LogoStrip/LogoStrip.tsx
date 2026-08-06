import { Fragment } from "react";
import { LOGO_GROUPS, type LogoMark, type LogoMarkGroup } from "../../../data/logoMarks";
import styles from "./LogoStrip.module.css";

function Mark({ mark }: { mark: LogoMark }) {
  return (
    <svg
      className={styles.mark}
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

function MarkGroup({ group }: { group: LogoMarkGroup }) {
  if ("dual" in group) {
    const [icon, wordmark] = group.dual;
    return (
      <span className={styles.dual}>
        <Mark mark={icon} />
        <span className={styles.dualWordmark}>
          <Mark mark={wordmark} />
        </span>
      </span>
    );
  }
  return <Mark mark={group} />;
}

/**
 * "Trusted by" logo strip, directly after Hero. The source has no company
 * names, alt text, or links attached to any of these marks — they're
 * abstract Figma vector shapes, not real brand logos — so this is rendered
 * as a purely decorative row. See ASSUMPTIONS.md.
 */
export function LogoStrip() {
  return (
    <div className={styles.strip} aria-hidden="true">
      {LOGO_GROUPS.map((group, gi) => (
        <div className={styles.group} key={gi}>
          {group.map((mark, mi) => (
            <Fragment key={mi}>
              {mi > 0 && <span className={styles.divider} />}
              <MarkGroup group={mark} />
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
