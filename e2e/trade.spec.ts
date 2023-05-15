import { test, expect } from '@playwright/test';

test('Trade snapshot', async ({ page }) => {
  await page.goto('http://localhost:3000/trade');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();

  await expect(page).toHaveScreenshot('trade.png');
});
