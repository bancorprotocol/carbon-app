import { expect, test } from '@playwright/test';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertDisposableTestCase,
} from './../../../utils/strategy';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { waitModalOpen } from '../../../utils/modal';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const undercut = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { base, quote, direction, setting } = testCase;
  const createOutput = testCase.output.create;
  const output = testCase.output.undercut;

  return test('Undercut', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('undercut-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    await page.waitForURL('/trade/disposable?*');

    const createForm = new CreateStrategyDriver(page, testCase);
    await createForm.submit('undercut');

    await page.waitForURL('/', { timeout: 10_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);

    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const duplicate = await myStrategies.getStrategy(2);
    await expect(duplicate.pair()).toHaveText(`${base}/${quote}`);
    await expect(duplicate.status()).toHaveText('Active');
    await expect(duplicate.totalBudget()).toHaveText(createOutput.fiat);
    await expect(duplicate.budget(direction)).toHaveText(createOutput.budget);
    await expect(duplicate.budgetFiat(direction)).toHaveText(createOutput.fiat);

    const tooltip = await duplicate.priceTooltip(direction);
    if (setting === 'limit') {
      expect(tooltip.price()).toHaveText(output.min);
    } else {
      expect(tooltip.minPrice()).toHaveText(output.min);
      expect(tooltip.maxPrice()).toHaveText(output.max);
    }
    await tooltip.waitForDetached();
  });
};
