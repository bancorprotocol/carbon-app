import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import {
  MockServer,
  marketRateHandler,
  mockStrategy,
  renderWithRouter,
  userEvent,
} from 'libs/testing-library';
import { EditStrategyProvider } from 'components/strategies/edit/EditStrategyContext';
import { Strategy } from 'libs/queries';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import {
  mockEmptyOrder,
  mockMarketRate,
} from 'libs/testing-library/utils/mock';
import { EditBudgetDisposablePage } from './disposable';

const basePath = '/strategies/edit/$strategyId/prices/disposable';
const getUrl = (id: string) => `/strategies/edit/${id}/prices/disposable`;

const marketRates = mockMarketRate({ USDC: 1, ETH: 2.5 });

const mockServer = new MockServer([marketRateHandler(marketRates)]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

interface Props {
  strategy: Strategy;
  type: 'editPrices' | 'renew' | 'deposit' | 'withdraw';
}

const WrappedDisposable = ({ strategy, type }: Props) => {
  return (
    <EditStrategyProvider strategy={strategy}>
      <EditStrategyLayout editType={type}>
        <EditBudgetDisposablePage />
      </EditStrategyLayout>
    </EditStrategyProvider>
  );
};

describe('Edit price disposable page', () => {
  test('should only send to the SDK what has been changed', async () => {
    const type = 'editPrices';
    const strategy: Strategy = mockStrategy({
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

    const search = {
      editType: type,
      buyBudget: '2',
    };

    const url = getUrl(strategy.id);
    const { router } = await renderWithRouter({
      component: () => <WrappedDisposable strategy={strategy} type={type} />,
      basePath,
      search,
      params: { strategyId: strategy.id },
    });
    const user = userEvent.setup();

    // Check search params
    expect(router.state.location.pathname).toBe(url);
    expect(router.state.location.search).toStrictEqual(search);
  });
});
