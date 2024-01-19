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
  const output = testCase.output.create;
  return test('Duplicate', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('duplicate-strategy-btn').click();

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

    const strategyDuplicate = await myStrategies.getStrategy(2);
    await expect(strategyDuplicate.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyDuplicate.status()).toHaveText('Active');
    await expect(strategyDuplicate.totalBudget()).toHaveText(output.totalFiat);
    await expect(strategyDuplicate.buyBudget()).toHaveText(output.buy.budget);
    await expect(strategyDuplicate.buyBudgetFiat()).toHaveText(output.buy.fiat);
    await expect(strategyDuplicate.sellBudget()).toHaveText(output.sell.budget);
    await expect(strategyDuplicate.sellBudgetFiat()).toHaveText(
      output.sell.fiat
    );
  });
};
