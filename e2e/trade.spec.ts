import { test, expect } from '@playwright/test';
import { setupAfterEach, setupBeforeEach } from './test-setup';

test.describe('Trade page', () => {
  test.beforeEach(async ({ page }) => {
    await setupBeforeEach(page);
  });

  test.afterEach(async () => {
    await setupAfterEach();
  });

  test('Trade snapshot', async ({ page }) => {
    await page.goto('/trade');
    await page
      .getByTestId('logo-animation')
      .last()
      .waitFor({ state: 'hidden' });

    await expect(await page.screenshot()).toMatchSnapshot('trade.png');
  });
});
