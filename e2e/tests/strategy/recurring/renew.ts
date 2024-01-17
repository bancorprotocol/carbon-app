import { expect, test } from '@playwright/test';
import { pauseStrategy } from './pause';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { CreateStrategyTestCase } from '../../../utils/strategy';

export const renewStrategyTest = (testCase: CreateStrategyTestCase) => {
  const { input } = testCase;
  return test('Renew', async ({ page }) => {
    const { strategy, manage } = await pauseStrategy(page, input);

    await strategy.clickManageEntry('manage-strategy-renewStrategy');
    await manage.waitForEditPage('renew');
    await manage.fillLimitPrice('buy', input.buy.max);
    await manage.fillLimitPrice('sell', input.sell.max);
    await page.getByTestId('edit-strategy-prices-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notifRenew = new NotificationDriver(page, 'renew-strategy');
    await expect(notifRenew.getTitle()).toHaveText('Success');
    await expect(notifRenew.getDescription()).toHaveText(
      'Your request to renew the strategy was successfully completed.'
    );

    await expect(strategy.status()).toHaveText('Active');
    // TODO Assert new prices from tooltips
  });
};
