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
  mockMarketRate,
  priceHistoryHandler,
} from 'libs/testing-library/utils/mock';
import { EditStrategyDriver } from 'libs/testing-library/drivers/EditStrategyDriver';
import { toRecurringPricesSearch } from 'libs/routing/routes/strategyEdit';
import * as balanceQueries from 'libs/queries/chain/balance';
import { EditPricesStrategyRecurringPage } from './recurring';

const basePath = '/strategies/edit/$strategyId/prices/recurring';

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
  sell: baseSell,
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
          <EditPricesStrategyRecurringPage />
        </EditStrategyLayout>
      </EditStrategyProvider>
    ),
    basePath,
    search: toRecurringPricesSearch(strategy, type) as any,
    params: { strategyId: strategy.id },
  });
  return { strategy, router };
};

describe('Edit price recurring page', () => {
  const user = userEvent.setup();
  const driver = new EditStrategyDriver(screen);
  vitest
    .spyOn(balanceQueries, 'useGetTokenBalance')
    .mockImplementation(() => ({ data: '1000' }) as any);

  describe('Budget distribution', () => {
    test('Show when marginal buy price is min', async () => {
      await renderPage('editPrices', baseBuyOrder);
      const form = await driver.findRecurringForm();
      expect(form.buy.distributeBudget()).toBeNull();
      expect(form.sell.distributeBudget()).toBeNull();
      await user.click(form.buy.budgetSummary());
      await user.type(form.buy.budget(), '1');
      await user.click(form.sell.budgetSummary());
      await user.type(form.sell.budget(), '1');
      expect(form.buy.budget()).toHaveValue('1');
      expect(form.buy.distributeBudget()).toBeVisible();
      expect(form.sell.budget()).toHaveValue('1');
      expect(form.sell.distributeBudget()).toBeVisible();
    });
    test('Do not show when marginal buy price is max', async () => {
      await renderPage('editPrices', {
        base: 'ETH',
        quote: 'USDC',
        buy: {
          ...baseBuy,
          marginalPrice: '2',
        },
        sell: baseSell,
      });
      const form = await driver.findRecurringForm();
      await user.click(form.buy.budgetSummary());
      await user.type(form.buy.budget(), '1');
      expect(form.buy.distributeBudget()).toBeNull();
    });
    test('Do not show when marginal sell price is min', async () => {
      await renderPage('editPrices', {
        base: 'ETH',
        quote: 'USDC',
        buy: baseBuy,
        sell: {
          ...baseSell,
          marginalPrice: '3',
        },
      });
      const form = await driver.findRecurringForm();
      await user.click(form.sell.budgetSummary());
      await user.type(form.sell.budget(), '1');
      expect(form.sell.distributeBudget()).toBeNull();
    });
    test('Do not show when no initial balance', async () => {
      await renderPage('editPrices', {
        base: 'ETH',
        quote: 'USDC',
        buy: {
          ...baseBuy,
          budget: '0',
        },
        sell: baseSell,
      });
      const form = await driver.findRecurringForm();
      await user.click(form.buy.budgetSummary());
      await user.type(form.buy.budget(), '1');
      expect(form.buy.distributeBudget()).toBeNull();
    });
  });
});
