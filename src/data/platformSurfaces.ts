export interface PlatformSurfaceCard {
  id: number;
  category: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  features: string[];
}

/**
 * Shared content for PlatformSurfacesStacked and PlatformSurfacesTabbed — both
 * present the same 3 pieces of content via different interaction patterns.
 *
 * Trimmed from the old repo's stacking-cards-section.tsx CARD_DATA (4 cards:
 * Data Security/Threat Detection/Compliance/Cyber Resilience) down to 3, to
 * match this section's own heading ("One Architecture, Three Surfaces." /
 * "Data. Identity. AI."). Real Data/Identity/AI copy has never existed
 * anywhere in the design (see ASSUMPTIONS.md #65) — Compliance was dropped as
 * the weakest fit, and the remaining 3 are relabeled DATA/IDENTITY/AI by
 * category only; the body copy underneath is still the original
 * security-flavored content, not a rewrite for its new label.
 */
export const PLATFORM_SURFACE_CARDS: PlatformSurfaceCard[] = [
  {
    id: 0,
    category: "DATA",
    title: "Air-gapped, immutable, recoverable to a clean state.",
    description:
      "Protect, monitor, and recover every data set across cloud, on-prem, and SaaS, with preemptive recovery and autonomous restoration ensuring you're ready before an attack lands.",
    stat: "73%",
    statLabel: "Recovery in minutes instead of weeks",
    features: [
      "Pre-calculate clean recovery points before attacks happen",
      "Immutable backups attackers can't encrypt or delete",
      "Rebuild applications and IDPs automatically: no runbooks, no manual intervention",
      "Minimum Viable Business restored in minutes, not weeks",
    ],
  },
  {
    id: 1,
    category: "IDENTITY",
    title: "Real-time threat intelligence across your entire estate.",
    description:
      "Monitor every endpoint, workload, and data flow with continuous threat detection, identifying ransomware, insider threats, and zero-day exploits before they cause damage.",
    stat: "99.9%",
    statLabel: "Threat detection accuracy with AI-powered analysis",
    features: [
      "Behavioral analytics to detect anomalous access patterns",
      "Cross-cloud visibility from a single unified dashboard",
      "Automated incident response with configurable playbooks",
      "Integration with SIEM, SOAR, and existing security tooling",
    ],
  },
  {
    id: 2,
    category: "AI",
    title: "Recover from attacks in minutes, not weeks.",
    description:
      "Our AI-powered recovery engine identifies the cleanest restore point, rebuilds your environment autonomously, and gets your business back to operation faster than any manual process.",
    stat: "4×",
    statLabel: "Faster recovery compared to traditional backup solutions",
    features: [
      "Automated orchestration of full environment recovery",
      "Clean room testing to validate recovery before production",
      "Zero-trust network segmentation during recovery",
      "Executive dashboards for board-level cyber resilience reporting",
    ],
  },
];

export const PLATFORM_SURFACES_HEADING = {
  title: "One Architecture, Three Surfaces.",
  subtitle: "Data. Identity. AI. One shared platform.",
};
