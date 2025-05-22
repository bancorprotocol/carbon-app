import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const depositStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { buy, sell } = testCase.output.deposit;
  return test('Deposit', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('depositFunds');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('recurring', 'deposit');
    await edit.waitForWallet();
    await edit.fillRecurringBudget('deposit');

    await edit.submit('deposit');
    await page.waitForURL('/portfolio', { timeout: 20_000 });
    await waitForTenderlyRpc(page);

    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();

    await expect(strategy.budget('buy')).toHaveText(buy);
    await expect(strategy.budget('sell')).toHaveText(sell);
  });
};
