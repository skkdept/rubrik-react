import type { CSSProperties, ReactNode } from "react";
import styles from "./Grid.module.css";

interface GridProps {
  children: ReactNode;
  className?: string;
}

/** 12-column desktop / 8-column tablet / 4-column mobile grid, per REWRITE_BRIEF.md. */
export function Grid({ children, className }: GridProps) {
  return <div className={className ? `${styles.grid} ${className}` : styles.grid}>{children}</div>;
}

interface GridItemProps extends GridProps {
  /** Column span at each tier — defaults to spanning every column. */
  columnSpan?: { mobile?: number; tablet?: number; desktop?: number };
}

/** Grid item spanning a fixed column count at each tier, via CSS custom properties. */
export function GridItem({ children, className, columnSpan }: GridItemProps) {
  const style = {
    "--column-span-mobile": columnSpan?.mobile ?? 4,
    "--column-span-tablet": columnSpan?.tablet ?? 8,
    "--column-span-desktop": columnSpan?.desktop ?? 12,
  } as CSSProperties;

  return (
    <div className={className ? `${styles.item} ${className}` : styles.item} style={style}>
      {children}
    </div>
  );
}
