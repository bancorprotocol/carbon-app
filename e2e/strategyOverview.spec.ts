import { expect } from '@playwright/test';
import { test } from './fixture';

test.describe('Overview strategy', () => {
  test('Strategy overview snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByTestId('strategies').isVisible();
    await page.waitForLoadState('load');
    await page.getByTestId('CreateStrategyHeader');
    await expect(await page.screenshot()).toMatchSnapshot(
      'strategy-overview.png'
    );
  });
});
