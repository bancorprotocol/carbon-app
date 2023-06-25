import { expect } from '@playwright/test';
import { test } from './fixture';

test.describe('Trade page', () => {
  test('Trade snapshot', async ({ page }) => {
    await page.goto('/trade');
    await page
      .getByTestId('logo-animation')
      .last()
      .waitFor({ state: 'hidden' });
    await page.waitForLoadState('load');
    await expect(await page.screenshot()).toMatchSnapshot('trade.png');
  });
});
