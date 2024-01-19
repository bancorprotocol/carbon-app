import { expect, test } from '@playwright/test';
import { pauseStrategy } from './pause';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  getRecurringSettings,
  MyStrategyDriver,
} from '../../../utils/strategy';

export const renewStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  return test('Renew', async ({ page }) => {
    const { buy, sell } = testCase.output.create;
    const { strategy, manage } = await pauseStrategy(page, testCase);

    await strategy.clickManageEntry('manage-strategy-renewStrategy');
    await manage.waitForEditPage('renew');
    const edit = new EditStrategyDriver(page, testCase);
    await edit.fillRecurringPrice();
    await page.getByTestId('edit-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notifRenew = new NotificationDriver(page, 'renew-strategy');
    await expect(notifRenew.getTitle()).toHaveText('Success');
    await expect(notifRenew.getDescription()).toHaveText(
      'Your request to renew the strategy was successfully completed.'
    );

    await expect(strategy.status()).toHaveText('Active');
    const myStrategies = new MyStrategyDriver(page);
    const strategyEdited = await myStrategies.getStrategy(1);

    // Check range
    const [buySetting, sellSetting] = getRecurringSettings(testCase);

    const buyTooltip = await strategyEdited.priceTooltip('buy');
    if (buySetting === 'limit') {
      await expect(buyTooltip.startPrice()).toHaveText(buy.min);
      await expect(buyTooltip.startPrice()).toHaveText(buy.max);
    } else {
      await expect(buyTooltip.minPrice()).toHaveText(buy.min);
      await expect(buyTooltip.maxPrice()).toHaveText(buy.max);
    }
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategyEdited.priceTooltip('sell');
    if (sellSetting === 'limit') {
      await expect(sellTooltip.startPrice()).toHaveText(sell.min);
      await expect(sellTooltip.startPrice()).toHaveText(sell.max);
    } else {
      await expect(sellTooltip.minPrice()).toHaveText(sell.min);
      await expect(sellTooltip.maxPrice()).toHaveText(sell.max);
    }
    await sellTooltip.waitForDetached();
  });
};
