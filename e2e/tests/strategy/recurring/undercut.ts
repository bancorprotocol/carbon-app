import { expect, test } from '@playwright/test';
import {
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
  getRecurringSettings,
} from './../../../utils/strategy';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { waitModalOpen } from '../../../utils/modal';

export const undercutStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { base, quote } = testCase;
  const { buy, sell, totalFiat } = testCase.output.undercut;
  return test('Undercut', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('undercut-strategy-btn').click();

    await page.waitForURL('/strategies/create?strategy=*', {
      timeout: 10_000,
    });

    await page.getByText('Create Strategy').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notif = new NotificationDriver(page, 'create-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'New strategy was successfully created.'
    );

    const myStrategies = new MyStrategyDriver(page);
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const strategyUndercut = await myStrategies.getStrategy(2);
    await expect(strategyUndercut.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyUndercut.status()).toHaveText('Active');
    await expect(strategyUndercut.totalBudget()).toHaveText(totalFiat);
    await expect(strategyUndercut.buyBudget()).toHaveText(buy.budget);
    await expect(strategyUndercut.buyBudgetFiat()).toHaveText(buy.fiat);
    await expect(strategyUndercut.sellBudget()).toHaveText(sell.budget);
    await expect(strategyUndercut.sellBudgetFiat()).toHaveText(sell.fiat);

    // Check range
    const [buySetting, sellSetting] = getRecurringSettings(testCase);

    const buyTooltip = await strategyUndercut.priceTooltip('buy');
    if (buySetting === 'limit') {
      await expect(buyTooltip.startPrice()).toHaveText(buy.min);
      await expect(buyTooltip.startPrice()).toHaveText(buy.max);
    } else {
      await expect(buyTooltip.minPrice()).toHaveText(buy.min);
      await expect(buyTooltip.maxPrice()).toHaveText(buy.max);
    }
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategyUndercut.priceTooltip('sell');
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
