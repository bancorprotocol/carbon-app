import { test, expect } from '@playwright/test';

test('Trade snapshot', async ({ page }) => {
  await page.goto('/trade', { waitUntil: 'networkidle' });
  await page.waitForSelector('div#trade-content');
  await expect(page).toHaveScreenshot('trade.png');
});
