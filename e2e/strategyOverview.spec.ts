import { test, expect } from '@playwright/test';

test.describe('Overview strategy', () => {
  test('Strategy overview snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#strategies').isVisible();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveScreenshot('strategy-overview.png');
  });
});
