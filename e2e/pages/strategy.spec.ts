import { test, expect } from '@playwright/test';
import { navigateTo, screenshot, waitFor } from '../utils/operators';
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
    const { base, quote } = config;
    return test(`Create Limit Strategy ${base}->${quote}`, async ({ page }) => {
      test.setTimeout(180_000);
      await waitFor(page, `balance-${quote}`, 30_000);

      await navigateTo(page, '/');
      const myStrategies = new MyStrategyDriver(page);
      const createForm = new CreateStrategyDriver(page, config);
      await myStrategies.createStrategy();
      await createForm.selectToken('base');
      await createForm.selectToken('quote');
      await createForm.nextStep();
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
      const strategies = await myStrategies.getAllStrategies();
      await expect(strategies).toHaveCount(1);
      const strategy = await myStrategies.getStrategy(1);
      await expect(strategy.pair()).toHaveText(`${base}/${quote}`);
      await expect(strategy.status()).toHaveText('Active');
      await expect(strategy.totalBudget()).toHaveText('$3,344');
      await expect(strategy.buyBudget()).toHaveText(`10 ${quote}`);
      await expect(strategy.buyBudgetFiat()).toHaveText('$10.00');
      await expect(strategy.sellBudgetFiat()).toHaveText('$3,334');
    });
  },
  symmetric: (config: CreateStrategyConfig) => {
    const { base, quote } = config;
    return test(`Create Symmetric Strategy ${base}->${quote}`, async ({
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
      // const buy = await createForm.fillLimit('buy');
      // const sell = await createForm.fillLimit('sell');

      // // Assert 100% outcome
      // await expect(buy.outcomeValue()).toHaveText(`0.006666 ${base}`);
      // await expect(buy.outcomeQuote()).toHaveText(`1,500 ${quote}`);
      // await expect(sell.outcomeValue()).toHaveText(`3,400 ${quote}`);
      // await expect(sell.outcomeQuote()).toHaveText(`1,700 ${quote}`);

      // await createForm.submit();

      // await checkApproval(page, [base, quote]);

      // await page.waitForURL('/', { timeout: 10_000 });

      // // Verfiy notification
      // const notif = new NotificationDriver(page, 'create-strategy');
      // await expect(notif.getTitle()).toHaveText('Success');
      // await expect(notif.getDescription()).toHaveText(
      //   'New strategy was successfully created.'
      // );

      // // Verify strategy data
      // const strategies = await myStrategies.getAllStrategies();
      // await expect(strategies).toHaveCount(1);
      // const strategy = await myStrategies.getStrategy(1);
      // await expect(strategy.pair()).toHaveText(`${base}/${quote}`);
      // await expect(strategy.status()).toHaveText('Active');
      // await expect(strategy.totalBudget()).toHaveText('$3,344');
      // await expect(strategy.buyBudget()).toHaveText(`10 ${quote}`);
      // await expect(strategy.buyBudgetFiat()).toHaveText('$10.00');
      // await expect(strategy.sellBudgetFiat()).toHaveText('$3,334');
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
      type: 'recurring',
      setting: 'limit',
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '1500',
        max: '1500',
        budget: '10',
      },
      sell: {
        min: '1700',
        max: '1700',
        budget: '2',
      },
    },
    {
      type: 'recurring',
      setting: 'symmetric',
      base: 'BNT',
      quote: 'ETH',
      buy: {
        min: '1500',
        max: '2000',
        budget: '10',
      },
      sell: {
        min: '1500',
        max: '2000',
        budget: '2',
      },
    },
  ];

  for (const config of configs) {
    testStrategy[config.setting](config);
  }
});
