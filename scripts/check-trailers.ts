/**
 * Gate G11 — commit provenance. Usage: node scripts/check-trailers.ts [<git range>]
 * Default range: origin/main..HEAD when origin/main exists, else HEAD.
 * Also checks PR_TITLE when that env var is set.
 */
import { execFileSync } from 'node:child_process';
import { checkCommitMessage, checkPrTitle, splitGitLog } from '../src/lib/trailers.ts';

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' });
}

let range = process.argv[2];
if (!range) {
  try {
    git(['rev-parse', '--verify', '--quiet', 'origin/main']);
    range = 'origin/main..HEAD';
  } catch {
    range = 'HEAD';
  }
}
const args = ['log', '--format=%H%n%B%n==END==', ...(range === 'HEAD' ? ['-1', 'HEAD'] : [range])];
const commits = splitGitLog(git(args));

let failed = 0;
for (const [sha, message] of commits) {
  const problems = checkCommitMessage(message);
  if (problems.length > 0) {
    failed += 1;
    console.error(`${sha.slice(0, 7)}: ${problems.join('; ')}`);
  }
}
if (process.env.PR_TITLE) {
  const problems = checkPrTitle(process.env.PR_TITLE);
  if (problems.length > 0) { failed += 1; console.error(problems.join('; ')); }
}
console.log(`check-trailers: ${commits.length} commit(s) in ${range}, ${failed} problem(s)`);
process.exit(failed > 0 ? 1 : 0);
