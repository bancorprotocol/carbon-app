/* eslint-disable prettier/prettier */
import { test, expect } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import { DebugDriver } from '../utils/DebugDriver';
import { TradeDriver } from '../utils/TradeDriver';
import { navigateTo } from '../utils/operators';
import { checkApproval } from '../utils/modal';
import { NotificationDriver } from '../utils/NotificationDriver';

test.describe('Trade', () => {
  test.beforeEach(async ({ page }) => {
    const debug = new DebugDriver(page);
    await debug.visit();
    await Promise.all([mockApi(page), debug.setupImposter(), debug.setE2E()]);
  });

  const configs = [
    {
      mode: 'buy' as const,
      source: 'USDC',
      target: 'ETH',
      sourceValue: '100',
      targetValue: '0.059554032010090174',
    },
    {
      mode: 'sell' as const,
      source: 'USDC',
      target: 'USDT',
      sourceValue: '100',
      targetValue: '100.047766',
    },
  ];

  for (const config of configs) {
    const { mode, source, target, sourceValue, targetValue } = config;
    const testName =
      mode === 'buy'
        ? `Buy ${target} with ${source}`
        : `Sell ${source} for ${target}`;

    test(testName, async ({ page }) => {
      test.setTimeout(120_000);
      // Store current balance
      const debug = new DebugDriver(page);
      const balance = {
        source: await debug.getBalance(config.source).textContent(),
        target: await debug.getBalance(config.target).textContent(),
      };

      // Test Trade
      await navigateTo(page, '/trade?*');
      const driver = new TradeDriver(page, config);

      // Select pair
      await driver.selectPair();
      await driver.setPay();
      await expect(driver.getReceiveInput()).toHaveValue(targetValue);

      // Verify routing
      const routing = await driver.openRouting();
      await expect(routing.getSource()).toHaveValue(sourceValue);
      await expect(routing.getTarget()).toHaveValue(targetValue);
      await routing.close();

      await driver.submit();

      // Token approval
      await checkApproval(page, [config.source]);

      // Verify notification
      const notif = new NotificationDriver(page, 'trade');
      await expect(notif.getTitle()).toHaveText('Success', { timeout: 10_000 });
      await expect(notif.getDescription()).toHaveText(
        `Trading ${sourceValue} ${source} for ${target} was successfully completed.`,
        { timeout: 10_000 }
      );

      // Verify form empty
      expect(driver.getPayInput()).toHaveValue('');
      expect(driver.getReceiveInput()).toHaveValue('');

      // Check balance diff
      await navigateTo(page, '/debug');

      const sourceDelta = Number(balance.source) - Number(config.sourceValue);
      const nextSource = new RegExp(sourceDelta.toString());
      await expect(debug.getBalance(config.source)).toHaveText(nextSource);
      const targetDelta = Number(balance.target) + Number(config.targetValue);
      const nextTarget = new RegExp(targetDelta.toString());
      await expect(debug.getBalance(config.target)).toHaveText(nextTarget);
    });
  }
});
