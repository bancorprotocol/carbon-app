import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../utils/modal';
import { tokenPrice } from './../../utils/operators';
import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { NotificationDriver } from './../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../utils/strategy/ManageStrategyDriver';

export const withdrawStrategyTest = (testCase: CreateStrategyTemplate) => {
  return test('Withdraw', async ({ page }) => {
    test.setTimeout(45_000);
    const { base, quote, buy, sell } = testCase;

    const buyBudget = parseFloat(buy.budget);
    const sellBudget = parseFloat(sell.budget);
    const withdrawBuyBudget = buyBudget / 2;
    const withdrawSellBudget = sellBudget / 2;

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-withdrawFunds');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('withdraw-strategy-btn').click();

    await manage.waitForEditPage('withdraw');
    await manage.fillBudget('withdraw', 'buy', withdrawBuyBudget);
    await manage.fillBudget('withdraw', 'sell', withdrawSellBudget);

    await page.getByTestId('deposit-withdraw-confirm-btn').click();
    await page.waitForURL('/', { timeout: 20_000 });

    const notif = new NotificationDriver(page, 'withdraw-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your withdrawal request was successfully completed.'
    );

    await expect(strategy.buyBudget()).toHaveText(
      tokenPrice(withdrawBuyBudget, quote)
    );
    await expect(strategy.sellBudget()).toHaveText(
      tokenPrice(withdrawSellBudget, base)
    );
  });
};
