/**
 * Commit-message provenance rules (gate G11). Pure functions; the CLI wrapper is scripts/check-trailers.ts.
 *
 * Every commit must carry:   Plan-Step: PS-n      Sign-off: ...      Co-Authored-By: ...
 * and must NOT carry a session-URL trailer (this repository publishes no session pointers).
 */

export const REQUIRED_TRAILERS = ['Plan-Step', 'Sign-off', 'Co-Authored-By'] as const;
export const FORBIDDEN_TRAILERS = ['Claude-Session'] as const;

const PLAN_STEP_VALUE = /^PS-\d+[a-z]?$/;
export const PR_TITLE_PATTERN = /^PS-\d+[a-z]?: \S/;

/** Return a map of trailer name -> value for lines that look like `Key: value` in the message body. */
export function parseTrailers(message: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const raw of message.split(/\r?\n/)) {
    const line = raw.trim();
    const m = /^([A-Za-z][A-Za-z-]*):\s*(.*)$/.exec(line);
    if (m) out.set(m[1], m[2]);
  }
  return out;
}

/** Problems with one commit message; empty array means it passes. */
export function checkCommitMessage(message: string): string[] {
  const problems: string[] = [];
  const t = parseTrailers(message);
  for (const key of REQUIRED_TRAILERS) {
    if (!t.has(key) || t.get(key)!.trim() === '') problems.push(`missing trailer "${key}"`);
  }
  for (const key of FORBIDDEN_TRAILERS) {
    if (t.has(key)) problems.push(`forbidden trailer "${key}"`);
  }
  const step = t.get('Plan-Step');
  if (step && !PLAN_STEP_VALUE.test(step.trim())) problems.push(`Plan-Step must look like PS-3 or PS-9b, got "${step}"`);
  return problems;
}

/** Problems with a PR title; empty array means it passes. */
export function checkPrTitle(title: string): string[] {
  return PR_TITLE_PATTERN.test(title.trim()) ? [] : [`PR title must start with "PS-n: ", got "${title}"`];
}

/** Split `git log --format=%H%n%B%n<sep>` output into [sha, message] pairs. */
export function splitGitLog(output: string, separator: string = '==END=='): Array<[string, string]> {
  return output
    .split(separator)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => {
      const nl = chunk.indexOf('\n');
      if (nl === -1) return [chunk, ''] as [string, string];
      return [chunk.slice(0, nl).trim(), chunk.slice(nl + 1)] as [string, string];
    });
}
