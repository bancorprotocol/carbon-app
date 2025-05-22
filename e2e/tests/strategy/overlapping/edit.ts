import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertOverlappingTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const editPrice = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  return test('Edit Price', async ({ page }) => {
    const { base, quote } = testCase;
    const input = testCase.input.editPrices;
    const output = testCase.output.editPrices;
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const initial = await manage.createStrategy(testCase, { tokenApproval });
    await initial.clickManageEntry('editPrices');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('overlapping', 'editPrices');
    const form = edit.getOverlappingForm();
    await form.min().focus();
    await form.min().fill(input.min);
    await form.max().focus();
    await form.max().fill(input.max);
    await form.spread().fill(input.spread);
    await form.anchor(input.anchor).click();
    await form.budgetSummary().click();
    if (input.action) await form.action(input.action).click();
    await form.budget().focus();
    await form.budget().fill(input.budget);
    await edit.submit('editPrices');

    await tokenApproval.checkApproval([base, quote]);
    await page.waitForURL('/portfolio', { timeout: 10_000 });
    await page.mouse.move(0, 0); // Prevent mouse to open tooltip

    // Verify strategy data
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
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
    await expect(buyTooltip.spread()).toHaveText(output.buy.spread);
    await expect(buyTooltip.marginalPrice()).toHaveText(output.buy.marginal);
    await buyTooltip.waitForDetached();
  });
};
