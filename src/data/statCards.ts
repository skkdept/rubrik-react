export interface StatCard {
  chip: string;
  stat: string;
  caption: string;
  layout: "tall" | "wide";
  image: string;
  alt: string;
}

/**
 * The old repo's raw generated file renders 5 stat-card slots in a 2-column
 * masonry (1 tall + 1 wide on the left, 3 wide on the right), but only 2 have
 * real content — the other 3 reuse a duplicate caption ("E2E Resilience for
 * M365") with a wrong stat, or reuse the truncated intro heading as a fake
 * stat value. Matching the visual density (5 cards) but authoring real,
 * non-duplicate copy for the 3 extra ones, themed after the same categories
 * used in PlatformSurfaces. See ASSUMPTIONS.md.
 */
export const STAT_CARDS: Omit<StatCard, "image" | "alt">[] = [
  { chip: "AI", stat: "42%", caption: "Secure and Accelerate AI", layout: "tall" },
  { chip: "SaaS", stat: "21%", caption: "E2E Resilience for M365", layout: "wide" },
  { chip: "Cyber Resilience", stat: "90%", caption: "Faster Recovery From Ransomware", layout: "wide" },
  { chip: "Threat Detection", stat: "65%", caption: "Fewer Undetected Threats", layout: "wide" },
  { chip: "Compliance", stat: "3x", caption: "Faster Audit Readiness", layout: "wide" },
];
