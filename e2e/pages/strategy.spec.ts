/* eslint-disable prettier/prettier */
import { test, expect } from '@playwright/test';
import { navigateTo, screenshot, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/debug';
import { createStrategy, prepareLimitStrategy } from '../utils/strategy';

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('First Strategy Page', async ({ page }) => {
    await navigateTo(page, '/');
    await page.getByTestId('first-strategy').waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });

  test('Create Limit Strategy ETH->DAI', async ({ page }) => {
    test.setTimeout(180_000);
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
    const { base, quote } = config;
    await waitFor(page, `balance-${quote}`, 20_000);

    await navigateTo(page, '/');
    await prepareLimitStrategy(page, config);

    // Assert 100% outcome
    const buy = page.getByTestId('buy-section');
    await expect(buy.getByTestId('outcome-value')).toHaveText(
      `0.006666 ${base}`
    );
    await expect(buy.getByTestId('outcome-quote')).toHaveText(`1,500 ${quote}`);
    const sell = page.getByTestId('sell-section');
    await expect(sell.getByTestId('outcome-value')).toHaveText(
      `3,400 ${quote}`
    );
    await expect(sell.getByTestId('outcome-quote')).toHaveText(
      `1,700 ${quote}`
    );

    await createStrategy(page, config);
    await page.waitForURL('/', { timeout: 10_000 });

    // Verfiy notification
    const notif = page.getByTestId('notification-create-strategy');
    await expect(notif.getByTestId('notif-title')).toHaveText('Success');
    await expect(notif.getByTestId('notif-description')).toHaveText(
      'New strategy was successfully created.'
    );

    // Verify strategy data
    const strategies = page.locator('[data-testid="strategy-list"] > li');
    await strategies.waitFor({ state: 'visible' });
    await expect(strategies).toHaveCount(1);
    const [strategy] = await strategies.all();
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
