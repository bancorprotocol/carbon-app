import { expect, test } from '@playwright/test';
import { MyStrategyDriver } from './../../../utils/strategy';
import { fiatPrice, tokenPrice } from './../../../utils/operators';
import { CreateStrategyTemplate } from './../../../utils/strategy/template';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { waitModalOpen } from '../../../utils/modal';
import { SafeDecimal } from '../../../../src/libs/safedecimal';

export const undercutStrategyTest = (testCase: CreateStrategyTemplate) => {
  return test('Undercut', async ({ page }) => {
    const { base, quote, buy, sell } = testCase;
    const buyBudgetFiat = parseFloat(buy.budgetFiat ?? '0');
    const sellBudgetFiat = parseFloat(sell.budgetFiat ?? '0');
    const undercutRate = 0.001;

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('undercut-strategy-btn').click();

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

    const strategyUndercut = await myStrategies.getStrategy(2);

    await expect(strategyUndercut.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyUndercut.status()).toHaveText('Active');
    await expect(strategyUndercut.totalBudget()).toHaveText(
      fiatPrice(buyBudgetFiat + sellBudgetFiat)
    );
    await expect(strategyUndercut.buyBudget()).toHaveText(
      tokenPrice(buy.budget, quote)
    );
    await expect(strategyUndercut.buyBudgetFiat()).toHaveText(
      fiatPrice(buyBudgetFiat)
    );
    await expect(strategyUndercut.sellBudget()).toHaveText(
      tokenPrice(sell.budget, base)
    );
    await expect(strategyUndercut.sellBudgetFiat()).toHaveText(
      fiatPrice(sellBudgetFiat)
    );

    const buyTooltip = await strategyUndercut.priceTooltip('buy');
    await expect(buyTooltip.startPrice()).toHaveText(
      tokenPrice(
        new SafeDecimal(buy.min).times(1 + undercutRate).toString(),
        quote
      )
    );
    await buyTooltip.waitForDetached();

    const sellTooltip = await strategyUndercut.priceTooltip('sell');
    await expect(sellTooltip.startPrice()).toHaveText(
      tokenPrice(
        new SafeDecimal(sell.min).times(1 - undercutRate).toString(),
        quote
      )
    );
    await sellTooltip.waitForDetached();
  });
};
