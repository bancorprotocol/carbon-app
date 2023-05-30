import { test, expect } from '@playwright/test';
import { wait } from '../src/utils/helpers';

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
