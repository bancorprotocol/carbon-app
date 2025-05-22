import { expect, test } from '@playwright/test';
import { pauseStrategy } from './pause';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  getRecurringSettings,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const renewStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  return test('Renew', async ({ page }) => {
    const { strategy } = await pauseStrategy(page, testCase);

    await strategy.clickManageEntry('renewStrategy');
    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('recurring', 'renew');
    await edit.fillRecurringPrice('renew');
    await edit.submit('renew');

    await page.waitForURL('/portfolio', { timeout: 10_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);
    const strategyEdited = await myStrategies.getStrategy(1);

    await expect(strategy.status()).toHaveText('Active');

    // Check range
    const { buy, sell } = testCase.output.editPrices;
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
