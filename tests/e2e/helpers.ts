import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { parseSitemapPaths } from '../../src/lib/lhci-urls.ts';
import { isAllowed } from './console-allowlist.ts';

/** Site-relative routes from the built sitemap, plus /404.html. Origin is rewritten to baseURL by Playwright. */
export function sitemapRoutes(): string[] {
  const p = join(process.cwd(), 'dist', 'sitemap-0.xml');
  if (!existsSync(p)) throw new Error('dist/sitemap-0.xml not found — build before running E2E');
  return [...parseSitemapPaths(readFileSync(p, 'utf8')), '/404.html'];
}

/** Collect console errors/warnings not covered by the allowlist. Call before navigation. */
export function attachConsoleGuard(page: Page): { messages: string[] } {
  const out = { messages: [] as string[] };
  page.on('console', (msg) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return;
    const text = msg.text();
    if (!isAllowed(text)) out.messages.push(`[${msg.type()}] ${text}`);
  });
  page.on('pageerror', (err) => out.messages.push(`[pageerror] ${err.message}`));
  return out;
}
