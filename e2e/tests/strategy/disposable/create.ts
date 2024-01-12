import { expect, test } from '@playwright/test';
import { checkApproval } from '../../../utils/modal';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, screenshot, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertDisposableTestCase,
  testDescription,
} from '../../../utils/strategy';
import { MainMenuDriver } from '../../../utils/MainMenuDriver';

export const createRecurringStrategy = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { base, quote, direction } = testCase.input;
  const output = testCase.output.create;
  const order = output[direction];
  if (!order) {
    throw new Error(`Disposable input is missing key "${direction}"`);
  }

  return test(`Create`, async ({ page }) => {
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('buy-limit');
    await createForm.nextStep();

    const form = await createForm.fillDisposable();

    // Assert 100% outcome
    await expect(form.outcomeValue()).toHaveText(order.outcomeValue);
    await expect(form.outcomeQuote()).toHaveText(order.outcomeQuote);

    const mainMenu = new MainMenuDriver(page);
    await mainMenu.hide();
    await screenshot(
      form.locator,
      `[Create ${testDescription(testCase)}] Form`
    );
    await mainMenu.show();

    await createForm.submit();

    if (direction === 'buy') {
      await checkApproval(page, [quote]);
    } else {
      await checkApproval(page, [base]);
    }

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
    await expect(strategy.totalBudget()).toHaveText(order.fiat);
    await expect(strategy.buyBudget()).toHaveText(output.buy.budget);
    await expect(strategy.buyBudgetFiat()).toHaveText(output.buy.fiat);
    await expect(strategy.sellBudget()).toHaveText(output.sell.budget);
    await expect(strategy.sellBudgetFiat()).toHaveText(output.sell.fiat);

    await notif.close();
    await screenshot(page, `[Create ${testDescription(testCase)}] My Strategy`);
  });
};
