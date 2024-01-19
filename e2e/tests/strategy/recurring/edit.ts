import { expect, test } from '@playwright/test';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  getRecurringSettings,
  MyStrategyDriver,
} from '../../../utils/strategy';

export const editPriceStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  return test('Edit Price', async ({ page }) => {
    const { buy, sell } = testCase.output.editPrice;
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('editPrices');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('editPrices');
    await edit.fillRecurringPrice();
    await edit.submit('editPrices');
    await page.waitForURL('/', { timeout: 10_000 });

    const notif = new NotificationDriver(page, 'change-rates-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your strategy was successfully updated.'
    );

    const myStrategies = new MyStrategyDriver(page);
    const strategyEdited = await myStrategies.getStrategy(1);

    // Check range
    const [buySetting, sellSetting] = getRecurringSettings(testCase);

    const buyTooltip = await strategyEdited.priceTooltip('buy');
    if (buySetting === 'limit') {
      await expect(buyTooltip.price()).toHaveText(buy.min);
    } else {
      await expect(buyTooltip.minPrice()).toHaveText(buy.min);
      await expect(buyTooltip.maxPrice()).toHaveText(buy.max);
    }
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategyEdited.priceTooltip('sell');
    if (sellSetting === 'limit') {
      await expect(sellTooltip.price()).toHaveText(sell.min);
      await expect(sellTooltip.price()).toHaveText(sell.max);
    } else {
      await expect(sellTooltip.minPrice()).toHaveText(sell.min);
      await expect(sellTooltip.maxPrice()).toHaveText(sell.max);
    }
    await sellTooltip.waitForDetached();
  });
};
