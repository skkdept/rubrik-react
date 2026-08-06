export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Placeholder Q&A copy — this is literally what exists in the old repo's
 * faq-accordion.tsx (six identical "Question text here?" placeholders). No
 * real FAQ content exists anywhere in the source. See ASSUMPTIONS.md.
 */
export const FAQ_ITEMS: FaqItem[] = [
  { question: "Question text here?", answer: "Answer text goes here." },
  { question: "Question text here?", answer: "Answer text goes here." },
  { question: "Question text here?", answer: "Answer text goes here." },
  { question: "Question text here?", answer: "Answer text goes here." },
  { question: "Question text here?", answer: "Answer text goes here." },
  { question: "Question text here?", answer: "Answer text goes here." },
];
