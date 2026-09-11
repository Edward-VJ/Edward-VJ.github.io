/**
 * prebuild / predev — writes src/data/build-stats.json and src/data/last-run.json (both gitignored).
 * Never fails the build: every input has a fallback.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dataDir = join(root, 'src', 'data');
mkdirSync(dataDir, { recursive: true });

function git(args: string[], fallback: string): string {
  try { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return fallback; }
}

const commit = git(['rev-parse', 'HEAD'], 'unknown');
const commitCount = Number.parseInt(git(['rev-list', '--count', 'HEAD'], '0'), 10) || 0;

interface StepSummary { id: string; signedOff: string | null; status: string }
const steps: StepSummary[] = [];
const stepsDir = join(root, 'docs', 'plan', 'steps');
if (existsSync(stepsDir)) {
  for (const f of readdirSync(stepsDir).filter((n) => n.endsWith('.md')).sort()) {
    const text = readFileSync(join(stepsDir, f), 'utf8');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? '';
    const get = (key: string): string | null => {
      const m = new RegExp(`^${key}:\\s*(.*)$`, 'm').exec(fm);
      if (!m) return null;
      const v = m[1].trim().replace(/^["']|["']$/g, '');
      return v === '' || v === 'null' ? null : v;
    };
    steps.push({ id: get('step') ?? f.replace(/\.md$/, ''), signedOff: get('signedOff'), status: get('status') ?? 'planned' });
  }
}

let unitTests = 0;
let e2eTests = 0;
let source = 'example';
const vitestJson = join(root, 'coverage', 'vitest-results.json');
const pwJson = join(root, 'playwright-report', 'results.json');
try {
  if (existsSync(vitestJson)) { unitTests = Number(JSON.parse(readFileSync(vitestJson, 'utf8')).numTotalTests ?? 0); source = 'last-run'; }
  if (existsSync(pwJson)) {
    const r = JSON.parse(readFileSync(pwJson, 'utf8'));
    const s = r.stats ?? {};
    e2eTests = Number((s.expected ?? 0) + (s.unexpected ?? 0) + (s.flaky ?? 0) + (s.skipped ?? 0));
    source = 'last-run';
  }
} catch { /* fall through to example */ }
if (source === 'example') {
  const ex = join(dataDir, 'last-run.example.json');
  if (existsSync(ex)) { const j = JSON.parse(readFileSync(ex, 'utf8')); unitTests = j.unitTests ?? 0; e2eTests = j.e2eTests ?? 0; }
}

writeFileSync(join(dataDir, 'build-stats.json'), JSON.stringify({ commit, commitCount, generatedAt: new Date().toISOString(), steps }, null, 2) + '\n');
writeFileSync(join(dataDir, 'last-run.json'), JSON.stringify({ unitTests, e2eTests, source }, null, 2) + '\n');
console.log(`build-stats: commit ${commit.slice(0, 7)} (${commitCount}), ${steps.length} step file(s), tests ${unitTests}/${e2eTests} (${source})`);
