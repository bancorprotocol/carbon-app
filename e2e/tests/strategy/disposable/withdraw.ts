import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../../utils/modal';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertDisposableTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

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
    await edit.waitForPage('withdraw');
    await edit.fillDisposableBudget('withdraw');

    await edit.submit('withdraw');
    await page.waitForURL('/', { timeout: 20_000 });

    await expect(strategy.budget(direction)).toHaveText(output);
  });
};
