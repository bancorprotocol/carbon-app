import { expect, test } from '@playwright/test';
import { pauseStrategy } from './../../tests/strategy/pause';
import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { NotificationDriver } from './../../utils/NotificationDriver';

export const renewStrategyTest = (config: CreateStrategyTemplate) => {
  return test('Renew', async ({ page }) => {
    const { strategy, manage } = await pauseStrategy(page, config);

    await strategy.clickManageEntry('manage-strategy-renewStrategy');
    await manage.waitForEditPage('renew');
    await manage.fillLimitPrice('buy', config.buy.max);
    await manage.fillLimitPrice('sell', config.sell.max);
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
