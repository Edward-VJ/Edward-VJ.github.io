import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { sitemapRoutes, attachConsoleGuard } from '../e2e/helpers.ts';

test.describe('accessibility (gate G4)', () => {
  for (const route of sitemapRoutes()) {
    test(`${route} has no axe violations (wcag2a, wcag2aa)`, async ({ page }) => {
      const guard = attachConsoleGuard(page);
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(guard.messages).toEqual([]);
    });
  }
});
