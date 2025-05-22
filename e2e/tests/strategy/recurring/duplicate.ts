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

    await page.waitForURL('/trade/recurring?*');

    const createForm = new CreateStrategyDriver(page, testCase);
    await createForm.submit('duplicate');

    await page.waitForURL('/portfolio', { timeout: 10_000 });
    await waitForTenderlyRpc(page);

    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const duplicate = await myStrategies.getStrategy(1);
    await expect(duplicate.pair()).toHaveText(`${base}/${quote}`);
    await expect(duplicate.status()).toHaveText('Active');
    await expect(duplicate.totalBudget()).toHaveText(totalFiat);
    await expect(duplicate.budget('buy')).toHaveText(buy.budget);
    await expect(duplicate.budgetFiat('buy')).toHaveText(buy.fiat);
    await expect(duplicate.budget('sell')).toHaveText(sell.budget);
    await expect(duplicate.budgetFiat('sell')).toHaveText(sell.fiat);
  });
};
