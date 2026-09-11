/**
 * Gate G6 (iii) — post-build asset budgets. Usage: node scripts/check-assets.ts
 *  - no image under dist/_astro/ larger than 300 KB
 *  - dist/**\/*.woff2: at most 4 files, 120 KB total, 40 KB each
 *  - inline <script> bytes in every dist/**\/*.html: gzip <= 1024 B per page
 *  - lighthouserc.json URL list (if present) equals the sitemap-derived list
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { parseSitemapPaths, lhciUrlsFromPaths } from '../src/lib/lhci-urls.ts';

const root = process.cwd();
const dist = join(root, 'dist');
if (!existsSync(dist)) { console.error('check-assets: dist/ not found — run the build first'); process.exit(1); }

function walk(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
}
const files: string[] = [];
walk(dist, files);
const problems: string[] = [];

const IMAGE = /\.(png|jpe?g|webp|avif|gif)$/i;
for (const f of files) {
  const rel = relative(root, f).replace(/\\/g, '/');
  if (rel.startsWith('dist/_astro/') && IMAGE.test(rel) && statSync(f).size > 300 * 1024) {
    problems.push(`${rel}: image ${statSync(f).size} B > 300 KB`);
  }
}

const fonts = files.filter((f) => f.toLowerCase().endsWith('.woff2'));
const fontTotal = fonts.reduce((n, f) => n + statSync(f).size, 0);
if (fonts.length > 4) problems.push(`fonts: ${fonts.length} woff2 files > 4`);
if (fontTotal > 122_880) problems.push(`fonts: ${fontTotal} B total > 120 KB`);
for (const f of fonts) if (statSync(f).size > 40_960) problems.push(`${relative(root, f)}: font > 40 KB`);

const INLINE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
for (const f of files.filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  let inline = '';
  let m: RegExpExecArray | null;
  while ((m = INLINE.exec(html)) !== null) inline += m[1];
  const gz = inline ? gzipSync(Buffer.from(inline)).length : 0;
  if (gz > 1024) problems.push(`${relative(root, f)}: inline script ${gz} B gz > 1024`);
}

const sitemap = join(dist, 'sitemap-0.xml');
const lhrc = join(root, 'lighthouserc.json');
if (existsSync(sitemap) && existsSync(lhrc)) {
  const expected = [...lhciUrlsFromPaths(parseSitemapPaths(readFileSync(sitemap, 'utf8')))].sort();
  const actual: string[] = [...(JSON.parse(readFileSync(lhrc, 'utf8')).ci?.collect?.url ?? [])].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`lighthouserc.json URL list differs from the sitemap-derived list (${actual.length} vs ${expected.length})`);
  }
}

console.log(`check-assets: ${files.length} files, ${fonts.length} font(s) ${fontTotal} B, ${problems.length} problem(s)`);
for (const p of problems) console.error('  ' + p);
process.exit(problems.length > 0 ? 1 : 0);
