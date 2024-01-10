import { expect, test } from '@playwright/test';
import { MyStrategyDriver } from './../../utils/strategy';
import { fiatPrice, tokenPrice } from './../../utils/operators';
import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { NotificationDriver } from './../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../utils/strategy/ManageStrategyDriver';

export const duplicateStrategyTest = (testCase: CreateStrategyTemplate) => {
  return test('Duplicate', async ({ page }) => {
    test.setTimeout(45_000);
    const { base, quote, buy, sell } = testCase;
    const buyBudgetFiat = parseFloat(buy.budgetFiat ?? '0');
    const sellBudgetFiat = parseFloat(sell.budgetFiat ?? '0');

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-duplicateStrategy');

    await page.waitForURL('/strategies/create?strategy=*', {
      timeout: 10_000,
    });

    await page.getByText('Create Strategy').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notif = new NotificationDriver(page, 'create-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'New strategy was successfully created.'
    );

    const myStrategies = new MyStrategyDriver(page);
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const strategyDuplicate = await myStrategies.getStrategy(2);
    await expect(strategyDuplicate.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyDuplicate.status()).toHaveText('Active');
    await expect(strategyDuplicate.totalBudget()).toHaveText(
      fiatPrice(buyBudgetFiat + sellBudgetFiat)
    );
    await expect(strategyDuplicate.buyBudget()).toHaveText(
      tokenPrice(buy.budget, quote)
    );
    await expect(strategyDuplicate.buyBudgetFiat()).toHaveText(
      fiatPrice(buyBudgetFiat)
    );
    await expect(strategyDuplicate.sellBudget()).toHaveText(
      tokenPrice(sell.budget, base)
    );
    await expect(strategyDuplicate.sellBudgetFiat()).toHaveText(
      fiatPrice(sellBudgetFiat)
    );
  });
};
