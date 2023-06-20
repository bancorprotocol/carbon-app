import { test, expect } from '@playwright/test';

test.describe('Create strategy', () => {
  test.skip('Create strategy snapshot', async ({ page }) => {
    await page.goto(
      '/strategies/create?base=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&quote=0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C&strategyType=recurring&strategySettings=limit',
      { waitUntil: 'networkidle' }
    );
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveScreenshot('strategy-create.png');
  });
});
