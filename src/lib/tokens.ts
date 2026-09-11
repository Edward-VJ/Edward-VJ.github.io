/**
 * Design tokens: one accent (the CV's deep green), warm-grey neutrals with a green bias,
 * a full light palette and a full dark palette. The CSS custom properties in BaseLayout are
 * generated from these values so the contrast test and the stylesheet cannot drift apart.
 */

export interface Palette {
  ground: string;
  surface: string;
  surface2: string;
  ink: string;
  ink2: string;
  muted: string;
  line: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  codeBg: string;
}

export const LIGHT: Palette = {
  ground: '#f6f7f4',
  surface: '#ffffff',
  surface2: '#eef2ee',
  ink: '#1a201d',
  ink2: '#4c5852',
  muted: '#5c6862',
  line: '#d6ddd8',
  accent: '#1e6150',
  onAccent: '#ffffff',
  accentSoft: '#dcebe4',
  codeBg: '#eaefeb',
};

export const DARK: Palette = {
  ground: '#111514',
  surface: '#181d1b',
  surface2: '#1f2623',
  ink: '#e7ece9',
  ink2: '#b4bfb9',
  muted: '#98a49e',
  line: '#2c3531',
  accent: '#6fc1a5',
  onAccent: '#0f1a16',
  accentSoft: '#1c2f28',
  codeBg: '#1d2422',
};

/** Pairs that must meet WCAG AA text contrast (≥ 4.5:1) in each theme: [foreground, background]. */
export function contrastPairs(p: Palette): Array<[string, string, string]> {
  return [
    ['ink on ground', p.ink, p.ground],
    ['ink-2 on ground', p.ink2, p.ground],
    ['muted on ground', p.muted, p.ground],
    ['ink on surface', p.ink, p.surface],
    ['ink on surface-2', p.ink, p.surface2],
    ['accent (links) on ground', p.accent, p.ground],
    ['accent on surface', p.accent, p.surface],
    ['on-accent on accent', p.onAccent, p.accent],
    ['ink on accent-soft', p.ink, p.accentSoft],
    ['ink on code-bg', p.ink, p.codeBg],
  ];
}

const CSS_NAMES: Record<keyof Palette, string> = {
  ground: '--ground',
  surface: '--surface',
  surface2: '--surface-2',
  ink: '--ink',
  ink2: '--ink-2',
  muted: '--muted',
  line: '--line',
  accent: '--accent',
  onAccent: '--on-accent',
  accentSoft: '--accent-soft',
  codeBg: '--code-bg',
};

/** `--name: value;` declarations for a palette, one per line. */
export function cssDeclarations(p: Palette): string {
  return (Object.keys(CSS_NAMES) as Array<keyof Palette>).map((k) => `${CSS_NAMES[k]}: ${p[k]};`).join('\n');
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`bad hex colour: ${hex}`);
  return [Number.parseInt(full.slice(0, 2), 16), Number.parseInt(full.slice(2, 4), 16), Number.parseInt(full.slice(4, 6), 16)];
}

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, ≥ 1. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
