import { test, expect } from '@playwright/test';

test('Strategy overview snapshot', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // await page.locator('#onetrust-accept-btn-handler').dispatchEvent('click');
  // allow cookies - cookie-consent
  // expect(
  await expect(page).toHaveScreenshot('strategy-overview.png');
});
