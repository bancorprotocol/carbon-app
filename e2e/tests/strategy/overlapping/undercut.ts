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

export const undercut = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  const { base, quote } = testCase;
  const { totalFiat, buy, sell } = testCase.output.undercut;

  return test('Undercut', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('undercut-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    await page.waitForURL('/trade/overlapping?*');

    const createForm = new CreateStrategyDriver(page, testCase);
    const overlappingForm = createForm.getOverlappingForm();
    await overlappingForm.anchor('sell').click();
    await overlappingForm.budget().focus();
    await overlappingForm.budget().fill(sell.budget);
    await createForm.submit('undercut');

    await page.waitForURL('/portfolio', { timeout: 10_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);

    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const undercut = await myStrategies.getStrategy(1);
    await expect(undercut.pair()).toHaveText(`${base}/${quote}`);
    await expect(undercut.status()).toHaveText('Active');
    await expect(undercut.totalBudget()).toHaveText(totalFiat);

    const isOverlapping = true;
    // Sell
    await expect(undercut.budget('sell')).toHaveText(sell.budget);
    await expect(undercut.budgetFiat('sell')).toHaveText(sell.fiat);
    const sellTooltip = await undercut.priceTooltip('sell', { isOverlapping });
    await expect(sellTooltip.minPrice()).toHaveText(sell.min);
    await expect(sellTooltip.maxPrice()).toHaveText(sell.max);
    await expect(sellTooltip.spread()).toHaveText(sell.spread);
    await expect(sellTooltip.marginalPrice()).toHaveText(sell.marginal);
    await sellTooltip.waitForDetached();

    // Buy
    await expect(undercut.budget('buy')).toHaveText(buy.budget);
    await expect(undercut.budgetFiat('buy')).toHaveText(buy.fiat);
    const buyTooltip = await undercut.priceTooltip('buy', { isOverlapping });
    await expect(buyTooltip.minPrice()).toHaveText(buy.min);
    await expect(buyTooltip.maxPrice()).toHaveText(buy.max);
    await expect(buyTooltip.spread()).toHaveText(buy.spread);
    await expect(buyTooltip.marginalPrice()).toHaveText(buy.marginal);
    await buyTooltip.waitForDetached();
  });
};
