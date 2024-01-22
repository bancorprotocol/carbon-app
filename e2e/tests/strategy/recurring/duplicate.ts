import { expect, test } from '@playwright/test';
import {
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
} from './../../../utils/strategy';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { waitModalOpen } from '../../../utils/modal';

export const duplicateStrategyTest = (testCase: CreateStrategyTestCase) => {
  const { base, quote } = testCase;
  assertRecurringTestCase(testCase);
  const { buy, sell, totalFiat } = testCase.output.create;
  return test('Duplicate', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('duplicate-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    await page.waitForURL('/strategies/create?strategy=*', {
      timeout: 10_000,
    });

    await page.getByText('Create Strategy').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const myStrategies = new MyStrategyDriver(page);
    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const strategyDuplicate = await myStrategies.getStrategy(2);
    await expect(strategyDuplicate.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyDuplicate.status()).toHaveText('Active');
    await expect(strategyDuplicate.totalBudget()).toHaveText(totalFiat);
    await expect(strategyDuplicate.budget('buy')).toHaveText(buy.budget);
    await expect(strategyDuplicate.budgetFiat('buy')).toHaveText(buy.fiat);
    await expect(strategyDuplicate.budget('sell')).toHaveText(sell.budget);
    await expect(strategyDuplicate.budgetFiat('sell')).toHaveText(sell.fiat);

    const notificationDriver = new NotificationDriver(page);
    const notif = notificationDriver.getNotification('create-strategy');
    await expect(notif.title()).toHaveText('Success');
    await expect(notif.description()).toHaveText(
      'New strategy was successfully created.'
    );
  });
};
