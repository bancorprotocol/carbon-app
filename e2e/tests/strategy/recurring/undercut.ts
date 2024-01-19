import { expect, test } from '@playwright/test';
import {
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
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
    await strategy.clickManageEntry('duplicateStrategy');

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
    await expect(strategyUndercut.budget('buy')).toHaveText(buy.budget);
    await expect(strategyUndercut.budgetFiat('buy')).toHaveText(buy.fiat);
    await expect(strategyUndercut.budget('sell')).toHaveText(sell.budget);
    await expect(strategyUndercut.budgetFiat('sell')).toHaveText(sell.fiat);

    const buyTooltip = await strategyUndercut.priceTooltip('buy');
    await expect(buyTooltip.startPrice()).toHaveText(buy.min);
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategyUndercut.priceTooltip('sell');
    await expect(sellTooltip.startPrice()).toHaveText(sell.min);
    await sellTooltip.waitForDetached();
  });
};
