import { expect, test } from '@playwright/test';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
  getRecurringSettings,
} from './../../../utils/strategy';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { waitModalOpen } from '../../../utils/modal';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const undercutStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { base, quote } = testCase;
  const { buy, sell, totalFiat } = testCase.output.undercut;
  return test('Undercut', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('undercut-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    await page.waitForURL('/trade/recurring?*');
    const createForm = new CreateStrategyDriver(page, testCase);
    await createForm.submit('undercut');

    await page.waitForURL('/portfolio', { timeout: 10_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();

    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const undercut = await myStrategies.getStrategy(1);
    await expect(undercut.pair()).toHaveText(`${base}/${quote}`);
    await expect(undercut.status()).toHaveText('Active');
    await expect(undercut.totalBudget()).toHaveText(totalFiat);
    await expect(undercut.budget('buy')).toHaveText(buy.budget);
    await expect(undercut.budgetFiat('buy')).toHaveText(buy.fiat);
    await expect(undercut.budget('sell')).toHaveText(sell.budget);
    await expect(undercut.budgetFiat('sell')).toHaveText(sell.fiat);

    // Check range
    const [buySetting, sellSetting] = getRecurringSettings(testCase);

    const buyTooltip = await undercut.priceTooltip('buy');
    if (buySetting === 'limit') {
      await expect(buyTooltip.price()).toHaveText(buy.min);
    } else {
      await expect(buyTooltip.minPrice()).toHaveText(buy.min);
      await expect(buyTooltip.maxPrice()).toHaveText(buy.max);
    }
    await buyTooltip.waitForDetached();

    const sellTooltip = await undercut.priceTooltip('sell');
    if (sellSetting === 'limit') {
      await expect(sellTooltip.price()).toHaveText(sell.min);
    } else {
      await expect(sellTooltip.minPrice()).toHaveText(sell.min);
      await expect(sellTooltip.maxPrice()).toHaveText(sell.max);
    }
    await sellTooltip.waitForDetached();
  });
};
