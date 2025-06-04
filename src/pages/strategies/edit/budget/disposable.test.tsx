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
import { EditBudgetDisposablePage } from './disposable';
import { EditStrategyDriver } from 'libs/testing-library/drivers/EditStrategyDriver';
import * as balanceQueries from 'libs/queries/chain/balance';

const basePath = '/strategies/edit/$strategyId/budget/disposable';

const marketRates = mockMarketRate({ USDC: 1, ETH: 2.5 });

const mockServer = new MockServer([
  marketRateHandler(marketRates),
  priceHistoryHandler([]),
]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

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
          <EditBudgetDisposablePage />
        </EditStrategyLayout>
      </EditStrategyProvider>
    ),
    basePath,
    search,
    params: { strategyId: strategy.id },
  });
  return { strategy, router };
};

describe('Edit budget disposable page', () => {
  const user = userEvent.setup();
  const driver = new EditStrategyDriver(screen);
  vitest
    .spyOn(balanceQueries, 'useGetTokenBalance')
    .mockImplementation(() => ({ data: '1000' }) as any);

  test('Enable submit only when budget is filled', async () => {
    await renderPage('deposit', {
      base: 'ETH',
      quote: 'USDC',
      order0: {
        balance: '1',
        startRate: '1',
        endRate: '2',
        marginalRate: '1.5',
      },
      order1: mockEmptyOrder(),
    });
    const form = await driver.findDisposableForm();
    expect(form.submit()).toBeDisabled();
    await user.type(form.budget(), '1');
    expect(form.submit()).toBeEnabled();
  });
  describe('Budget distribution', () => {
    test('Show when marginal buy price is min', async () => {
      await renderPage('deposit', {
        base: 'ETH',
        quote: 'USDC',
        order0: {
          balance: '1',
          startRate: '1',
          endRate: '2',
          marginalRate: '1.5',
        },
        order1: mockEmptyOrder(),
      });
      const form = await driver.findDisposableForm();
      expect(form.distributeBudget()).toBeNull();
      await user.type(form.budget(), '1');
      expect(form.budget()).toHaveValue('1');
      expect(form.distributeBudget()).toBeVisible();
    });
    test('Do not show when marginal buy price is max', async () => {
      await renderPage('deposit', {
        base: 'ETH',
        quote: 'USDC',
        order0: {
          balance: '1',
          startRate: '1',
          endRate: '2',
          marginalRate: '2',
        },
        order1: mockEmptyOrder(),
      });
      const form = await driver.findDisposableForm();
      await user.type(form.budget(), '1');
      expect(form.distributeBudget()).toBeNull();
    });
    test('Do not show when marginal sell price is above min', async () => {
      await renderPage('deposit', {
        base: 'ETH',
        quote: 'USDC',
        order0: mockEmptyOrder(),
        order1: {
          balance: '1',
          startRate: '1',
          endRate: '2',
          marginalRate: '1',
        },
      });
      const form = await driver.findDisposableForm();
      await user.type(form.budget(), '1');
      expect(form.distributeBudget()).toBeNull();
    });
    test('Do not show when no initial balance', async () => {
      await renderPage('deposit', {
        base: 'ETH',
        quote: 'USDC',
        order0: mockEmptyOrder(),
        order1: {
          balance: '0',
          startRate: '1',
          endRate: '2',
          marginalRate: '1.5',
        },
      });
      const form = await driver.findDisposableForm();
      await user.type(form.budget(), '1');
      expect(form.distributeBudget()).toBeNull();
    });
  });
});
