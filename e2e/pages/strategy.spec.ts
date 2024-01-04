import { test, expect } from '@playwright/test';
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
      test.setTimeout(180_000);
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
  test.beforeEach(async ({ page, storageState }, testInfo) => {
    await setupFork(page, testInfo, storageState as string);
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

  test('Edit Price Strategy', async ({ page }) => {
    test.setTimeout(180_000);

    const strategy = await createStrategyTest(configs[0], page);
    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);
    const value = await strategy
      .getManageDropdownItem('manage-strategy-editPrices')
      .innerText();
    expect(value).toBe('Edit Prices');
    await strategy.getManageDropdownItem('manage-strategy-editPrices').click();
    await page.waitForURL('/strategies/edit?type=editPrices', {
      timeout: 10_000,
    });
    await page.getByTestId('input-limit-buy').fill('1000');
    await page.getByTestId('input-limit-sell').fill('1200');
    await page.getByTestId('edit-strategy-prices-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    // Verfiy notification
    const notif = new NotificationDriver(page, 'change-rates-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your strategy was successfully updated.'
    );
    // await page.
  });

  test('Deposit Strategy', async ({ page }) => {
    test.setTimeout(180_000);
    const { base, quote, buy, sell } = configs[0];

    const strategy = await createStrategyTest(configs[0], page);
    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);

    await strategy
      .getManageDropdownItem('manage-strategy-depositFunds')
      .click();

    await page.waitForURL('/strategies/edit?type=deposit', {
      timeout: 10_000,
    });

    // await page.waitForTimeout(5000);

    await page
      .getByTestId('budget-deposit-buy-input')
      .fill((configs[0].buy.budget / 2).toString());
    await page
      .getByTestId('budget-deposit-sell-input')
      .fill((configs[0].sell.budget / 2).toString());

    await page.getByTestId('deposit-withdraw-confirm-btn').click();

    // await checkApproval(page, [base, quote]);

    await page.waitForURL('/', { timeout: 20_000 });

    // Verfiy notification
    const notif = new NotificationDriver(page, 'deposit-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your deposit request was successfully completed.'
    );

    const myStrategies = new MyStrategyDriver(page);

    // Verify strategy data
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(1);
    const strategyNew = await myStrategies.getStrategy(1);
    await expect(strategyNew.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyNew.status()).toHaveText('Active');
    await expect(strategyNew.buyBudget()).toHaveText(
      tokenPrice(buy.budget + buy.budget / 2, quote)
    );
    await expect(strategyNew.sellBudget()).toHaveText(
      tokenPrice(sell.budget + sell.budget / 2, base)
    );
  });

  test('Withdraw Strategy', async ({ page }) => {
    test.setTimeout(180_000);

    const strategy = await createStrategyTest(configs[0], page);
    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);

    await strategy
      .getManageDropdownItem('manage-strategy-withdrawFunds')
      .click();

    const modal = await waitModalOpen(page);
    await modal.getByTestId('withdraw-strategy-btn').click();

    await page.waitForURL('/strategies/edit?type=withdraw', {
      timeout: 10_000,
    });

    await page.waitForTimeout(5000);

    await page
      .getByTestId('budget-withdraw-buy-input')
      .fill((configs[0].buy.budget / 2).toString());
    await page
      .getByTestId('budget-withdraw-sell-input')
      .fill((configs[0].sell.budget / 2).toString());

    await page.getByTestId('deposit-withdraw-confirm-btn').click();
    await page.waitForTimeout(5000);

    await page.waitForURL('/', { timeout: 20_000 });

    // Verfiy notification
    const notif = new NotificationDriver(page, 'withdraw-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your withdrawal request was successfully completed.'
    );

    const myStrategies = new MyStrategyDriver(page);
    const { base, quote, buy, sell } = configs[0];

    // Verify strategy data
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(1);
    const strategyNew = await myStrategies.getStrategy(1);
    await expect(strategyNew.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyNew.status()).toHaveText('Active');
    await expect(strategyNew.buyBudget()).toHaveText(
      tokenPrice(buy.budget / 2, quote)
    );
    await expect(strategyNew.sellBudget()).toHaveText(
      tokenPrice(sell.budget / 2, base)
    );
  });

  test('Pause Strategy', async ({ page }) => {
    test.setTimeout(180_000);

    const strategy = await createStrategyTest(configs[0], page);
    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);

    await strategy
      .getManageDropdownItem('manage-strategy-pauseStrategy')
      .click();

    const modal = await waitModalOpen(page);
    await modal.getByTestId('pause-strategy-btn').click();

    // Verfiy notification
    const notif = new NotificationDriver(page, 'pause-strategy');

    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your strategy was successfully paused.'
    );
  });

  test('Renew Strategy', async ({ page }) => {
    test.setTimeout(180_000);

    const strategy = await createStrategyTest(configs[0], page);
    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);

    await strategy
      .getManageDropdownItem('manage-strategy-pauseStrategy')
      .click();

    const modalPause = await waitModalOpen(page);
    await modalPause.getByTestId('pause-strategy-btn').click();

    // Verfiy notification
    const notifPause = new NotificationDriver(page, 'pause-strategy');

    await expect(notifPause.getTitle()).toHaveText('Success');
    await expect(notifPause.getDescription()).toHaveText(
      'Your strategy was successfully paused.'
    );

    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);

    await strategy
      .getManageDropdownItem('manage-strategy-renewStrategy')
      .click();

    await page.waitForURL('/strategies/edit?type=renew', {
      timeout: 10_000,
    });
    await page.getByTestId('input-limit-buy').fill('1000');
    await page.getByTestId('input-limit-sell').fill('1200');
    await page.getByTestId('edit-strategy-prices-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    // Verfiy notification
    const notifRenew = new NotificationDriver(page, 'renew-strategy');
    await expect(notifRenew.getTitle()).toHaveText('Success');
    await expect(notifRenew.getDescription()).toHaveText(
      'Your request to renew the strategy was successfully completed.'
    );
  });

  test('Duplicate Strategy', async ({ page }) => {
    test.setTimeout(180_000);

    const strategy = await createStrategyTest(configs[0], page);
    await page.waitForTimeout(10000);

    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);

    await strategy
      .getManageDropdownItem('manage-strategy-duplicateStrategy')
      .click();

    await page.waitForURL('/strategies/create?strategy=*', {
      timeout: 10_000,
    });

    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, configs[0]);

    const { base, quote, buy, sell } = configs[0];

    await createForm.submit();
    // await checkApproval(page, [base, quote]);

    await page.waitForURL('/', { timeout: 10_000 });

    // Verfiy notification
    const notif = new NotificationDriver(page, 'create-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'New strategy was successfully created.'
    );
    await page.waitForTimeout(2000);

    // Verify strategy data
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);
    const strategyDuplicate = await myStrategies.getStrategy(2);
    await expect(strategyDuplicate.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategyDuplicate.status()).toHaveText('Active');
    await expect(strategyDuplicate.totalBudget()).toHaveText(
      fiatPrice(buy.budgetFiat + sell.budgetFiat)
    );
    await expect(strategyDuplicate.buyBudget()).toHaveText(
      tokenPrice(buy.budget, quote)
    );
    await expect(strategyDuplicate.buyBudgetFiat()).toHaveText(
      fiatPrice(buy.budgetFiat)
    );
    await expect(strategyDuplicate.sellBudget()).toHaveText(
      tokenPrice(sell.budget, base)
    );
    await expect(strategyDuplicate.sellBudgetFiat()).toHaveText(
      fiatPrice(sell.budgetFiat)
    );
  });

  test('Delete Strategy', async ({ page }) => {
    test.setTimeout(180_000);

    const strategy = await createStrategyTest(configs[0], page);
    await strategy.manageButton().click();
    await waitFor(page, 'manage-strategy-dropdown', 10_000);

    await strategy
      .getManageDropdownItem('manage-strategy-deleteStrategy')
      .click();

    const modal = await waitModalOpen(page);
    await modal.getByTestId('delete-strategy-btn').click();

    // Verfiy notification
    const notif = new NotificationDriver(page, 'delete-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Strategy was successfully deleted and all associated funds have been withdrawn to your wallet.'
    );
  });
});
