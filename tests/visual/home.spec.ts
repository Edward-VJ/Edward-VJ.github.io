import { test, expect } from '@playwright/test';

/**
 * Gate G10 — visual baselines. Generate/update ONLY inside the Playwright container:
 *   docker run --rm -v "$PWD":/work -w /work --ipc=host mcr.microsoft.com/playwright:v1.63.0-noble npx playwright test tests/visual --update-snapshots
 */
for (const scheme of ['light', 'dark'] as const) {
  test(`home — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page).toHaveScreenshot(`home-${scheme}.png`, { fullPage: true, mask: [page.locator('canvas')] });
  });
}
