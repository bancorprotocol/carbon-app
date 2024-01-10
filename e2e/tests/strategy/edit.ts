import { expect, test } from '@playwright/test';
import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { NotificationDriver } from './../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../utils/strategy/ManageStrategyDriver';

export const editPriceStrategyTest = (config: CreateStrategyTemplate) => {
  return test('Edit Price', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(config);
    await strategy.clickManageEntry('manage-strategy-editPrices');

    await page.waitForURL('/strategies/edit?type=editPrices', {
      timeout: 10_000,
    });

    const newBuyPrice = (parseFloat(config.buy.max) / 2).toString();
    const newSellPrice = (parseFloat(config.sell.max) / 2).toString();

    await manage.fillLimitPrice('buy', newBuyPrice);
    await manage.fillLimitPrice('sell', newSellPrice);
    await page.getByTestId('edit-strategy-prices-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notif = new NotificationDriver(page, 'change-rates-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your strategy was successfully updated.'
    );

    // TODO Assert new prices from tooltips
  });
};
