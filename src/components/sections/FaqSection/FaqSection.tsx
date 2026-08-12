import { useEffect, useId, useRef, useState } from "react";
import { FAQ_ITEMS } from "../../../data/faq";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import { AnimatedHeading } from "../../ui/AnimatedHeading/AnimatedHeading";
import styles from "./FaqSection.module.css";

function AccordionItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const baseId = useId();

  useEffect(() => {
    if (contentRef.current) setMeasuredHeight(contentRef.current.scrollHeight);
  }, [answer]);

  return (
    <div className={styles.item}>
      <div className={open ? `${styles.divider} ${styles.dividerOpen}` : styles.divider} />

      <h3 className={styles.itemHeading}>
        <button
          type="button"
          id={`${baseId}-trigger`}
          className={open ? `${styles.trigger} ${styles.triggerOpen}` : styles.trigger}
          aria-expanded={open}
          aria-controls={`${baseId}-panel`}
          onClick={onToggle}
        >
          <span className={styles.question}>{question}</span>
          <span className={styles.iconWrap} aria-hidden="true">
            <span className={styles.iconBar} />
            <span className={styles.iconBarVertical} />
          </span>
        </button>
      </h3>

      <div
        id={`${baseId}-panel`}
        role="region"
        aria-labelledby={`${baseId}-trigger`}
        className={styles.panel}
        style={{ maxHeight: open ? measuredHeight : 0 }}
      >
        <div ref={contentRef} className={styles.panelContent}>
          <p className={styles.answer}>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.intro}>
        <p className={styles.kicker} data-reveal>
          FAQ
        </p>
        <AnimatedHeading text="Everything you need to know." id="faq-heading" className={styles.heading} />
      </div>

      <div className={styles.list}>
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem
            key={i}
            question={item.question}
            answer={item.answer}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
        <div className={styles.closingDivider} />
      </div>
    </section>
  );
}
