import { expect, test } from '@playwright/test';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, screenshot, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
  getRecurringSettings,
  screenshotPath,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const createRecurringStrategy = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { base, quote } = testCase;
  const output = testCase.output.create;

  return test(`Create`, async ({ page }) => {
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/portfolio');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('recurring');

    const sellForm = await createForm.fillRecurring('sell');
    await expect(sellForm.outcomeValue()).toHaveText(output.sell.outcomeValue);
    await expect(sellForm.outcomeQuote()).toHaveText(output.sell.outcomeQuote);
    const buyForm = await createForm.fillRecurring('buy');
    await expect(buyForm.outcomeValue()).toHaveText(output.buy.outcomeValue);
    await expect(buyForm.outcomeQuote()).toHaveText(output.buy.outcomeQuote);

    const tokenApproval = new TokenApprovalDriver(page);
    await createForm.submit('create');
    await tokenApproval.checkApproval([base, quote]);

    await page.waitForURL('/portfolio', { timeout: 10_000 });
    await waitForTenderlyRpc(page);

    // Verify strategy data
    myStrategies.waitForUpdates();
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

    // Check range
    const [buySetting, sellSetting] = getRecurringSettings(testCase);

    const buyTooltip = await strategy.priceTooltip('buy');
    if (buySetting === 'limit') {
      await expect(buyTooltip.price()).toHaveText(output.buy.min);
    } else {
      await expect(buyTooltip.minPrice()).toHaveText(output.buy.min);
      await expect(buyTooltip.maxPrice()).toHaveText(output.buy.max);
    }
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategy.priceTooltip('sell');
    if (sellSetting === 'limit') {
      await expect(sellTooltip.price()).toHaveText(output.sell.min);
    } else {
      await expect(sellTooltip.minPrice()).toHaveText(output.sell.min);
      await expect(sellTooltip.maxPrice()).toHaveText(output.sell.max);
    }
    await sellTooltip.waitForDetached();

    const notificationDriver = new NotificationDriver(page);
    await notificationDriver.closeAll();

    await screenshot(page, screenshotPath(testCase, 'create', 'my-strategy'));
  });
};
