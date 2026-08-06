import { useMediaQuery } from "./useMediaQuery";
import { BREAKPOINTS } from "./breakpoints";

/** True at tablet width and up (>=768px). */
export function useIsTabletUp(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.tablet}px)`);
}

/** True at desktop width and up (>=1200px). */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
}
