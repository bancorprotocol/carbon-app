import { expect, test } from '@playwright/test';
import { tokenPrice } from './../../utils/operators';
import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { NotificationDriver } from './../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../utils/strategy/ManageStrategyDriver';

export const depositStrategyTest = (testCase: CreateStrategyTemplate) => {
  return test('Deposit', async ({ page }) => {
    test.setTimeout(45_000);
    const { base, quote, buy, sell } = testCase;

    const buyBudget = parseFloat(buy.budget);
    const sellBudget = parseFloat(sell.budget);
    const depositBuyBudget = buyBudget / 2;
    const depositSellBudget = sellBudget / 2;
    const newBuyBudget = (buyBudget + depositBuyBudget).toString();
    const newSellBudget = (sellBudget + depositSellBudget).toString();

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-depositFunds');

    await manage.waitForEditPage('deposit');
    await manage.fillBudget('deposit', 'buy', depositBuyBudget);
    await manage.fillBudget('deposit', 'sell', depositSellBudget);

    await page.getByTestId('deposit-withdraw-confirm-btn').click();
    await page.waitForURL('/', { timeout: 20_000 });

    const notif = new NotificationDriver(page, 'deposit-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your deposit request was successfully completed.'
    );

    await expect(strategy.buyBudget()).toHaveText(
      tokenPrice(newBuyBudget, quote)
    );
    await expect(strategy.sellBudget()).toHaveText(
      tokenPrice(newSellBudget, base)
    );
  });
};
