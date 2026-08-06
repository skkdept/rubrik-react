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
 * present the same 4 pieces of content via different interaction patterns.
 * Ported from the old repo's stacking-cards-section.tsx CARD_DATA.
 */
export const PLATFORM_SURFACE_CARDS: PlatformSurfaceCard[] = [
  {
    id: 0,
    category: "DATA SECURITY",
    title: "Air-gapped, immutable, recoverable to a clean state.",
    description:
      "Protect, monitor, and recover every data set across cloud, on-prem, and SaaS — with preemptive recovery and autonomous restoration ensuring you're ready before an attack lands.",
    stat: "73%",
    statLabel: "Recovery in minutes instead of weeks",
    features: [
      "Pre-calculate clean recovery points before attacks happen",
      "Immutable backups attackers can't encrypt or delete",
      "Rebuild applications and IDPs automatically — no runbooks, no manual intervention",
      "Minimum Viable Business restored in minutes, not weeks",
    ],
  },
  {
    id: 1,
    category: "THREAT DETECTION",
    title: "Real-time threat intelligence across your entire estate.",
    description:
      "Monitor every endpoint, workload, and data flow with continuous threat detection — identifying ransomware, insider threats, and zero-day exploits before they cause damage.",
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
    category: "COMPLIANCE",
    title: "Audit-ready compliance without the manual overhead.",
    description:
      "Maintain continuous compliance across HIPAA, SOC 2, GDPR, and more — with automated evidence collection and real-time policy enforcement across every data source.",
    stat: "80%",
    statLabel: "Reduction in audit preparation time",
    features: [
      "Automated evidence collection for 35+ compliance frameworks",
      "Real-time policy drift detection and remediation",
      "Data classification and sensitivity labeling at scale",
      "Immutable audit trails that satisfy regulatory requirements",
    ],
  },
  {
    id: 3,
    category: "CYBER RESILIENCE",
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
