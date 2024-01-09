import { test, expect } from '@playwright/test';
import { ManageStrategyDriver } from './../utils/strategy/ManageStrategyDriver';
import { CreateStrategyTemplate } from './../utils/strategy/template';
import { Page } from 'playwright-core';
import {
  fiatPrice,
  navigateTo,
  screenshot,
  tokenPrice,
  waitFor,
} from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { removeFork, setupFork, setupImposter } from '../utils/DebugDriver';
import {
  CreateStrategyConfig,
  CreateStrategyDriver,
  MyStrategyDriver,
} from '../utils/strategy';
import { NotificationDriver } from '../utils/NotificationDriver';
import { checkApproval, waitModalOpen } from '../utils/modal';

const createStrategyTest = async (config: CreateStrategyConfig, page: Page) => {
  const { base, quote, buy, sell } = config;

  test.setTimeout(45_000);
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
  await expect(buyForm.outcomeQuote()).toHaveText(tokenPrice(buy.min, quote));
  await expect(sellForm.outcomeValue()).toHaveText(`3,400 ${quote}`);
  await expect(sellForm.outcomeQuote()).toHaveText(tokenPrice(sell.min, quote));

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
  await expect(strategy.buyBudget()).toHaveText(tokenPrice(buy.budget, quote));
  await expect(strategy.buyBudgetFiat()).toHaveText(fiatPrice(buy.budgetFiat));
  await expect(strategy.sellBudget()).toHaveText(tokenPrice(sell.budget, base));
  await expect(strategy.sellBudgetFiat()).toHaveText(
    fiatPrice(sell.budgetFiat)
  );

  return strategy;
};

