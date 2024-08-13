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

    await page.waitForURL('/trade/overview/recurring/sell?*');

    const createForm = new CreateStrategyDriver(page, testCase);
    await createForm.nextStep();
    await page.waitForURL('/trade/overview/recurring/buy?*');
    await createForm.nextStep();
    await createForm.submit('undercut');

    await page.waitForURL('/', { timeout: 10_000 });
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();

    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const strategyUndercut = await myStrategies.getStrategy(2);
    await expect(strategyUndercut.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyUndercut.status()).toHaveText('Active');
    await expect(strategyUndercut.totalBudget()).toHaveText(totalFiat);
    await expect(strategyUndercut.budget('buy')).toHaveText(buy.budget);
    await expect(strategyUndercut.budgetFiat('buy')).toHaveText(buy.fiat);
    await expect(strategyUndercut.budget('sell')).toHaveText(sell.budget);
    await expect(strategyUndercut.budgetFiat('sell')).toHaveText(sell.fiat);

    // Check range
    const [buySetting, sellSetting] = getRecurringSettings(testCase);

    const buyTooltip = await strategyUndercut.priceTooltip('buy');
    if (buySetting === 'limit') {
      await expect(buyTooltip.price()).toHaveText(buy.min);
    } else {
      await expect(buyTooltip.minPrice()).toHaveText(buy.min);
      await expect(buyTooltip.maxPrice()).toHaveText(buy.max);
    }
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategyUndercut.priceTooltip('sell');
    if (sellSetting === 'limit') {
      await expect(sellTooltip.price()).toHaveText(sell.min);
    } else {
      await expect(sellTooltip.minPrice()).toHaveText(sell.min);
      await expect(sellTooltip.maxPrice()).toHaveText(sell.max);
    }
    await sellTooltip.waitForDetached();
  });
};
