import { test, expect } from '@playwright/test';
import { navigateTo, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { DebugDriver, setupImposter } from '../utils/DebugDriver';
import { MyStrategyDriver } from '../utils/strategy';

test.describe('Debug', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('Create a strategy from Debug page', async ({ page }) => {
    test.setTimeout(180_000);
    await waitFor(page, `balance-DAI`, 30_000);
    await waitFor(page, `balance-ETH`, 30_000);
    const debug = new DebugDriver(page);
    await debug.createStrategy({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '1000',
        max: '1100',
        budget: '1',
      },
      sell: {
        min: '1500',
        max: '1600',
        budget: '1',
      },
    });
    await navigateTo(page, '/');
    const myStrategies = new MyStrategyDriver(page);
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(1);
    const strategy = await myStrategies.getStrategy(1);
    await expect(strategy.pair()).toHaveText(`ETH/DAI`);
    await expect(strategy.status()).toHaveText('Active');
    await expect(strategy.buyBudget()).toHaveText('1 DAI');
    await expect(strategy.sellBudget()).toHaveText('1 ETH');
  });
});
