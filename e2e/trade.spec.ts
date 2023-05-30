import { test, expect, chromium } from '@playwright/test';

test('Trade snapshot', async ({ baseURL }) => {
  console.log(baseURL, '-=-=-=-=-=- baseUrl -=-=-=-=-=-');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });

  // await injectAxe(page);
  // await page.waitForSelector('div#trade-content');
  // await page.waitForLoadState('domcontentloaded');
  const error = await page.locator('#networkError');
  await expect(error).toBeVisible();
});
