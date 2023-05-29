import { test, expect } from '@playwright/test';

test.skip('Strategy overview snapshot', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('#strategies').isVisible();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveScreenshot('strategy-overview.png');
});
