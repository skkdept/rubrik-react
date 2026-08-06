import * as paths from "./logoMarkPaths";

export interface LogoMarkPath {
  d: string;
  opacity?: number;
}

export interface LogoMark {
  width: number;
  height: number;
  paths: LogoMarkPath[];
}

/** A "wordmark" mark paired with a small icon mark, positioned side by side. */
export type LogoMarkGroup = LogoMark | { dual: [LogoMark, LogoMark] };

const sharedBar: LogoMark = { width: 48.995, height: 11.9379, paths: [{ d: paths.p96b6680 }] };

// Reused verbatim across all 3 rows in the source.
const triVector: LogoMark = {
  width: 23.1219,
  height: 18.4723,
  paths: [
    { d: paths.p141338f0, opacity: 0.75 },
    { d: paths.p191fb400, opacity: 0.75 },
    { d: paths.p32d9f580, opacity: 0.75 },
  ],
};

/**
 * 3 groups of 5 marks each, laid out side by side in a single row, matching
 * the old repo's Frame41/42/43. All are abstract vector shapes (no company
 * names attached in the source) — see ASSUMPTIONS.md.
 */
export const LOGO_GROUPS: LogoMarkGroup[][] = [
  [
    sharedBar,
    { width: 79.2305, height: 11.6325, paths: [{ d: paths.p2a5a8800 }] },
    { dual: [triVector, { width: 46.5791, height: 15.9932, paths: [{ d: paths.p32cc4f00 }] }] },
    { width: 20.5547, height: 20.5537, paths: [{ d: paths.pffec780 }] },
    { width: 17.5226, height: 38.6524, paths: [{ d: paths.p3f317600 }] },
  ],
  [
    sharedBar,
    { width: 79.1758, height: 11.6394, paths: [{ d: paths.p262c4000 }] },
    { dual: [triVector, { width: 46.5791, height: 15.9932, paths: [{ d: paths.pe62e600 }] }] },
    { width: 20.5537, height: 20.5547, paths: [{ d: paths.p180117f0 }] },
    { width: 17.5236, height: 38.6524, paths: [{ d: paths.p2c140c80 }] },
  ],
  [
    sharedBar,
    { width: 79.2441, height: 11.6297, paths: [{ d: paths.p2c117530 }] },
    { dual: [triVector, { width: 46.58, height: 15.9932, paths: [{ d: paths.p2fa70000 }] }] },
    { width: 20.5537, height: 20.5537, paths: [{ d: paths.p2654d3f0 }] },
    { width: 17.5226, height: 38.6524, paths: [{ d: paths.p1d36de00 }] },
  ],
];
