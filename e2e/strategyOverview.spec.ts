import { test, expect } from '@playwright/test';

test('Strategy overview snapshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.waitForSelector('div#strategies');

  await expect(page).toHaveScreenshot('strategy-overview.png');
});
