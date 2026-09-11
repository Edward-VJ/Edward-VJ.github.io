import { describe, it, expect } from 'vitest';
import { SITE_NAME, SITE_URL, PLAN_STEP_TOTAL, shortCommit, stepsLabel } from '../../src/lib/version.ts';

describe('version helpers', () => {
  it('exports the site identity', () => {
    expect(SITE_NAME).toBe('Edward Jakunskas');
    expect(SITE_URL).toBe('https://edward-vj.github.io');
    expect(PLAN_STEP_TOTAL).toBe(9);
  });

  it('shortens a commit sha to seven lowercase chars', () => {
    expect(shortCommit('ABCDEF1234567890abcdef1234567890abcdef12')).toBe('abcdef1');
    expect(shortCommit('abc1234')).toBe('abc1234');
  });

  it('falls back to "local" for missing or malformed shas', () => {
    expect(shortCommit(undefined)).toBe('local');
    expect(shortCommit(null)).toBe('local');
    expect(shortCommit('')).toBe('local');
    expect(shortCommit('unknown')).toBe('local');
    expect(shortCommit('abc')).toBe('local');
  });

  it('formats the steps label and clamps out-of-range values', () => {
    expect(stepsLabel(3)).toBe('3 of 9 steps signed off');
    expect(stepsLabel(0)).toBe('0 of 9 steps signed off');
    expect(stepsLabel(42)).toBe('9 of 9 steps signed off');
    expect(stepsLabel(-1)).toBe('0 of 9 steps signed off');
    expect(stepsLabel(2.9, 4)).toBe('2 of 4 steps signed off');
  });
});
