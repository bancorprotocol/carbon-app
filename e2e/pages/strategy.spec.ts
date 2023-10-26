import { test } from '@playwright/test';
import { navigateTo, screenshot } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/debug';
import { testCreateLimitStrategy } from '../utils/strategy';

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('First Strategy Page', async ({ page }) => {
    await navigateTo(page, '/');
    await page.getByTestId('first-strategy').waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });

  testCreateLimitStrategy({
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
  });
});
