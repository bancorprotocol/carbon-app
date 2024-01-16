import { expect, test } from '@playwright/test';
import { CreateStrategyTemplate } from '../../../utils/strategy/template';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import {
  fiatPrice,
  navigateTo,
  screenshot,
  tokenPrice,
  waitFor,
} from '../../../utils/operators';
import {
  CreateStrategyDriver,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { MainMenuDriver } from '../../../utils/MainMenuDriver';
import { checkApproval } from '../../../utils/modal';

export const createOverlappingStrategy = (testCase: CreateStrategyTemplate) => {
  const { base, quote, buy, sell } = testCase;
  const buyBudgetFiat = parseFloat(buy.budgetFiat ?? '0');
  const sellBudgetFiat = parseFloat(sell.budgetFiat ?? '0');

  return test(`Create ${base}->${quote}`, async ({ page }) => {
    test.setTimeout(180_000);
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('overlapping');
    await createForm.nextStep();

    const overlappingForm = await createForm.fillOverlapping();
    expect(overlappingForm.max()).toHaveValue(testCase.sell.max.toString());

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
    await expect(strategy.totalBudget()).toHaveText(
      fiatPrice(buyBudgetFiat + sellBudgetFiat)
    );
    await expect(strategy.buyBudget()).toHaveText(
      tokenPrice(buy.budget, quote)
    );
    await expect(strategy.buyBudgetFiat()).toHaveText(fiatPrice(buyBudgetFiat));
    await expect(strategy.sellBudget()).toHaveText(
      tokenPrice(sell.budget, base)
    );
    await expect(strategy.sellBudgetFiat()).toHaveText(
      fiatPrice(sellBudgetFiat)
    );
    const sellTooltip = await strategy.priceTooltip('sell');
    await expect(sellTooltip.minPrice()).toHaveText(
      tokenPrice(sell.min, quote)
    );
    await sellTooltip.waitForDetached();
    const buyTooltip = await strategy.priceTooltip('buy');
    await expect(buyTooltip.maxPrice()).toHaveText(tokenPrice(buy.max, quote));
    await buyTooltip.waitForDetached();
    await notif.close();
    await screenshot(page, `[Create Overlapping Strategy] My Strategy`);
  });
};
