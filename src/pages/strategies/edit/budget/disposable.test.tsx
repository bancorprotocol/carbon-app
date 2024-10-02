import { describe, test, expect, beforeAll, afterAll } from 'vitest';
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
} from 'libs/testing-library/utils/mock';
import { EditBudgetDisposablePage } from './disposable';
import { EditStrategyDriver } from 'libs/testing-library/drivers/EditStrategyDriver';

const basePath = '/strategies/edit/$strategyId/budget/disposable';

const marketRates = mockMarketRate({ USDC: 1, ETH: 2.5 });

const mockServer = new MockServer([marketRateHandler(marketRates)]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

const renderPage = async (
  type: 'deposit' | 'withdraw',
  strategyParams: MockStrategyParams,
  baseSearch: Record<string, string> = {}
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
    const driver = new EditStrategyDriver(screen);
    const form = await driver.findDisposableForm();
    expect(form.submit()).toBeDisabled();
    await user.type(form.budget(), '1');
    expect(form.submit()).toBeEnabled();
  });
  describe('Budget distribution', () => {
    test('Show when marginal buy price is above min', async () => {
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
      const driver = new EditStrategyDriver(screen);
      const form = await driver.findDisposableForm();
      expect(form.distributeBudget()).toBeNull();
      await user.type(form.budget(), '1');
      expect(form.budget()).toHaveValue('1');
      expect(form.distributeBudget()).toBeVisible();
    });
  });
});
