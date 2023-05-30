import { test, expect } from '@playwright/test';

test('Trade snapshot', async ({ page }) => {
  await page.goto('http://localhost:8000/', { waitUntil: 'networkidle' });
  // await injectAxe(page);
  // await page.waitForSelector('div#trade-content');
  // await page.waitForLoadState('domcontentloaded');
  const error = await page.locator('#networkError');
  await expect(error).toBeVisible();
});
