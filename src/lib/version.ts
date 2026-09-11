/** Site-level constants and small pure helpers used by the footer and the build-stats script. */

export const SITE_NAME = 'Edward Jakunskas';
export const SITE_URL = 'https://edward-vj.github.io';
export const PLAN_STEP_TOTAL = 9;

/** Short commit label for the footer: seven hex chars or "local". */
export function shortCommit(sha: string | undefined | null): string {
  if (!sha) return 'local';
  const clean = sha.trim();
  return /^[0-9a-f]{7,40}$/i.test(clean) ? clean.slice(0, 7).toLowerCase() : 'local';
}

/** "3 of 9 steps signed off" style label. */
export function stepsLabel(signedOff: number, total: number = PLAN_STEP_TOTAL): string {
  const n = Math.max(0, Math.min(total, Math.floor(signedOff)));
  return `${n} of ${total} steps signed off`;
}
