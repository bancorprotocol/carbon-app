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
  mockMarketRate,
  priceHistoryHandler,
} from 'libs/testing-library/utils/mock';
import { EditStrategyDriver } from 'libs/testing-library/drivers/EditStrategyDriver';
import * as balanceQueries from 'libs/queries/chain/balance';
import { EditPricesOverlappingPage } from './overlapping';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';

const basePath = '/strategies/edit/$strategyId/prices/overlapping';

const marketRates = mockMarketRate({ USDC: 1, ETH: 2.5 });

const mockServer = new MockServer([
  marketRateHandler(marketRates),
  priceHistoryHandler([]),
]);

interface Params {
  min?: string;
  max?: string;
  marketPrice?: string;
  spread?: string;
}
const baseOrder = ({
  min = '1',
  max = '4',
  marketPrice = '2.5',
  spread = '0.1',
}: Params = {}) => {
  const overlappingParams = calculateOverlappingPrices(
    min,
    max,
    marketPrice,
    spread,
  );
  const baseBuy = {
    balance: '1',
    startRate: overlappingParams.buyPriceLow,
    endRate: overlappingParams.buyPriceHigh,
    marginalRate: overlappingParams.buyPriceMarginal,
  };
  const baseSell = {
    balance: '1',
    startRate: overlappingParams.sellPriceLow,
    endRate: overlappingParams.sellPriceHigh,
    marginalRate: overlappingParams.sellPriceMarginal,
  };
  return {
    base: 'ETH' as const,
    quote: 'USDC' as const,
    order0: baseBuy,
    order1: baseSell,
  };
};

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

const renderPage = async (
  type: 'editPrices' | 'renew',
  strategyParams: MockStrategyParams,
  baseSearch: Record<string, string> = {},
) => {
  const strategy: Strategy = mockStrategy(strategyParams);
  const search = { editType: type, ...baseSearch };
  const { router } = await renderWithRouter({
    component: () => (
      <EditStrategyProvider strategy={strategy}>
        <EditStrategyLayout editType={type}>
          <EditPricesOverlappingPage />
        </EditStrategyLayout>
      </EditStrategyProvider>
    ),
    basePath,
    search,
    params: { strategyId: strategy.id },
  });
  return { strategy, router };
};

describe('Edit price overlapping page', () => {
  const user = userEvent.setup();
  const driver = new EditStrategyDriver(screen);
  vitest
    .spyOn(balanceQueries, 'useGetTokenBalance')
    .mockImplementation(() => ({ data: '1000' }) as any);

  describe('Market within order', () => {
    const order = baseOrder();
    test('Both anchor are enabled', async () => {
      await renderPage('editPrices', order);
      const form = await driver.findOverlappingForm();
      expect(form.anchor('buy')).toBeEnabled();
      expect(form.anchor('sell')).toBeEnabled();
    });
    test('Move above market should withdraw all buy balance', async () => {
      await renderPage('editPrices', order);
      const form = await driver.findOverlappingForm();
      await user.type(form.min(), '3');
      await user.click(form.anchor('sell'));
      expect(form.withdraw(order.quote)).toHaveTextContent(
        'withdraw 1.00 USDC',
      );
    });
    test('Move below market should withdraw all sell balance', async () => {
      await renderPage('editPrices', order);
      const form = await driver.findOverlappingForm();
      await user.type(form.max(), '2');
      await user.click(form.anchor('buy'));
      expect(form.withdraw(order.base)).toHaveTextContent('withdraw 1.00 ETH');
    });
  });
  describe('Order above market', () => {
    const order = baseOrder({ marketPrice: '0.1' });
    test('Buy Anchor should be disabled', async () => {
      await renderPage('editPrices', order);
      const form = await driver.findOverlappingForm();
      expect(form.anchor('buy')).toBeDisabled();
    });
  });
  describe('Order below market', () => {
    const order = baseOrder({ marketPrice: '5' });
    test('Sell Anchor should be disabled', async () => {
      await renderPage('editPrices', order);
      const form = await driver.findOverlappingForm();
      expect(form.anchor('sell')).toBeDisabled();
    });
  });
});
