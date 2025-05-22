import { expect, test } from '@playwright/test';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertOverlappingTestCase,
} from './../../../utils/strategy';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';
import { waitModalOpen } from '../../../utils/modal';

export const duplicate = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  const { base, quote } = testCase;
  const { totalFiat, buy, sell } = testCase.output.create;

  return test('Duplicate', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('duplicate-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    await page.waitForURL('/trade/overlapping?*');

    const createForm = new CreateStrategyDriver(page, testCase);
    const overlappingForm = createForm.getOverlappingForm();
    await overlappingForm.anchor('sell').click();
    await overlappingForm.budget().focus();
    await overlappingForm.budget().fill(sell.budget);

    await createForm.submit('duplicate');

    await page.waitForURL('/portfolio', { timeout: 10_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);

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
