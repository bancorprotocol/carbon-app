import { expect, test } from '@playwright/test';
import { checkApproval } from '../../../utils/modal';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, screenshot, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
  testDescription,
} from '../../../utils/strategy';
import { MainMenuDriver } from '../../../utils/MainMenuDriver';

export const createRecurringStrategy = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { base, quote } = testCase;
  const output = testCase.output.create;

  return test(`Create`, async ({ page }) => {
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('two-ranges');
    await createForm.nextStep();

    const { buyForm, sellForm } = await createForm.fillRecurring();

    // Assert 100% outcome
    await expect(buyForm.outcomeValue()).toHaveText(output.buy.outcomeValue);
    await expect(buyForm.outcomeQuote()).toHaveText(output.buy.outcomeQuote);
    await expect(sellForm.outcomeValue()).toHaveText(output.sell.outcomeValue);
    await expect(sellForm.outcomeQuote()).toHaveText(output.sell.outcomeQuote);

    const mainMenu = new MainMenuDriver(page);
    await mainMenu.hide();
    await screenshot(
      buyForm.locator,
      `[Create ${testDescription(testCase)}] Buy Form`
    );
    await screenshot(
      sellForm.locator,
      `[Create ${testDescription(testCase)}] Sell Form`
    );
    await mainMenu.show();

    await createForm.submit();

    await checkApproval(page, [base, quote]);

    await page.waitForURL('/', { timeout: 10_000 });

    // Verfiy notification
    const notif = new NotificationDriver(page, 'create-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'New strategy was successfully created.'
    );

    // Verify strategy data
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(1);
    const strategy = await myStrategies.getStrategy(1);

    await expect(strategy.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategy.status()).toHaveText('Active');
    await expect(strategy.totalBudget()).toHaveText(output.totalFiat);
    await expect(strategy.buyBudget()).toHaveText(output.buy.budget);
    await expect(strategy.buyBudgetFiat()).toHaveText(output.buy.fiat);
    await expect(strategy.sellBudget()).toHaveText(output.sell.budget);
    await expect(strategy.sellBudgetFiat()).toHaveText(output.sell.fiat);

    // Check range
    const [buySetting, sellSetting] = testCase.input.setting.split('_');

    const buyTooltip = await strategy.priceTooltip('buy');
    if (buySetting === 'limit') {
      await expect(buyTooltip.startPrice()).toHaveText(output.buy.min);
      await expect(buyTooltip.startPrice()).toHaveText(output.buy.max);
    } else {
      await expect(buyTooltip.minPrice()).toHaveText(output.buy.min);
      await expect(buyTooltip.maxPrice()).toHaveText(output.buy.max);
    }
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategy.priceTooltip('sell');
    if (sellSetting === 'limit') {
      await expect(sellTooltip.startPrice()).toHaveText(output.sell.min);
      await expect(sellTooltip.startPrice()).toHaveText(output.sell.max);
    } else {
      await expect(sellTooltip.minPrice()).toHaveText(output.sell.min);
      await expect(sellTooltip.maxPrice()).toHaveText(output.sell.max);
    }
    await sellTooltip.waitForDetached();
  });
};
