import { test, expect } from '@playwright/test';
import { navigateTo, screenshot, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/DebugDriver';
import { CreateStrategyDriver } from '../utils/strategy';
import { NotificationDriver } from '../utils/NotificationDriver';
import { checkApproval } from '../utils/modal';
import { MyStrategyDriver } from '../utils/strategy/MyStrategyDriver';

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('First Strategy Page', async ({ page }) => {
    await navigateTo(page, '/');
    await page.getByTestId('first-strategy').waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });

  test(`Create Limit Strategy ETH->DAI`, async ({ page }) => {
    const config = {
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
    };
    test.setTimeout(180_000);
    const { base, quote } = config;
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/');
    const createForm = new CreateStrategyDriver(page, config);
    await page.getByTestId('create-strategy-desktop').click();
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
    const myStrategies = new MyStrategyDriver(page);
    const strategies = await myStrategies.getAllStrategy();
    expect(strategies.length).toBe(1);
    const strategy = strategies[0];
    await expect(strategy.getByTestId('token-pair')).toHaveText(
      `${base}/${quote}`
    );
    await expect(strategy.getByTestId('status')).toHaveText('Active');
    await expect(strategy.getByTestId('total-budget')).toHaveText('$3,344');
    await expect(strategy.getByTestId('buy-budget')).toHaveText(`10 ${quote}`);
    await expect(strategy.getByTestId('buy-budget-fiat')).toHaveText('$10.00');
    await expect(strategy.getByTestId('sell-budget-fiat')).toHaveText('$3,334');
  });
});
