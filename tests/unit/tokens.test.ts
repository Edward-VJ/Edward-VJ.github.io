import { describe, it, expect } from 'vitest';
import { LIGHT, DARK, contrastPairs, contrastRatio, luminance, hexToRgb, cssDeclarations } from '../../src/lib/tokens.ts';

describe('colour maths', () => {
  it('parses hex colours including shorthand', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
    expect(() => hexToRgb('#zz')).toThrow();
  });
  it('computes WCAG luminance and contrast', () => {
    expect(luminance('#ffffff')).toBeCloseTo(1, 5);
    expect(luminance('#000000')).toBeCloseTo(0, 5);
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#ffffff')).toBeGreaterThan(4.4);
  });
});

for (const [name, palette] of [['light', LIGHT], ['dark', DARK]] as const) {
  describe(`${name} palette`, () => {
    for (const [label, fg, bg] of contrastPairs(palette)) {
      it(`${label} ≥ 4.5:1`, () => {
        expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
    it('emits one CSS declaration per token', () => {
      const css = cssDeclarations(palette);
      expect(css.split('\n')).toHaveLength(11);
      expect(css).toContain(`--accent: ${palette.accent};`);
      expect(css).toContain(`--on-accent: ${palette.onAccent};`);
    });
  });
}
