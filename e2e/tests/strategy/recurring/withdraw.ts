import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../../utils/modal';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const withdrawStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { buy, sell } = testCase.output.withdraw;
  return test('Withdraw', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('withdrawFunds');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('withdraw-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('recurring', 'withdraw');
    await edit.waitForWallet();
    await edit.fillRecurringBudget('withdraw');

    await edit.submit('withdraw');
    await page.waitForURL('/portfolio', { timeout: 20_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);

    await expect(strategy.budget('buy')).toHaveText(buy);
    await expect(strategy.budget('sell')).toHaveText(sell);
  });
};
