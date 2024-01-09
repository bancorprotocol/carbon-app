import { test, expect } from '@playwright/test';
import {
  fiatPrice,
  navigateTo,
  screenshot,
  tokenPrice,
  waitFor,
} from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/DebugDriver';
import {
  CreateStrategyConfig,
  CreateStrategyDriver,
  MyStrategyDriver,
} from '../utils/strategy';
import { NotificationDriver } from '../utils/NotificationDriver';
import { checkApproval } from '../utils/modal';

const testStrategy = {
  limit: (config: CreateStrategyConfig) => {
    const { base, quote, buy, sell } = config;
    return test(`Create Limit Strategy ${base}->${quote}`, async ({ page }) => {
      test.setTimeout(180_000);
      await waitFor(page, `balance-${quote}`, 30_000);

      await navigateTo(page, '/');
      const myStrategies = new MyStrategyDriver(page);
      const createForm = new CreateStrategyDriver(page, config);
      await myStrategies.createStrategy();
      await createForm.selectToken('base');
      await createForm.selectToken('quote');
      await createForm.selectSetting('two-ranges');
      await createForm.nextStep();
      const buyForm = await createForm.fillLimit('buy');
      const sellForm = await createForm.fillLimit('sell');

      // Assert 100% outcome
      await expect(buyForm.outcomeValue()).toHaveText(`0.006666 ${base}`);
      await expect(buyForm.outcomeQuote()).toHaveText(
        tokenPrice(buy.min, quote)
      );
      await expect(sellForm.outcomeValue()).toHaveText(`3,400 ${quote}`);
      await expect(sellForm.outcomeQuote()).toHaveText(
        tokenPrice(sell.min, quote)
      );

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
        fiatPrice(buy.budgetFiat + sell.budgetFiat)
      );
      await expect(strategy.buyBudget()).toHaveText(
        tokenPrice(buy.budget, quote)
      );
      await expect(strategy.buyBudgetFiat()).toHaveText(
        fiatPrice(buy.budgetFiat)
      );
      await expect(strategy.sellBudget()).toHaveText(
        tokenPrice(sell.budget, base)
      );
      await expect(strategy.sellBudgetFiat()).toHaveText(
        fiatPrice(sell.budgetFiat)
      );
    });
  },
  overlapping: (config: CreateStrategyConfig) => {
    const { base, quote, buy, sell } = config;
    return test(`Create Overlapping Strategy ${base}->${quote}`, async ({
      page,
    }) => {
      test.setTimeout(180_000);
      await waitFor(page, `balance-${quote}`, 30_000);

      await navigateTo(page, '/');
      const myStrategies = new MyStrategyDriver(page);
      const createForm = new CreateStrategyDriver(page, config);
      await myStrategies.createStrategy();
      await createForm.selectToken('base');
      await createForm.selectToken('quote');
      await createForm.selectSetting('overlapping');
      await createForm.nextStep();

      const overlappingForm = await createForm.fillOverlapping();
      expect(overlappingForm.max()).toHaveValue(config.sell.max.toString());

      await screenshot(page, `[Create Overlapping Strategy] Form`);
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
        fiatPrice(buy.budgetFiat + sell.budgetFiat)
      );
      await expect(strategy.buyBudget()).toHaveText(
        tokenPrice(buy.budget, quote)
      );
      await expect(strategy.buyBudgetFiat()).toHaveText(
        fiatPrice(buy.budgetFiat)
      );
      await expect(strategy.sellBudget()).toHaveText(
        tokenPrice(sell.budget, base)
      );
      await expect(strategy.sellBudgetFiat()).toHaveText(
        fiatPrice(sell.budgetFiat)
      );
      const sellTooltip = await strategy.priceTooltip('sell');
      await expect(sellTooltip.minPrice()).toHaveText(
        tokenPrice(sell.min, quote)
      );
      await sellTooltip.waitForDetached();
      const buyTooltip = await strategy.priceTooltip('buy');
      await expect(buyTooltip.maxPrice()).toHaveText(
        tokenPrice(buy.max, quote)
      );
      await buyTooltip.waitForDetached();
      await notif.close();
      await screenshot(page, `[Create Overlapping Strategy] My Strategy`);
    });
  },
};

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

  const configs: CreateStrategyConfig[] = [
    {
      setting: 'limit',
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: 1500,
        max: 1500,
        budget: 10,
        budgetFiat: 10,
      },
      sell: {
        min: 1700,
        max: 1700,
        budget: 2,
        budgetFiat: 3334,
      },
    },
    {
      setting: 'overlapping',
      base: 'BNT',
      quote: 'USDC',
      buy: {
        min: 0.3,
        max: 0.545454,
        budget: 12.501572,
        budgetFiat: 12.5,
      },
      sell: {
        min: 0.33,
        max: 0.6,
        budget: 30,
        budgetFiat: 12.61,
      },
      spread: 10, // Need a large spread for tooltip test
    },
  ];

  for (const config of configs) {
    testStrategy[config.setting](config);
  }
});
