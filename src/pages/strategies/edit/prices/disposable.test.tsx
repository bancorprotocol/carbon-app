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
import { Strategy } from 'components/strategies/common/types';
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
  budget: '1',
  min: '1',
  max: '2',
  marginalPrice: '1.5',
};
const baseSell = {
  budget: '1',
  min: '3',
  max: '4',
  marginalPrice: '3.5',
};
const baseBuyOrder = {
  base: 'ETH' as const,
  quote: 'USDC' as const,
  buy: baseBuy,
  sell: mockEmptyOrder(),
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
        buy: {
          ...baseBuy,
          marginalPrice: '2',
        },
        sell: mockEmptyOrder(),
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
        buy: mockEmptyOrder(),
        sell: {
          ...baseSell,
          marginalPrice: '3',
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
        buy: {
          ...baseBuy,
          budget: '0',
        },
        sell: mockEmptyOrder(),
      });
      const form = await driver.findDisposableForm();
      await user.click(form.budgetSummary());
      await user.type(form.budget(), '1');
      expect(form.distributeBudget()).toBeNull();
    });
  });
});
