import { expect, test } from '@playwright/test';
import { checkApproval } from '../../../utils/modal';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertRecurringTestCase,
} from '../../../utils/strategy';

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
