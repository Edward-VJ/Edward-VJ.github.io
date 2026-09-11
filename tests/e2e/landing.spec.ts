import { test, expect } from '@playwright/test';
import { attachConsoleGuard } from './helpers.ts';

const READ_ROUTES = ['/work/', '/research/', '/gallery/', '/cats/', '/cv/', '/contact/', '/privacy/', '/credits/', '/how-this-was-built/'];

test.describe('landing (PS-2)', () => {
  test('name, links and both doors', async ({ page }) => {
    const guard = attachConsoleGuard(page);
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Edward Jakunskas');
    await expect(page.locator('a[href="https://github.com/Edward-VJ"]')).toHaveCount(1);
    await expect(page.locator('a[href="https://www.linkedin.com/in/edward-jakunskas/"]')).toHaveCount(1);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
    const doors = page.locator('.door');
    await expect(doors).toHaveCount(2);
    for (const href of ['/work/', '/play/']) {
      const res = await page.request.get(href);
      expect(res.status(), href).toBe(200);
    }
    expect(guard.messages).toEqual([]);
  });

  test('every Read route exists with one h1', async ({ page }) => {
    for (const route of READ_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), route).toBe(200);
      await expect(page.locator('h1'), route).toHaveCount(1);
    }
  });

  test('content is visible with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.door')).toHaveCount(2);
    await context.close();
  });

  test('theme toggle persists across reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.getByRole('button', { name: /dark mode/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: /dark mode/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('reduced motion leaves no animations or transitions', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .map((el) => [el.tagName, getComputedStyle(el).animationName, getComputedStyle(el).transitionDuration] as const)
        .filter(([, a, t]) => a !== 'none' || (t !== '0s' && t !== '')),
    );
    expect(offenders).toEqual([]);
  });

  test('the Play door loads its island only on Enter', async ({ page }) => {
    const scripts: string[] = [];
    page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
    await page.goto('/play/', { waitUntil: 'networkidle' });
    const before = scripts.length;
    expect(before).toBeLessThanOrEqual(1);
    await page.getByRole('button', { name: 'Enter' }).click();
    await expect(page.locator('#world[data-island="world"]')).toHaveCount(1);
    expect(scripts.length).toBeGreaterThan(before);
  });
});
