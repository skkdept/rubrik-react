/**
 * Canonical breakpoint values. Not documented in Guidelines.md — conventional
 * values chosen per REWRITE_BRIEF.md, logged in ASSUMPTIONS.md, flagged for
 * design to confirm. CSS media queries can't consume custom properties as the
 * query condition itself, so these literal px values are duplicated in each
 * component's CSS Module — keep both in sync if these ever change.
 */
export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1200,
} as const;

export type BreakpointName = "mobile" | "tablet" | "desktop";
