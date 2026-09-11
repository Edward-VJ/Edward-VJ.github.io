import { test, expect } from '@playwright/test';
import { sitemapRoutes } from './helpers.ts';

/** Gate G6 (i): external script requests on load, per route. Routes not listed here allow zero. */
const SCRIPT_ALLOWANCE: Record<string, number> = {
  '/contact/': 1,
  '/research/': 1,
  '/play/': 1,
  '/play/scan/': 1,
  '/play/pong/': 1,
};

test.describe('network JS budget', () => {
  for (const route of sitemapRoutes()) {
    test(`${route} loads at most ${SCRIPT_ALLOWANCE[route] ?? 0} script(s) and ≤ 4 fonts ≤ 120 KB`, async ({ page }) => {
      const scripts: string[] = [];
      const fonts: Array<{ url: string; bytes: number }> = [];
      page.on('request', (req) => {
        if (req.resourceType() === 'script') scripts.push(req.url());
      });
      page.on('response', async (res) => {
        if (res.request().resourceType() === 'font') {
          const len = Number(res.headers()['content-length'] ?? 0);
          fonts.push({ url: res.url(), bytes: len });
        }
      });
      await page.goto(route, { waitUntil: 'networkidle' });
      expect(scripts, `scripts loaded on ${route}: ${scripts.join(', ')}`).toHaveLength(SCRIPT_ALLOWANCE[route] ?? 0);
      expect(fonts.length, 'font files').toBeLessThanOrEqual(4);
      expect(fonts.reduce((n, f) => n + f.bytes, 0), 'font bytes').toBeLessThanOrEqual(122_880);
    });
  }
});
