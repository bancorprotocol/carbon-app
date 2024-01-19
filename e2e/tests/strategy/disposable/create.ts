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

export const create = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { base, quote, direction, setting } = testCase;
  const output = testCase.output.create;

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
    await expect(form.outcomeValue()).toHaveText(output.outcomeValue);
    await expect(form.outcomeQuote()).toHaveText(output.outcomeQuote);

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

    // Verify notification
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
    await expect(strategy.totalBudget()).toHaveText(output.fiat);
    await expect(strategy.budget(direction)).toHaveText(output.budget);
    await expect(strategy.budgetFiat(direction)).toHaveText(output.fiat);

    const tooltip = await strategy.priceTooltip(direction);
    if (setting === 'limit') {
      expect(tooltip.price()).toHaveText(output.min);
    } else {
      expect(tooltip.minPrice()).toHaveText(output.min);
      expect(tooltip.maxPrice()).toHaveText(output.max);
    }

    await notif.close();
    await screenshot(page, `[Create ${testDescription(testCase)}] My Strategy`);
  });
};
