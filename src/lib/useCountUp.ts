import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const DURATION_MS = 1400;

/**
 * Animates 0 -> target every time `trigger` transitions to true (replays on
 * re-entry, not just once-ever) — driven by an external trigger rather than
 * its own per-element IntersectionObserver so a whole group of counters
 * (e.g. every card in a masonry grid) can be started from one shared "is
 * the grid in view" signal. See ASSUMPTIONS.md for why:
 * - Shared trigger: a card sitting lower in a masonry grid (pushed down by
 *   a taller neighbor) would otherwise start hundreds of pixels of scroll
 *   later than the others, reading as "this one's delayed."
 * - Replays on every re-entry rather than once-ever: a one-shot trigger
 *   that had already fired during earlier scrolling (testing other
 *   sections, scrolling past and back) permanently shows the static final
 *   value with no way to see it animate again short of a full page reload.
 */
export function useCountUp(target: number, trigger: boolean): number {
  const [value, setValue] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
    if (!trigger) {
      setValue(0);
      return;
    }

    let rafId: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      // Linear, not eased: see ASSUMPTIONS.md — an eased curve reaches a
      // small target's final rounded value well before time is up, which
      // reads as "it just splashes" rather than visibly counting.
      setValue(Math.round(target * progress));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, trigger, prefersReducedMotion]);

  return value;
}
