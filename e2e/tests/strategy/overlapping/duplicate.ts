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

    await page.waitForURL('/trade/overview/overlapping/price?*');

    const createForm = new CreateStrategyDriver(page, testCase);
    const overlappingForm = createForm.getOverlappingForm();
    await overlappingForm.anchor('sell').click();
    await createForm.nextStep();
    await page.waitForURL('/trade/overview/overlapping/budget?*');
    await overlappingForm.budget().focus();
    await overlappingForm.budget().fill(sell.budget);

    await createForm.nextStep();
    await page.waitForURL('/trade/overview/overlapping/summary?*');
    await createForm.submit('duplicate');

    await page.waitForURL('/', { timeout: 10_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);

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
