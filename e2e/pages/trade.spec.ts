/* eslint-disable prettier/prettier */
import { test, expect } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import {
  DebugDriver,
  removeFork,
  setupFork,
  setupLocalStorage,
} from '../utils/DebugDriver';
import { TradeDriver } from '../utils/TradeDriver';
import { navigateTo } from '../utils/operators';
import { TokenApprovalDriver } from '../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../utils/tenderly';
import { TradeTestCase } from '../utils/trade/types';
import { NotificationDriver } from '../utils/NotificationDriver';

const testCases: TradeTestCase[] = [
  {
    mode: 'buy' as const,
    source: 'USDC',
    target: 'ETH',
    swaps: [
      {
        sourceValue: '100',
        targetValue: '0.059554032010090174',
      },
    ],
  },
  {
    mode: 'sell' as const,
    source: 'USDC',
    target: 'USDT',
    isLimitedApproval: true,
    swaps: [
      {
        sourceValue: '10',
        targetValue: '10.004888',
      },
      {
        sourceValue: '10',
        targetValue: '10.004863',
      },
      {
        sourceValue: '10',
        targetValue: '10.004838',
      },
    ],
  },
  {
    mode: 'sell' as const,
    source: 'USDC',
    target: 'USDT',
    swaps: [
      {
        sourceValue: '10',
        targetValue: '10.004888',
      },
      {
        sourceValue: '10',
        targetValue: '10.004863',
      },
    ],
  },
  {
    mode: 'sell' as const,
    source: 'ETH',
    target: 'USDC',
    swaps: [
      {
        sourceValue: '0.005',
        targetValue: '7.939455',
      },
      {
        sourceValue: '0.005',
        targetValue: '7.93526',
      },
    ],
  },
];

const testDescription = (testCase: TradeTestCase) => {
  const { mode, source, target, isLimitedApproval } = testCase;

  const numSwaps = testCase.swaps.length;
  const nameSwapSuffix = numSwaps > 1 ? ` ${numSwaps} times` : '';
  const approvalSuffix = isLimitedApproval ? ' with limited approval ' : '';

  const testName =
    mode === 'buy'
      ? `Buy ${target} with ${source}`
      : `Sell ${source} for ${target}`;

  return testName + nameSwapSuffix + approvalSuffix;
};

test.describe('Trade', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(90_000);
    await mockApi(page);
    await setupFork(testInfo);
    await setupLocalStorage(page, testInfo);
    const debug = new DebugDriver(page);
    await debug.visit();
    await debug.setupImposter();
  });

  test.afterEach(async ({}, testInfo) => {
    await removeFork(testInfo);
  });

  for (const testCase of testCases) {
    const { source, target, swaps, isLimitedApproval } = testCase;

    const testName = testDescription(testCase);

    test(testName, async ({ page }) => {
      // Store current balance
      const debug = new DebugDriver(page);
      const initialBalance = {
        source: await debug.getBalance(source).textContent(),
        target: await debug.getBalance(target).textContent(),
      };

      // Test Trade
      await navigateTo(page, '/trade?*');
      const driver = new TradeDriver(page, testCase);
      const tokenApproval = new TokenApprovalDriver(page);

      // Select pair
      await driver.selectPair();

      for (const swap of swaps) {
        const { sourceValue, targetValue } = swap;

        await driver.setPay(swap);
        await expect(driver.getReceiveInput()).toHaveValue(targetValue);

        // Verify routing
        const routing = await driver.openRouting();
        await expect(routing.getSource()).toHaveValue(sourceValue);
        await expect(routing.getTarget()).toHaveValue(targetValue);
        await routing.close();

        await driver.submit();
        await waitForTenderlyRpc(page);

        // Token approval
        await tokenApproval.checkApproval([source], isLimitedApproval);

        // Verify form empty
        await driver.awaitSuccess();
        expect(driver.getPayInput()).toHaveValue('');
        expect(driver.getReceiveInput()).toHaveValue('');

        const notificationDriver = new NotificationDriver(page);
        await notificationDriver.closeAll();
      }

      // Check balance diff after all swaps
      await navigateTo(page, '/debug');

      const { sourceValue, targetValue } = swaps.reduce(
        (acc, swapValues) => {
          return {
            sourceValue: acc.sourceValue + Number(swapValues.sourceValue),
            targetValue: acc.targetValue + Number(swapValues.targetValue),
          };
        },
        {
          sourceValue: 0,
          targetValue: 0,
        }
      );
      const sourceDelta = Number(initialBalance.source) - Number(sourceValue);
      const nextSource = new RegExp(sourceDelta.toString());
      await expect(debug.getBalance(source)).toHaveText(nextSource);
      const targetDelta = Number(initialBalance.target) + Number(targetValue);
      const nextTarget = new RegExp(targetDelta.toString());
      await expect(debug.getBalance(target)).toHaveText(nextTarget);
    });
  }
});
