// Design tokens for the paper-inspired documentation system.
// This file is the single source of truth for the docs visual system.
// Do not re-declare these tokens in component styles or CSS.

export const PAPER = {
  // Warm parchment / ivory page background
  background: "#faf8f2",
  // Slightly lighter paper surfaces for reading panels
  surface: "#faf8f2",
  // Slightly raised paper for panels
  surfaceRaised: "#fdfcf8",
  // Dark brown / ink text
  foreground: "#14130f",
  // Muted ink for secondary text
  muted: "#6b6960",
  // Muted foreground line color
  mutedForeground: "#9a978e",
  // Soft warm-gray borders
  border: "rgba(20, 19, 15, 0.14)",
  borderStrong: "rgba(20, 19, 15, 0.22)",
  // Muted terracotta / burnt-orange accent
  primary: "#a45f1b",
  primaryBackground: "rgba(164, 95, 27, 0.10)",
  primaryForeground: "#fbf6e6",
  primaryBorder: "rgba(164, 95, 27, 0.35)",
  // Accent color for calls to action
  accent: "#c67a2b",
  // Soft warm-gray for muted panel backgrounds
  secondary: "#ebe7dc",
  // Soft cream for overlays
  accentBackground: "#f6ede2",
} as const;

// Restricted syntax-highlighting palette for the paper theme.
export const SYNTAX = {
  // Burnt gold keyword
  keyword: "#a45f1b",
  // Sage green string
  string: "#8a9a5b",
  // Cream punctuation
  punctuation: "#c8c5b8",
  // Warm gray operator
  operator: "#8a8679",
  // Warm gray variable
  variable: "#5c594f",
  // Warm gray comment
  comment: "#9a978e",
  // Muted bronze number
  number: "#a45f1b",
  // Muted bronze type
  type: "#5c594f",
} as const;

// Serif and mono stacks used by the paper system.
export const FONT_SERIF = '"Merriweather", "Georgia", "Times New Roman", serif';

export const FONT_SANS = '"Inter", "Helvetica Neue", system-ui, -apple-system, sans-serif';

export const FONT_MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export function paperGrainStyles(): string {
  return `
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 250px 250px;
  `;
}
