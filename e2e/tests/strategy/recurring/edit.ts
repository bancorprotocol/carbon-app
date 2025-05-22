import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  getRecurringSettings,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const editPriceStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  return test('Edit Price', async ({ page }) => {
    const { buy, sell } = testCase.output.editPrices;
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('editPrices');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('recurring', 'editPrices');
    await edit.fillRecurringPrice('editPrices');
    await edit.submit('editPrices');
    await page.waitForURL('/portfolio', { timeout: 10_000 });
    await waitForTenderlyRpc(page);

    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
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
    } else {
      await expect(sellTooltip.minPrice()).toHaveText(sell.min);
      await expect(sellTooltip.maxPrice()).toHaveText(sell.max);
    }
    await sellTooltip.waitForDetached();
  });
};
