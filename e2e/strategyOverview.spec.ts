import { expect } from '@playwright/test';
import { cleanForkTest } from './fixture';

cleanForkTest.describe('Overview strategy', () => {
  cleanForkTest('Strategy overview snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByTestId('strategies').isVisible();
    await page.waitForLoadState('load');
    await page.getByTestId('CreateStrategyHeader');
    await page.getByTestId('logoAnimation').last().waitFor({ state: 'hidden' });

    await expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      'strategy-overview.png'
    );
  });
});
