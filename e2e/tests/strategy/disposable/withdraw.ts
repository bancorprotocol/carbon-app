import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../../utils/modal';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertDisposableTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const withdraw = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { direction } = testCase;
  const output = testCase.output.withdraw;
  return test('Withdraw', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('withdrawFunds');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('withdraw-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('disposable', 'withdraw');
    await edit.fillDisposableBudget('withdraw');
    await edit.submit('withdraw');

    await page.waitForURL('/portfolio', { timeout: 20_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);

    await expect(strategy.budget(direction)).toHaveText(output);
  });
};
