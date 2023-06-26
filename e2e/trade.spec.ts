import { expect } from '@playwright/test';
import { test } from './fixture';

test.describe.only('Trade page', () => {
  test('Trade snapshot', async ({ page }) => {
    await page.goto('/trade');
    await page.getByTestId('logoAnimation').last().waitFor({ state: 'hidden' });
    await page
      .getByTestId('orderbookCell')
      .last()
      .waitFor({ state: 'attached' });
    await page.getByTestId('orderBookWidgetRate').waitFor({ state: 'visible' });

    await expect(
      await page.screenshot({
        mask: [page.getByTestId('orderBookWidgetRate')],
      })
    ).toMatchSnapshot('trade.png');
  });
});
