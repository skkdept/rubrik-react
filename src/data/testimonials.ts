export interface Testimonial {
  id: number;
  stat: string;
  quote: string;
  name: string;
  role: string;
  /** Horizontal crop offset for the shared headshot image, per source card. */
  imageOffset: string;
}

/** Ported from the old repo's expandable-card-carousel.tsx CARDS. */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 0,
    stat: "22%",
    quote: "Rubrik gives us the confidence that our data is protected, no matter what happens.",
    name: "Samantha Dengate",
    role: "VP of IT Security, Mandiant",
    imageOffset: "-110.27%",
  },
  {
    id: 1,
    stat: "73%",
    quote: "Recovery in minutes instead of weeks — Rubrik transformed how we think about resilience.",
    name: "James Harrington",
    role: "CISO, Global FinTech Corp",
    imageOffset: "-70%",
  },
  {
    id: 2,
    stat: "99.9%",
    quote:
      "Our team can now focus on real threats instead of backup management. Rubrik changed everything.",
    name: "Priya Nair",
    role: "Head of Security, Synapse Health",
    imageOffset: "-140%",
  },
  {
    id: 3,
    stat: "4×",
    quote:
      "We recovered from a ransomware attack in four hours. Previously that would have taken weeks.",
    name: "Marcus Chen",
    role: "VP Infrastructure, TechScale",
    imageOffset: "-90%",
  },
];
