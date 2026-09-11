/**
 * Hard-rules scanner core (gate G12). Pure functions over strings; the CLI wrapper in
 * scripts/hard-rules/ walks files, reads the denylist secret, and runs the non-text checks.
 *
 * Scopes:
 *   all   — every scanned text file, built HTML and PDF text
 *   docs  — prose only: docs/**, src/content/**, README.md, CLAUDE.md, public/humans.txt
 *   dist  — built HTML only (dist/**\/*.html)
 */

export type Scope = 'all' | 'docs' | 'dist';

export interface Rule {
  id: string;
  regex: RegExp;
  scope: Scope;
  description: string;
}

export interface Hit {
  id: string;
  file: string;
  line: number;
  text: string;
  description: string;
}

export interface ScanOptions {
  file: string;
  fileScope: Scope;
}

export const ALLOW_MARKER = /hard-rules:\s*allow\s+([A-Za-z0-9_.*-]+)/;

/** Which rule scopes apply to a file that itself is classified as `fileScope`. */
export function scopesFor(fileScope: Scope): Scope[] {
  if (fileScope === 'docs') return ['all', 'docs'];
  if (fileScope === 'dist') return ['all', 'dist'];
  return ['all'];
}

/** Classify a repository-relative path. Returns null for files the scanner never reads. */
export function classifyPath(relPath: string): Scope | null {
  const p = relPath.replace(/\\/g, '/');
  if (p.startsWith('node_modules/') || p.startsWith('.git/')) return null;
  if (p.startsWith('scripts/hard-rules/') || p === 'scripts/check-trailers.ts' || p === 'src/lib/trailers.ts' || p === 'src/lib/hard-rules.ts' || p.startsWith('tests/unit/hard-rules') || p.startsWith('tests/unit/trailers')) return null;
  if (p.startsWith('dist/')) return p.endsWith('.html') ? 'dist' : null;
  if (p.startsWith('docs/') || p.startsWith('src/content/') || p === 'README.md' || p === 'CLAUDE.md' || p === 'public/humans.txt') return 'docs';
  if (p.startsWith('src/') || p.startsWith('public/') || p.startsWith('tests/') || p.startsWith('scripts/')) return 'all';
  return null;
}

const TEXT_EXT = /\.(md|mdx|txt|json|ya?ml|ts|mts|cts|js|mjs|cjs|astro|html|css|svg|xml|properties|toml|csv)$/i;
export function isTextFile(relPath: string): boolean {
  return TEXT_EXT.test(relPath) || /(^|\/)(README|LICENSE|NOTICE|CLAUDE)(\.md)?$/i.test(relPath) || /(^|\/)\.[a-z]+$/i.test(relPath);
}

/** Scan one text against the applicable rules. Lines with an allow marker naming the rule id are skipped for that rule. */
export function scanText(text: string, rules: readonly Rule[], opts: ScanOptions): Hit[] {
  const applicable = rules.filter((r) => scopesFor(opts.fileScope).includes(r.scope));
  if (applicable.length === 0) return [];
  const hits: Hit[] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const allow = ALLOW_MARKER.exec(line);
    const allowedId = allow ? allow[1] : null;
    for (const rule of applicable) {
      if (allowedId === rule.id || allowedId === '*') continue;
      rule.regex.lastIndex = 0;
      if (rule.regex.test(line)) {
        hits.push({ id: rule.id, file: opts.file, line: i + 1, text: line.trim().slice(0, 160), description: rule.description });
      }
    }
  }
  return hits;
}

/** Parse the denylist secret: one ECMAScript regex per line, `#` comments and blank lines ignored. */
export function parseDenylist(value: string | undefined): Rule[] {
  if (!value) return [];
  const rules: Rule[] = [];
  let n = 0;
  for (const raw of value.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;
    n += 1;
    rules.push({ id: `denylist-${n}`, regex: new RegExp(line, 'i'), scope: 'all', description: 'private denylist pattern' });
  }
  return rules;
}

/** Count allow markers in a text (reported in the CI summary so allowances stay visible). */
export function countAllowMarkers(text: string): number {
  return (text.match(new RegExp(ALLOW_MARKER.source, 'g')) ?? []).length;
}

export const MODEL_FILE_EXT = /\.(onnx|pt|pth|tflite|safetensors|h5)$/i;
export const BRANDING_ASSET_NAME = /(claude|anthropic)[^/]*\.(svg|png|webp|jpe?g|ico|gif)$/i;

/** File-name level checks that do not need file contents. */
export function checkFileName(relPath: string): Hit[] {
  const p = relPath.replace(/\\/g, '/');
  const hits: Hit[] = [];
  if (MODEL_FILE_EXT.test(p)) hits.push({ id: 'model-file', file: p, line: 0, text: p, description: 'machine-learning model file in the repository' });
  if (BRANDING_ASSET_NAME.test(p)) hits.push({ id: 'branding-asset', file: p, line: 0, text: p, description: 'asset named after Claude/Anthropic' });
  return hits;
}
