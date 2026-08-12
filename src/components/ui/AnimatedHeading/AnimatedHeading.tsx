import { createElement, Fragment, useEffect, useRef, useState } from "react";
import styles from "./AnimatedHeading.module.css";

// GSAP-style word-by-word scroll reveal (flip up from below on a 3D
// rotationX, staggered) built with plain CSS transitions + one
// IntersectionObserver instead of GSAP/SplitText. `text` may contain "\n"
// for a manual line break (eg. a two-line headline) — stagger delay stays
// continuous across the break so it still reads as one wave.
export function AnimatedHeading({
  text,
  as = "h2",
  id,
  className,
  staggerMs = 900,
  startDelayMs = 0,
  revealed: controlledRevealed,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
  className?: string;
  staggerMs?: number;
  /** Extra delay before the word wave starts — for headings that must slot
   * into an existing on-mount entrance sequence (eg. Hero) rather than
   * starting the instant they scroll into view. */
  startDelayMs?: number;
  /** When provided, drives the reveal directly instead of the built-in
   * scroll-into-view observer — for callers that need this same per-word
   * flip animation triggered by their own state (eg. a hover/autoplay-
   * driven "active" toggle) rather than scroll position. Unlike the
   * scroll-triggered path (a one-shot reveal), toggling this back to
   * false re-hides the words so they're ready to flip in again next time. */
  revealed?: boolean;
}) {
  const headingRef = useRef<HTMLElement>(null);
  const [autoRevealed, setAutoRevealed] = useState(false);
  const isControlled = controlledRevealed !== undefined;
  const revealed = isControlled ? controlledRevealed : autoRevealed;
  const lines = text.split("\n");
  const totalWords = lines.reduce((sum, line) => sum + line.split(" ").length, 0);

  useEffect(() => {
    if (isControlled) return;
    const el = headingRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAutoRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setAutoRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isControlled]);

  let wordIndex = 0;

  return createElement(
    as,
    { ref: headingRef, id, className },
    <>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <span aria-hidden="true">
        {lines.map((line, li) => {
          const lineWords = line.split(" ");
          return (
            <Fragment key={li}>
              {li > 0 && <br />}
              {lineWords.map((word, wi) => {
                const i = wordIndex++;
                return (
                  <Fragment key={wi}>
                    <span className={styles.word}>
                      <span
                        className={revealed ? `${styles.wordInner} ${styles.wordInnerRevealed}` : styles.wordInner}
                        style={{
                          transitionDelay: `${startDelayMs + (i * staggerMs) / Math.max(totalWords - 1, 1)}ms`,
                        }}
                      >
                        {word}
                      </span>
                    </span>
                    {wi < lineWords.length - 1 ? " " : ""}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </span>
    </>
  );
}
