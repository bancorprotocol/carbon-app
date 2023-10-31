import { test, expect } from '@playwright/test';
import { navigateTo, screenshot, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/DebugDriver';
import { CreateStrategyDriver, MyStrategyDriver } from '../utils/strategy';
import { NotificationDriver } from '../utils/NotificationDriver';
import { checkApproval } from '../utils/modal';

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('First Strategy Page', async ({ page }) => {
    await navigateTo(page, '/');
    const driver = new MyStrategyDriver(page);
    await driver.firstStrategy().waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });

  const configs = [
    {
      base: 'ETH',
      quote: 'DAI',
      buy: {
        price: '1500',
        budget: '10',
      },
      sell: {
        price: '1700',
        budget: '2',
      },
    },
  ];

  for (const config of configs) {
    const { base, quote } = config;
    test(`Create Limit Strategy ${base}->${quote}`, async ({ page }) => {
      test.setTimeout(180_000);
      await waitFor(page, `balance-${quote}`, 30_000);

      await navigateTo(page, '/');
      const myStrategies = new MyStrategyDriver(page);
      const createForm = new CreateStrategyDriver(page, config);
      await myStrategies.createStrategy();
      await createForm.selectBase();
      await createForm.selectQuote();
      const buy = await createForm.fillLimit('buy');
      const sell = await createForm.fillLimit('sell');

      // Assert 100% outcome
      await expect(buy.outcomeValue()).toHaveText(`0.006666 ${base}`);
      await expect(buy.outcomeQuote()).toHaveText(`1,500 ${quote}`);
      await expect(sell.outcomeValue()).toHaveText(`3,400 ${quote}`);
      await expect(sell.outcomeQuote()).toHaveText(`1,700 ${quote}`);

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
      const strategies = await myStrategies.getAllStrategy();
      await expect(strategies).toHaveCount(1);
      const strategy = await myStrategies.getStrategy(1);
      await expect(strategy.pair()).toHaveText(`${base}/${quote}`);
      await expect(strategy.status()).toHaveText('Active');
      await expect(strategy.totalBudget()).toHaveText('$3,344');
      await expect(strategy.buyBudget()).toHaveText(`10 ${quote}`);
      await expect(strategy.buyBudgetFiat()).toHaveText('$10.00');
      await expect(strategy.sellBudgetFiat()).toHaveText('$3,334');
    });
  }
});