const testStrategy = {
  limit: (config: CreateStrategyConfig) => {
    const { base, quote } = config;
    return test(`Create Limit Strategy ${base}->${quote}`, async ({ page }) => {
      await createStrategyTest(config, page);
    });
  },
  overlapping: (config: CreateStrategyConfig) => {
    const { base, quote, buy, sell } = config;
    return test(`Create Overlapping Strategy ${base}->${quote}`, async ({
      page,
    }) => {
      test.setTimeout(45_000);
      await page.getByTestId('enable-overlapping-strategy').click();
      await waitFor(page, `balance-${quote}`, 30_000);

      await navigateTo(page, '/');
      const myStrategies = new MyStrategyDriver(page);
      const createForm = new CreateStrategyDriver(page, config);
      await myStrategies.createStrategy();
      await createForm.selectToken('base');
      await createForm.selectToken('quote');
      await createForm.selectSetting('overlapping');
      await createForm.nextStep();
      await createForm.fillOverlapping();

      // TODO Assert budget

      await createForm.submit();

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
      const buyTooltip = await strategy.priceTooltip('buy');
      await expect(buyTooltip.maxPrice()).toHaveText(
        tokenPrice(buy.max, quote)
      );
      const sellTooltip = await strategy.priceTooltip('sell');
      await expect(sellTooltip.minPrice()).toHaveText(
        tokenPrice(sell.min, quote)
      );
    });
  },
};

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await setupFork(page, testInfo);
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test.afterEach(async ({}, testInfo) => {
    await removeFork(testInfo);
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
    // {
    //   setting: 'overlapping',
    //   base: 'ETH',
    //   quote: 'BNT',
    //   buy: {
    //     min: 3000,
    //     max: 4900,
    //     budget: 0,
    //     budgetFiat: 0,
    //   },
    //   sell: {
    //     min: 3100,
    //     max: 5000,
    //     budget: 2,
    //     budgetFiat: 3334,
    //   },
    //   spread: 5,
    // },
  ];

  for (const config of configs) {
    testStrategy[config.setting](config);
  }

  const configsNew: CreateStrategyTemplate[] = [
    {
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '1500',
        max: '1500',
        budget: '10',
        budgetFiat: '10',
      },
      sell: {
        min: '1700',
        max: '1700',
        budget: '2',
        budgetFiat: '3334',
      },
    },
  ];

  test('Edit Price Strategy', async ({ page }) => {
    test.setTimeout(45_000);
    const config = configsNew[0];

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(config);
    await strategy.clickManageEntry('manage-strategy-editPrices');

    await page.waitForURL('/strategies/edit?type=editPrices', {
      timeout: 10_000,
    });

    const newBuyPrice = (parseFloat(config.buy.max) / 2).toString();
    const newSellPrice = (parseFloat(config.sell.max) / 2).toString();

    await manage.fillLimitPrice('buy', newBuyPrice);
    await manage.fillLimitPrice('sell', newSellPrice);
    await page.getByTestId('edit-strategy-prices-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notif = new NotificationDriver(page, 'change-rates-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your strategy was successfully updated.'
    );

    // TODO Assert new prices from tooltips
  });

  test('Deposit Strategy', async ({ page }) => {
    test.setTimeout(45_000);
    const config = configsNew[0];
    const { base, quote, buy, sell } = config;

    const buyBudget = parseFloat(buy.budget);
    const sellBudget = parseFloat(sell.budget);
    const depositBuyBudget = buyBudget / 2;
    const depositSellBudget = sellBudget / 2;
    const newBuyBudget = (buyBudget + depositBuyBudget).toString();
    const newSellBudget = (sellBudget + depositSellBudget).toString();

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(config);
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

  test('Withdraw Strategy', async ({ page }) => {
    test.setTimeout(45_000);
    const config = configsNew[0];
    const { base, quote, buy, sell } = config;

    const buyBudget = parseFloat(buy.budget);
    const sellBudget = parseFloat(sell.budget);
    const withdrawBuyBudget = buyBudget / 2;
    const withdrawSellBudget = sellBudget / 2;

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(config);
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

  const pauseStrategy = async (page: Page, config: CreateStrategyTemplate) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(config);
    await strategy.clickManageEntry('manage-strategy-pauseStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('pause-strategy-btn').click();

    const notif = new NotificationDriver(page, 'pause-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your strategy was successfully paused.'
    );

    await expect(strategy.status()).toHaveText('Inactive');

    return { strategy, manage };
  };

  test('Pause Strategy', async ({ page }) => {
    test.setTimeout(45_000);
    const config = configsNew[0];
    await pauseStrategy(page, config);
  });

  test('Renew Strategy', async ({ page }) => {
    test.setTimeout(45_000);
    const config = configsNew[0];
    const { strategy, manage } = await pauseStrategy(page, config);

    await strategy.clickManageEntry('manage-strategy-renewStrategy');
    await manage.waitForEditPage('renew');
    await manage.fillLimitPrice('buy', config.buy.max);
    await manage.fillLimitPrice('sell', config.sell.max);
    await page.getByTestId('edit-strategy-prices-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notifRenew = new NotificationDriver(page, 'renew-strategy');
    await expect(notifRenew.getTitle()).toHaveText('Success');
    await expect(notifRenew.getDescription()).toHaveText(
      'Your request to renew the strategy was successfully completed.'
    );

    await expect(strategy.status()).toHaveText('Active');
    // TODO Assert new prices from tooltips
  });

  test('Duplicate Strategy', async ({ page }) => {
    test.setTimeout(45_000);
    const config = configsNew[0];
    const { base, quote, buy, sell } = config;
    const buyBudgetFiat = parseFloat(buy.budgetFiat ?? '0');
    const sellBudgetFiat = parseFloat(sell.budgetFiat ?? '0');

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(config);
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

  test('Delete Strategy', async ({ page }) => {
    test.setTimeout(45_000);
    const config = configsNew[0];

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(config);
    await strategy.clickManageEntry('manage-strategy-deleteStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('delete-strategy-btn').click();

    const notif = new NotificationDriver(page, 'delete-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Strategy was successfully deleted and all associated funds have been withdrawn to your wallet.'
    );

    const myStrategies = new MyStrategyDriver(page);
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(0);
  });
});
