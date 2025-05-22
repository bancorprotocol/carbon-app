import { expect, test } from '@playwright/test';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, screenshot, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertOverlappingTestCase,
  screenshotPath,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const create = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  const { base, quote } = testCase;
  const { buy, sell, spread } = testCase.input.create;
  const output = testCase.output.create;

  return test('Create', async ({ page }) => {
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/portfolio');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('overlapping');

    const form = createForm.getOverlappingForm();
    await form.max().focus();
    await form.max().fill(sell.max.toString());
    await form.min().focus();
    await form.min().fill(buy.min.toString());
    await form.spread().fill(spread.toString());
    await form.anchor('sell').click();
    await form.budget().focus();
    await form.budget().fill(sell.budget.toString());

    const tokenApproval = new TokenApprovalDriver(page);
    await createForm.submit('create');
    await tokenApproval.checkApproval([base, quote]);
    await page.waitForURL('/portfolio', { timeout: 10_000 });
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);

    // Verify strategy data
    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(1);
    const strategy = await myStrategies.getStrategy(1);
    await expect(strategy.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategy.status()).toHaveText('Active');
    await expect(strategy.totalBudget()).toHaveText(output.totalFiat);
    await expect(strategy.budget('buy')).toHaveText(output.buy.budget);
    await expect(strategy.budgetFiat('buy')).toHaveText(output.buy.fiat);
    await expect(strategy.budget('sell')).toHaveText(output.sell.budget);
    await expect(strategy.budgetFiat('sell')).toHaveText(output.sell.fiat);

    const isOverlapping = true;
    const sellTooltip = await strategy.priceTooltip('sell', { isOverlapping });
    await expect(sellTooltip.minPrice()).toHaveText(output.sell.min);
    await expect(sellTooltip.maxPrice()).toHaveText(output.sell.max);
    await expect(sellTooltip.spread()).toHaveText(output.sell.spread);
    await expect(sellTooltip.marginalPrice()).toHaveText(output.sell.marginal);
    await sellTooltip.waitForDetached();

    const buyTooltip = await strategy.priceTooltip('buy', { isOverlapping });
    await expect(buyTooltip.minPrice()).toHaveText(output.buy.min);
    await expect(buyTooltip.maxPrice()).toHaveText(output.buy.max);
    await expect(sellTooltip.spread()).toHaveText(output.buy.spread);
    await expect(buyTooltip.marginalPrice()).toHaveText(output.buy.marginal);
    await buyTooltip.waitForDetached();

    const notificationDriver = new NotificationDriver(page);
    await notificationDriver.closeAll();

    await screenshot(page, screenshotPath(testCase, 'create', 'my-strategy'));
  });
};
