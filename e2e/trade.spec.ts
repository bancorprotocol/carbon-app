import { test, expect } from '@playwright/test';

test('Trade snapshot', async ({ page }) => {
  await page.goto('http://localhost:3000/trade');
  await expect(page).toHaveScreenshot('strategy-overview.png');
});
