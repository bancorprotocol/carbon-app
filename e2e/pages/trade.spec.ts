/* eslint-disable prettier/prettier */
import { test, expect } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import { DebugDriver, setupImposter } from '../utils/debug';
import { testTrade } from '../utils/trade';
import { navigateTo } from '../utils/operators';

test.describe('Trade', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });

  test('Buy ETH with USDC', async ({ page }) => {
    test.setTimeout(120_000);
    const config = {
      mode: 'buy' as const,
      source: 'USDC',
      target: 'ETH',
      sourceValue: '100',
      targetValue: '0.059554032010090174',
    };
    // Store current balance
    const debug = new DebugDriver(page);
    const balance = {
      source: await debug.getBalance(config.source).textContent(),
      target: await debug.getBalance(config.target).textContent(),
    };

    // Test Trade
    await navigateTo(page, '/trade?*');
    await testTrade(page, config);

    // Check balance diff
    await navigateTo(page, '/debug');
    const sourceDelta = Number(balance.source) - Number(config.sourceValue);
    const nextSource = new RegExp(sourceDelta.toString());
    await expect(debug.getBalance(config.source)).toHaveText(nextSource);
    const targetDelta = Number(balance.target) + Number(config.targetValue);
    const nextTarget = new RegExp(targetDelta.toString());
    await expect(debug.getBalance(config.target)).toHaveText(nextTarget);
  });

  test('Sell USDC for USDT', async ({ page }) => {
    test.setTimeout(120_000);
    const config = {
      mode: 'sell' as const,
      source: 'USDC',
      target: 'USDT',
      sourceValue: '100',
      targetValue: '100.047766',
    };
    // Store current balance
    const debug = new DebugDriver(page);
    const balance = {
      source: await debug.getBalance(config.source).textContent(),
      target: await debug.getBalance(config.target).textContent(),
    };

    // Test Trade
    await navigateTo(page, '/trade?*');
    await testTrade(page, config);

    // Check balance diff
    await navigateTo(page, '/debug');
    const sourceDelta = Number(balance.source) - Number(config.sourceValue);
    const nextSource = new RegExp(sourceDelta.toString());
    await expect(debug.getBalance(config.source)).toHaveText(nextSource);
    const targetDelta = Number(balance.target) + Number(config.targetValue);
    const nextTarget = new RegExp(targetDelta.toString());
    await expect(debug.getBalance(config.target)).toHaveText(nextTarget);
  });
});
