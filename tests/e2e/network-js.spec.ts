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
      // Fonts are keyed by URL: WebKit reports a preloaded font twice (preload + use).
      const fonts = new Map<string, number>();
      page.on('request', (req) => {
        if (req.resourceType() === 'script') scripts.push(req.url());
      });
      page.on('response', async (res) => {
        if (res.request().resourceType() === 'font') {
          fonts.set(res.url(), Number(res.headers()['content-length'] ?? 0));
        }
      });
      await page.goto(route, { waitUntil: 'load' });
      await expect(page.locator('h1')).toBeVisible();
      expect(scripts.length, `scripts loaded on ${route}: ${scripts.join(', ')}`).toBeLessThanOrEqual(SCRIPT_ALLOWANCE[route] ?? 0);
      expect(fonts.size, `font files: ${[...fonts.keys()].join(', ')}`).toBeLessThanOrEqual(4);
      expect([...fonts.values()].reduce((n, b) => n + b, 0), 'font bytes').toBeLessThanOrEqual(122_880);
    });
  }
});
