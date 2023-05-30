import { test, expect } from '@playwright/test';

test('Trade snapshot', async ({ page }) => {
  await wait(30000);
  await page.goto('/trade', { waitUntil: 'networkidle' });
  await wait(30000);
  // await injectAxe(page);
  // await page.waitForSelector('div#trade-content');
  // await page.waitForLoadState('domcontentloaded');
  const error = await page.locator('#networkError');
  await wait(30000);
  await expect(error).toBeVisible();
});

export const wait = async (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));
