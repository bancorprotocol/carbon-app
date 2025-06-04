import { describe, test, expect, beforeAll, afterAll, vitest } from 'vitest';
import {
  MockServer,
  marketRateHandler,
  mockStrategy,
  renderWithRouter,
  screen,
  userEvent,
} from 'libs/testing-library';
import { EditStrategyProvider } from 'components/strategies/edit/EditStrategyContext';
import { Strategy } from 'libs/queries';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import {
  MockStrategyParams,
  mockEmptyOrder,
  mockMarketRate,
  priceHistoryHandler,
} from 'libs/testing-library/utils/mock';
import { EditPricesStrategyDisposablePage } from './disposable';
import { EditStrategyDriver } from 'libs/testing-library/drivers/EditStrategyDriver';
import { toDisposablePricesSearch } from 'libs/routing/routes/strategyEdit';
import * as balanceQueries from 'libs/queries/chain/balance';

const basePath = '/strategies/edit/$strategyId/prices/disposable';

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
const baseBuyOrder = {
  base: 'ETH' as const,
  quote: 'USDC' as const,
  order0: baseBuy,
  order1: mockEmptyOrder(),
};

const renderPage = async (
  type: 'editPrices' | 'renew',
  strategyParams: MockStrategyParams,
) => {
  const strategy: Strategy = mockStrategy(strategyParams);
  const { router } = await renderWithRouter({
    component: () => (
      <EditStrategyProvider strategy={strategy}>
        <EditStrategyLayout editType={type}>
          <EditPricesStrategyDisposablePage />
        </EditStrategyLayout>
      </EditStrategyProvider>
    ),
    basePath,
    search: toDisposablePricesSearch(strategy, type) as any,
    params: { strategyId: strategy.id },
  });
  return { strategy, router };
};

describe('Edit price disposable page', () => {
  const user = userEvent.setup();
  const driver = new EditStrategyDriver(screen);
  vitest
    .spyOn(balanceQueries, 'useGetTokenBalance')
    .mockImplementation(() => ({ data: '1000' }) as any);

  describe('Budget distribution', () => {
    test('Show when marginal buy price is min', async () => {
      await renderPage('editPrices', baseBuyOrder);
      const form = await driver.findDisposableForm();
      expect(form.distributeBudget()).toBeNull();
      await user.click(form.budgetSummary());
      await user.type(form.budget(), '1');
      expect(form.budget()).toHaveValue('1');
      expect(form.distributeBudget()).toBeVisible();
    });
    test('Do not show when marginal buy price is max', async () => {
      await renderPage('editPrices', {
        base: 'ETH',
        quote: 'USDC',
        order0: {
          ...baseBuy,
          marginalRate: '2',
        },
        order1: mockEmptyOrder(),
      });
      const form = await driver.findDisposableForm();
      await user.click(form.budgetSummary());
      await user.type(form.budget(), '1');
      expect(form.distributeBudget()).toBeNull();
    });
    test('Do not show when marginal sell price is min', async () => {
      await renderPage('editPrices', {
        base: 'ETH',
        quote: 'USDC',
        order0: mockEmptyOrder(),
        order1: {
          ...baseSell,
          marginalRate: '3',
        },
      });
      const form = await driver.findDisposableForm();
      await user.click(form.budgetSummary());
      await user.type(form.budget(), '1');
      expect(form.distributeBudget()).toBeNull();
    });
    test('Do not show when no initial balance', async () => {
      await renderPage('editPrices', {
        base: 'ETH',
        quote: 'USDC',
        order0: {
          ...baseBuy,
          balance: '0',
        },
        order1: mockEmptyOrder(),
      });
      const form = await driver.findDisposableForm();
      await user.click(form.budgetSummary());
      await user.type(form.budget(), '1');
      expect(form.distributeBudget()).toBeNull();
    });
  });
});
