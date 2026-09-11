/**
 * Console messages tolerated during E2E (gate G9). Every entry carries a dated reason.
 * Games never log at warn/error; performance data goes to window.__<game>.stats instead.
 */
export const CONSOLE_ALLOWLIST: RegExp[] = [
  // 2026-09-11 — three.js logs context loss/restore during the PS-7 context-loss test.
  /^THREE\.WebGLRenderer: Context (Lost|Restored)/,
  // 2026-09-11 — headless Chromium on SwiftShader reports software GL.
  /software WebGL/i,
  /GL Driver Message/,
];

export function isAllowed(text: string): boolean {
  return CONSOLE_ALLOWLIST.some((re) => re.test(text));
}
