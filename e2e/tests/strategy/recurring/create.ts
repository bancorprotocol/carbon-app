import { expect, test } from '@playwright/test';
import { checkApproval } from '../../../utils/modal';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, tokenPrice, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
} from '../../../utils/strategy';

export const createRecurringStrategy = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { base, quote, buy, sell } = testCase.input;
  const output = testCase.output.create;

  return test(`Create`, async ({ page }) => {
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase.input);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('two-ranges');
    await createForm.nextStep();
    const buyForm = await createForm.fillRecurringLimit('buy');
    const sellForm = await createForm.fillRecurringLimit('sell');

    // Assert 100% outcome
    await expect(buyForm.outcomeValue()).toHaveText(`0.006666 ${base}`);
    await expect(buyForm.outcomeQuote()).toHaveText(tokenPrice(buy.min, quote));
    await expect(sellForm.outcomeValue()).toHaveText(`3,400.00 ${quote}`);
    await expect(sellForm.outcomeQuote()).toHaveText(
      tokenPrice(sell.min, quote)
    );

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
  });
};
