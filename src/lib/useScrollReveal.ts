import { useEffect, type RefObject } from "react";

const STAGGER_MS = 160;

/**
 * Scopes the sitewide fade+slide-up reveal to whatever section owns
 * `containerRef` — each call gets its own IntersectionObserver, rather than
 * one global document-wide sweep. Attach `data-reveal` to any element inside
 * the container that should animate in on first viewport entry; elements are
 * staggered by DOM order within each intersection batch.
 */
export function useScrollReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!targets.length) return;

    targets.forEach((el) => el.classList.add("scroll-reveal"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    let batchIndex = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${batchIndex * STAGGER_MS}ms`;
          el.classList.add("is-revealed");
          observer.unobserve(el);
          batchIndex += 1;
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef]);
}
