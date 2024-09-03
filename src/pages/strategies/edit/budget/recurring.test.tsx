import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import {
  MockServer,
  marketRateHandler,
  renderWithRouter,
  screen,
  tokenList,
} from 'libs/testing-library';
import { EditStrategyDriver } from 'libs/testing-library/drivers/EditStrategyDriver';
import { EditBudgetRecurringPage } from './recurring';
import { EditStrategyProvider } from 'components/strategies/edit/EditStrategyContext';
import { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { carbonSDK } from 'libs/sdk';
import { spyOn } from '@vitest/spy';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';

const basePath = '/strategies/edit/$strategyId/budget/recurring';

const marketRates: Record<string, Record<string, number>> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { USD: 1 }, // USDC
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': { USD: 2800 }, // ETH
};

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
  test.only('should only send to the SDK what has been changed', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const strategy: Strategy = {
      id: '1',
      idDisplay: '1',
      base: baseToken,
      quote: quoteToken,
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
      status: 'active',
      encoded: {} as any,
      roi: new SafeDecimal('1'),
    };

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
    screen.debug();

    // Check search params
    expect(router.state.location.pathname).toBe(url);
    expect(router.state.location.search).toStrictEqual(search);

    const recurringDriver = new EditStrategyDriver(screen);
    const form = await recurringDriver.findRecurringForm();

    // Check form
    expect(form.buy.budget()).toHaveValue(search.buyBudget);
    expect(form.sell.budget()).toHaveValue('');
    const spy = spyOn(carbonSDK, 'updateStrategy');
    form.submit().click();
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(
        strategy.id,
        strategy.encoded,
        { buyBudget: search.buyBudget },
        undefined,
        undefined
      );
    }, 100);
  });
});
