import { describe, test, expect, beforeAll, afterAll, vitest } from 'vitest';
import {
  MockServer,
  marketRateHandler,
  mockStrategy,
  renderWithRouter,
  screen,
  userEvent,
} from 'libs/testing-library';
import { EditStrategyDriver } from 'libs/testing-library/drivers/EditStrategyDriver';
import { EditBudgetRecurringPage } from './recurring';
import { EditStrategyProvider } from 'components/strategies/edit/EditStrategyContext';
import { Strategy } from 'libs/queries';
import { carbonSDK } from 'libs/sdk';
import { spyOn } from '@vitest/spy';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import {
  mockMarketRate,
  MockStrategyParams,
  priceHistoryHandler,
} from 'libs/testing-library/utils/mock';
import * as balanceQueries from 'libs/queries/chain/balance';

const basePath = '/strategies/edit/$strategyId/budget/recurring';
const getUrl = (id: string) => `/strategies/edit/${id}/budget/recurring`;

const marketRates = mockMarketRate({ USDC: 1, ETH: 2.5 });
const mockServer = new MockServer([
  marketRateHandler(marketRates),
  priceHistoryHandler([]),
]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

const baseBuy = {
  balance: '1',
  startRate: '1',
  endRate: '2',
  marginalRate: '1.5',
};
const baseSell = {
  balance: '1',
  startRate: '3',
  endRate: '4',
  marginalRate: '3.5',
};

const renderPage = async (
  type: 'deposit' | 'withdraw',
  strategyParams: MockStrategyParams,
  baseSearch: Record<string, string> = {},
) => {
  const strategy: Strategy = mockStrategy(strategyParams);
  const search = { editType: type, ...baseSearch };
  const { router } = await renderWithRouter({
    component: () => (
      <EditStrategyProvider strategy={strategy}>
        <EditStrategyLayout editType={type}>
          <EditBudgetRecurringPage />
        </EditStrategyLayout>
      </EditStrategyProvider>
    ),
    basePath,
    search,
    params: { strategyId: strategy.id },
  });
  return { strategy, router };
};

describe('Edit budget recurring page', () => {
  const user = userEvent.setup();
  const driver = new EditStrategyDriver(screen);
  vitest
    .spyOn(balanceQueries, 'useGetTokenBalance')
    .mockImplementation(() => ({ data: '1000' }) as any);

  test('Form should have the value from the search', async () => {
    const search = { editType: 'deposit', buyBudget: '2' };
    const { strategy, router } = await renderPage(
      'deposit',
      {
        base: 'ETH',
        quote: 'USDC',
        order0: baseBuy,
        order1: baseSell,
      },
      search,
    );
    const url = getUrl(strategy.id);

    // Check search params
    expect(router.state.location.pathname).toBe(url);
    expect(router.state.location.search).toStrictEqual(search);

    const form = await driver.findRecurringForm();
    expect(form.buy.budget()).toHaveValue('2');
    expect(form.sell.budget()).toHaveValue('');
  });

  test('should only send to the SDK what has been changed', async () => {
    const { strategy } = await renderPage('deposit', {
      base: 'ETH',
      quote: 'USDC',
      order0: baseBuy,
      order1: baseSell,
    });

    const form = await driver.findRecurringForm();

    // Check form
    await user.type(form.buy.budget(), '2');
    expect(form.buy.budget()).toHaveValue('2');
    const spy = spyOn(carbonSDK, 'updateStrategy');
    await user.click(form.submit());
    expect(spy).toHaveBeenCalledWith(
      strategy.id,
      strategy.encoded,
      { buyBudget: '3' },
      undefined,
      undefined,
    );
  });

  describe('Budget distribution', () => {
    test('Show when marginal buy price is above min & sell price below max', async () => {
      await renderPage('deposit', {
        base: 'ETH',
        quote: 'USDC',
        order0: baseBuy,
        order1: baseSell,
      });

      const form = await driver.findRecurringForm();
      expect(form.buy.distributeBudget()).toBeNull();
      expect(form.sell.distributeBudget()).toBeNull();
      await user.type(form.buy.budget(), '1');
      await user.type(form.sell.budget(), '1');
      expect(form.buy.distributeBudget()).toBeVisible();
      expect(form.sell.distributeBudget()).toBeVisible();
    });
    test('Do not show when marginal buy price is max or sell price is min', async () => {
      await renderPage('deposit', {
        base: 'ETH',
        quote: 'USDC',
        order0: {
          ...baseBuy,
          marginalRate: '2',
        },
        order1: {
          ...baseSell,
          marginalRate: '3',
        },
      });

      const form = await driver.findRecurringForm();
      await user.type(form.buy.budget(), '1');
      await user.type(form.sell.budget(), '1');
      expect(form.buy.distributeBudget()).toBeNull();
      expect(form.sell.distributeBudget()).toBeNull();
    });
    test('Do not show when no initial balance', async () => {
      await renderPage('deposit', {
        base: 'ETH',
        quote: 'USDC',
        order0: {
          ...baseBuy,
          balance: '0',
        },
        order1: {
          ...baseSell,
          balance: '0',
        },
      });

      const form = await driver.findRecurringForm();
      await user.type(form.buy.budget(), '1');
      expect(form.buy.distributeBudget()).toBeNull();
    });
  });
});
