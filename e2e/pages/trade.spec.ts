/* eslint-disable prettier/prettier */
import { test } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/debug';
import { testTrade } from '../utils/trade';

test.describe('Trade', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });

  test('Buy ETH with USDC', async ({ page }) => {
    test.setTimeout(120_000);
    await testTrade(page, {
      mode: 'buy',
      source: 'USDC',
      target: 'ETH',
      sourceValue: '100',
      targetValue: '0.059554032010090174',
    });
  });

  test('Sell USDC for USDT', async ({ page }) => {
    test.setTimeout(120_000);
    await testTrade(page, {
      mode: 'sell',
      source: 'USDC',
      target: 'USDT',
      sourceValue: '100',
      targetValue: '100.047766',
    });
  });
});
