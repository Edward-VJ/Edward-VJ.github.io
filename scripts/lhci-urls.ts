/**
 * Generate lighthouserc.json from the built sitemap. Usage: node scripts/lhci-urls.ts [--desktop]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseSitemapPaths, lhciUrlsFromPaths, buildLhciConfig } from '../src/lib/lhci-urls.ts';

const root = process.cwd();
const sitemap = join(root, 'dist', 'sitemap-0.xml');
if (!existsSync(sitemap)) { console.error('lhci-urls: dist/sitemap-0.xml not found — run the build first'); process.exit(1); }

const desktop = process.argv.includes('--desktop');
const urls = lhciUrlsFromPaths(parseSitemapPaths(readFileSync(sitemap, 'utf8')));
const config = buildLhciConfig(urls, desktop ? 'desktop' : undefined);
const out = join(root, desktop ? 'lighthouserc.desktop.json' : 'lighthouserc.json');
writeFileSync(out, JSON.stringify(config, null, 2) + '\n');
console.log(`lhci-urls: wrote ${out} with ${urls.length} URL(s)`);
