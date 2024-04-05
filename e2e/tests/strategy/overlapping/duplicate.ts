import { expect, test } from '@playwright/test';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertOverlappingTestCase,
} from './../../../utils/strategy';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const duplicate = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  const { base, quote } = testCase;
  const { totalFiat, buy, sell } = testCase.output.create;

  return test('Duplicate', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('duplicateStrategy');

    await page.waitForURL('/strategies/create?*', {
      timeout: 10_000,
    });

    const createForm = new CreateStrategyDriver(page, testCase);
    const overlappingForm = createForm.getOverlappingForm();
    await overlappingForm.budgetBase().fill(sell.budget);
    await createForm.submit();

    await page.waitForURL('/', { timeout: 10_000 });

    const myStrategies = new MyStrategyDriver(page);
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
