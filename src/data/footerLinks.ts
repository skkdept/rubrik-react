export interface FooterColumn {
  heading: string;
  links: string[];
}

/** Ported verbatim from the old repo's generated HomePage/index.tsx footer. */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      "Data Security Posture Management",
      "Ransomware Protection",
      "Cyber Recovery",
      "Threat Analytics",
      "Data Observability",
      "Cloud Data Security",
      "Microsoft 365 Security",
      "Backup & Recovery",
    ],
  },
  {
    heading: "Resources",
    links: [
      "Blog",
      "Case Studies",
      "Webinars & Events",
      "White Papers",
      "Documentation",
      "Community",
      "Support Portal",
      "Trust Center",
    ],
  },
  {
    heading: "Solutions",
    links: [
      "Healthcare",
      "Financial Services",
      "Government & Public Sector",
      "Energy & Utilities",
      "Retail & Manufacturing",
      "Ransomware Recovery",
      "Compliance & Governance",
      "Business Continuity",
    ],
  },
  {
    heading: "Company",
    links: [
      "About Rubrik",
      "Leadership Team",
      "Careers",
      "Partners & Integrations",
      "Newsroom",
      "Investor Relations",
      "Contact Us",
      "Security Disclosures",
    ],
  },
];

export const FOOTER_LEGAL_LINKS = [
  "Privacy Policy",
  "Cookie Settings",
  "Terms of Use",
  "Trust Center",
  "Sitemap",
  "Accessibility",
];
