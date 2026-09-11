/**
 * Gate G12 — hard-rules scanner. Usage: node scripts/hard-rules/index.ts [--no-dist]
 * Exits 1 on any hit. Requires HARD_RULES_DENYLIST (fails if unset or empty).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import {
  classifyPath, isTextFile, scanText, parseDenylist, countAllowMarkers, checkFileName,
  type Hit, type Rule,
} from '../../src/lib/hard-rules.ts';
import { PUBLIC_RULES } from './patterns.ts';

const root = process.cwd();
const ROOTS = ['docs', 'src', 'public', 'tests', 'scripts', 'README.md', 'CLAUDE.md', 'dist'];
const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|tiff?)$/i;

function walk(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(p, out);
    } else out.push(p);
  }
}

const denylist = parseDenylist(process.env.HARD_RULES_DENYLIST);
if (denylist.length === 0) {
  console.error('HARD_RULES_DENYLIST is unset or empty — refusing to run (a forgotten secret must be red, not green).');
  process.exit(1);
}
const rules: Rule[] = [...PUBLIC_RULES, ...denylist];

const files: string[] = [];
for (const r of ROOTS) {
  const p = join(root, r);
  if (!existsSync(p)) continue;
  if (statSync(p).isDirectory()) walk(p, files); else files.push(p);
}

const hits: Hit[] = [];
let allowMarkers = 0;
let scanned = 0;

for (const abs of files) {
  const rel = relative(root, abs).replace(/\\/g, '/');
  hits.push(...checkFileName(rel));
  const scope = classifyPath(rel);
  if (scope === null) continue;

  if (IMAGE_EXT.test(rel) && !rel.startsWith('dist/')) {
    try {
      const meta = await sharp(abs).metadata();
      if (meta.exif || meta.xmp) hits.push({ id: 'image-metadata', file: rel, line: 0, text: rel, description: 'image carries EXIF/XMP metadata' });
    } catch { /* not an image sharp can read; ignore */ }
    continue;
  }
  if (!isTextFile(rel)) continue;
  const text = readFileSync(abs, 'utf8');
  scanned += 1;
  allowMarkers += countAllowMarkers(text);
  hits.push(...scanText(text, rules, { file: rel, fileScope: scope }));
}

// PDF text (CVs) — requires pdftotext (poppler). Fail if PDFs exist and the tool is missing.
const pdfDir = join(root, 'public', 'cv');
if (existsSync(pdfDir)) {
  const pdfs = readdirSync(pdfDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
  for (const pdf of pdfs) {
    let text = '';
    try {
      text = execFileSync('pdftotext', [join(pdfDir, pdf), '-'], { encoding: 'utf8' });
    } catch (e) {
      hits.push({ id: 'pdf-tool', file: `public/cv/${pdf}`, line: 0, text: String(e), description: 'pdftotext unavailable or failed; PDF text could not be checked' });
      continue;
    }
    hits.push(...scanText(text, rules, { file: `public/cv/${pdf} (text)`, fileScope: 'all' }));
  }
}

console.log(`hard-rules: ${scanned} text files scanned, ${rules.length} rules (${denylist.length} private), ${allowMarkers} allow marker(s)`);
if (hits.length > 0) {
  for (const h of hits) console.error(`  [${h.id}] ${h.file}:${h.line}  ${h.description}\n      ${h.text}`);
  console.error(`hard-rules: ${hits.length} hit(s)`);
  process.exit(1);
}
console.log('hard-rules: clean');
