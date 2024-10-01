import { describe, test, expect, beforeAll, afterAll } from 'vitest';
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
import { mockMarketRate } from 'libs/testing-library/utils/mock';

const basePath = '/strategies/edit/$strategyId/budget/recurring';

const marketRates = mockMarketRate({ USDC: 1, ETH: 2.5 });

const mockServer = new MockServer([marketRateHandler(marketRates)]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

interface Props {
  strategy: Strategy;
  type: 'deposit' | 'withdraw';
}

const WrappedRecurring = ({ strategy, type }: Props) => {
  return (
    <EditStrategyProvider strategy={strategy}>
      <EditStrategyLayout editType={type}>
        <EditBudgetRecurringPage />
      </EditStrategyLayout>
    </EditStrategyProvider>
  );
};

describe('Create recurring page', () => {
  test('should only send to the SDK what has been changed', async () => {
    const strategy: Strategy = mockStrategy({
      base: 'ETH',
      quote: 'USDC',
      order0: {
        balance: '1',
        startRate: '1',
        endRate: '2',
        marginalRate: '1.5',
      },
      order1: {
        balance: '1',
        startRate: '3',
        endRate: '4',
        marginalRate: '3.5',
      },
    });

    const search = {
      editType: 'deposit',
      buyBudget: '2',
    };

    const url = `/strategies/edit/${strategy.id}/budget/recurring`;
    const { router } = await renderWithRouter({
      component: () => <WrappedRecurring strategy={strategy} type="deposit" />,
      basePath,
      search,
      params: { strategyId: strategy.id },
    });
    const user = userEvent.setup();

    // Check search params
    expect(router.state.location.pathname).toBe(url);
    expect(router.state.location.search).toStrictEqual(search);

    const recurringDriver = new EditStrategyDriver(screen);
    const form = await recurringDriver.findRecurringForm();

    // Check form
    expect(form.buy.budget()).toHaveValue(search.buyBudget);
    expect(form.sell.budget()).toHaveValue('');
    const spy = spyOn(carbonSDK, 'updateStrategy');
    await user.click(form.submit());
    expect(spy).toHaveBeenCalledWith(
      strategy.id,
      strategy.encoded,
      { buyBudget: '3' },
      undefined,
      undefined
    );
  });
});
