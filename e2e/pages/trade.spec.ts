import { test, expect } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import {
  DebugDriver,
  removeFork,
  setupVirtualNetwork,
  setupLocalStorage,
} from '../utils/DebugDriver';
import { TradeDriver } from '../utils/TradeDriver';
import { navigateTo } from '../utils/operators';
import { TokenApprovalDriver } from '../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../utils/tenderly';
import { TradeTestCase } from '../utils/trade/types';

const testCases: TradeTestCase[] = [
  {
    mode: 'buy' as const,
    base: 'ETH',
    quote: 'USDC',
    swaps: [
      {
        sourceValue: '100',
        targetValue: '0.059554032010090174',
      },
    ],
  },
  {
    mode: 'sell' as const,
    base: 'USDC',
    quote: 'USDT',
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
    ],
  },
  {
    mode: 'sell' as const,
    base: 'USDC',
    quote: 'USDT',
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
    base: 'ETH',
    quote: 'USDC',
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
  const { mode, base, quote, isLimitedApproval } = testCase;

  const numSwaps = testCase.swaps.length;
  const nameSwapSuffix = numSwaps > 1 ? ` ${numSwaps} times` : '';
  const approvalSuffix = isLimitedApproval ? ' with limited approval ' : '';

  const testName =
    mode === 'buy' ? `Buy ${quote} with ${base}` : `Sell ${base} for ${quote}`;

  return testName + nameSwapSuffix + approvalSuffix;
};

test.describe('Trade', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(90_000);
    await mockApi(page);
    const vNet = await setupVirtualNetwork(testInfo);
    const rpc = vNet.rpcs.find(({ name }) => name === 'Admin RPC')!.url;
    await setupLocalStorage(page, rpc);
    const debug = new DebugDriver(page);
    await debug.visit();
    await debug.setupImposter();
  });

  // Need an empty object else the tests don't run
  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await removeFork(testInfo);
  });

  for (const testCase of testCases) {
    const { mode, base, quote, swaps, isLimitedApproval } = testCase;
    const source = mode === 'sell' ? base : quote;
    const target = mode === 'sell' ? quote : base;

    const testName = testDescription(testCase);
    test(testName, async ({ page }) => {
      // Store current balance
      const debug = new DebugDriver(page);
      const initialBalance = {
        base: await debug.getBalance(base).textContent(),
        quote: await debug.getBalance(quote).textContent(),
      };

      // Test Trade
      await navigateTo(page, '/trade/*?*');
      await page.getByTestId('market').click();
      const driver = new TradeDriver(page, testCase);
      const tokenApproval = new TokenApprovalDriver(page);

      await driver.selectToken('base');
      await driver.selectToken('quote');
      await driver.setMode(mode);

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
        await expect(driver.getPayInput()).toHaveValue('');
        await expect(driver.getReceiveInput()).toHaveValue('');
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
        },
      );
      const sourceDelta = Number(initialBalance.base) - Number(sourceValue);
      const nextSource = new RegExp(sourceDelta.toString());
      await expect(debug.getBalance(source)).toHaveText(nextSource);
      const targetDelta = Number(initialBalance.quote) + Number(targetValue);
      const nextTarget = new RegExp(targetDelta.toString());
      await expect(debug.getBalance(target)).toHaveText(nextTarget);
    });
  }
});
