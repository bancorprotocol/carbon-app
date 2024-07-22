import { expect, test } from '@playwright/test';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
} from './../../../utils/strategy';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { waitModalOpen } from '../../../utils/modal';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const duplicateStrategyTest = (testCase: CreateStrategyTestCase) => {
  const { base, quote } = testCase;
  assertRecurringTestCase(testCase);
  const { buy, sell, totalFiat } = testCase.output.create;
  return test('Duplicate', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('duplicate-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    await page.waitForURL('/strategies/create?*', {
      timeout: 10_000,
    });

    const createForm = new CreateStrategyDriver(page, testCase);
    await createForm.submit('duplicate');

    await page.waitForURL('/', { timeout: 10_000 });
    await waitForTenderlyRpc(page);

    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
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
  });
};
