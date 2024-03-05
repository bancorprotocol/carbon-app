import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const depositStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { buy, sell } = testCase.output.deposit;
  return test('Deposit', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('depositFunds');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('deposit');
    await edit.waitForWallet();
    await edit.fillRecurringBudget('deposit');

    await edit.submit('deposit');
    await page.waitForURL('/', { timeout: 20_000 });

    await expect(strategy.budget('buy')).toHaveText(buy);
    await expect(strategy.budget('sell')).toHaveText(sell);
  });
};
