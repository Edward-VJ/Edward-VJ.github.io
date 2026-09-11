import { test, expect } from '@playwright/test';
import { attachConsoleGuard } from './helpers.ts';

test.describe('smoke', () => {
  test('home renders one h1 with the site name and no console noise', async ({ page }) => {
    const guard = attachConsoleGuard(page);
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Edward Jakunskas');
    expect(guard.messages).toEqual([]);
  });

  test('the 404 page exists and unknown paths are recorded', async ({ page }) => {
    const res = await page.goto('/404.html');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Not found');
    const unknown = await page.goto('/nope-xyz/');
    // astro preview behaviour for unknown paths is recorded in docs/plan/steps/PS-1.md; not asserted.
    test.info().annotations.push({ type: 'preview-unknown-path-status', description: String(unknown?.status()) });
  });

  test('chromium can create a WebGL2 context (needed for the scan game)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'WebGL assertions run on chromium only');
    await page.goto('/');
    const ok = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'));
    expect(ok).toBe(true);
  });
});
