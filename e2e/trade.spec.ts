import { expect } from '@playwright/test';
import { cleanForkTest } from './fixture';

cleanForkTest.describe('Trade page', () => {
  cleanForkTest('Trade snapshot', async ({ page }) => {
    await page.goto('/trade', { waitUntil: 'networkidle' });
    await page.getByTestId('logoAnimation').last().waitFor({ state: 'hidden' });
    await page.getByTestId('orderBookWidgetRate').waitFor({ state: 'visible' });
    await page
      .getByTestId('orderbookCell')
      .last()
      .waitFor({ state: 'attached' });

    await expect(
      await page.screenshot({
        fullPage: true,
        mask: [page.getByTestId('orderBookWidgetRate')],
      })
    ).toMatchSnapshot('trade.png');
  });
});
