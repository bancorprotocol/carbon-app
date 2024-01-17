import { expect, test } from '@playwright/test';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, screenshot, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertOverlappingTestCase,
} from '../../../utils/strategy';
import { MainMenuDriver } from '../../../utils/MainMenuDriver';
import { checkApproval } from '../../../utils/modal';

export const createOverlappingStrategy = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  const { base, quote, sell } = testCase.input;
  const output = testCase.output.create;

  return test(`Create ${base}->${quote}`, async ({ page }) => {
    test.setTimeout(180_000);
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase.input);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('overlapping');
    await createForm.nextStep();

    const overlappingForm = await createForm.fillOverlapping();
    expect(overlappingForm.max()).toHaveValue(sell.max.toString());

    const mainMenu = new MainMenuDriver(page);
    await mainMenu.hide();
    await screenshot(
      overlappingForm.locator,
      `[Create Overlapping Strategy] Form`
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
    const sellTooltip = await strategy.priceTooltip('sell');
    await expect(sellTooltip.minPrice()).toHaveText(output.sell.min);
    await expect(sellTooltip.maxPrice()).toHaveText(output.sell.max);
    await sellTooltip.waitForDetached();
    const buyTooltip = await strategy.priceTooltip('buy');
    await expect(buyTooltip.minPrice()).toHaveText(output.buy.min);
    await expect(buyTooltip.maxPrice()).toHaveText(output.buy.max);
    await buyTooltip.waitForDetached();
    await notif.close();
    await screenshot(page, `[Create Overlapping Strategy] My Strategy`);
  });
};
