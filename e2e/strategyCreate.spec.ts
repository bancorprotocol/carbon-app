import { expect } from '@playwright/test';
import { test } from './fixture';

test.describe.only('Create strategy', () => {
  test('Create strategy snapshot', async ({ page }) => {
    await page.goto(
      '/strategies/create?base=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&quote=0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C&strategyType=recurring&strategySettings=limit',
      { waitUntil: 'load' }
    );
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('load');
    await page.getByTestId('createStrategyPage').waitFor({ state: 'visible' });
    await expect(await page.screenshot()).toMatchSnapshot(
      'strategy-create.png'
    );
  });
});
