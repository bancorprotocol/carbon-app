import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import {
  MockServer,
  marketRateHandler,
  CreateStrategyDriver,
  renderWithRouter,
  screen,
  tokenList,
  mockMarketRate,
  priceHistoryHandler,
  waitFor,
} from 'libs/testing-library';
import { TradeProvider } from 'components/trade/TradeContext';
import { Token } from 'libs/tokens';
import { TradeRecurring } from './recurring';

const basePath = '/trade/recurring';

const marketRates = mockMarketRate({ USDC: 1, ETH: 2800 });

const mockServer = new MockServer([
  marketRateHandler(marketRates),
  priceHistoryHandler([]),
]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

const WrappedRecurring = ({ base, quote }: { base: Token; quote: Token }) => {
  return (
    <TradeProvider base={base} quote={quote}>
      <TradeRecurring />
    </TradeProvider>
  );
};

describe('Create recurring page', () => {
  test('should warn user if limit strategy input price is above or below market price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      buySettings: 'limit',
      sellSettings: 'limit',
      buyMin: '2240',
      buyMax: '2240',
      sellMin: '2520',
      sellMax: '2520',
      buyBudget: '100',
      sellBudget: '0.01',
    };

    const { router } = await renderWithRouter({
      component: () => <WrappedRecurring base={baseToken} quote={quoteToken} />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const recurringDriver = new CreateStrategyDriver(screen);
    const form = await recurringDriver.findRecurringForm();

    // Check form
    expect(form.buy.price()).toHaveValue(search.buyMin);
    expect(form.sell.price()).toHaveValue(search.sellMin);
    expect(form.buy.budget()).toHaveValue(search.buyBudget);
    expect(form.sell.budget()).toHaveValue(search.sellBudget);

    // Check price range input and market price indication
    await waitFor(() => {
      const buyMarketPriceIndications = form.buy.marketPriceIndicators();
      expect(buyMarketPriceIndications[0]).toHaveTextContent('-20.00%');
    });
    const sellMarketPriceIndications = form.sell.marketPriceIndicators();
    expect(sellMarketPriceIndications[0]).toHaveTextContent('-10.00%');

    // Check warning to approve deposit exists
    expect(form.approveWarnings()).toBeInTheDocument();
  });

  test('should warn user if range strategy input price is above or below market price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      buySettings: 'range',
      sellSettings: 'range',
      buyMin: '2940',
      buyMax: '3080',
      sellMin: '3220',
      sellMax: '3360',
      buyBudget: '100',
      sellBudget: '0.01',
    };

    const { router } = await renderWithRouter({
      component: () => <WrappedRecurring base={baseToken} quote={quoteToken} />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const recurringDriver = new CreateStrategyDriver(screen);
    const form = await recurringDriver.findRecurringForm();

    // Check form
    expect(form.buy.min()).toHaveValue(search.buyMin);
    expect(form.buy.max()).toHaveValue(search.buyMax);
    expect(form.sell.min()).toHaveValue(search.sellMin);
    expect(form.sell.max()).toHaveValue(search.sellMax);
    expect(form.buy.budget()).toHaveValue(search.buyBudget);
    expect(form.sell.budget()).toHaveValue(search.sellBudget);

    // Check price range input and market price indication
    const buyMarketPriceIndications = form.buy.marketPriceIndicators();
    expect(buyMarketPriceIndications[0]).toHaveTextContent('+5.00%');
    expect(buyMarketPriceIndications[1]).toHaveTextContent('+10.00%');
    const sellMarketPriceIndications = form.sell.marketPriceIndicators();
    expect(sellMarketPriceIndications[0]).toHaveTextContent('+15.00%');
    expect(sellMarketPriceIndications[1]).toHaveTextContent('+20.00%');

    // Check warning to approve deposit exists
    expect(form.approveWarnings()).toBeInTheDocument();
  });

  test('should warn user if market price is not available', async () => {
    const baseToken = tokenList.WBTC;
    const quoteToken = tokenList.USDT;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      buySettings: 'range',
      sellSettings: 'range',
      buyMin: '45000',
      buyMax: '55000',
      sellMin: '35000',
      sellMax: '40000',
      buyBudget: '1',
      sellBudget: '0.001',
    };

    const { router } = await renderWithRouter({
      component: () => <WrappedRecurring base={baseToken} quote={quoteToken} />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const priceForm = await screen.findByTestId('user-price-form');
    expect(priceForm).toBeInTheDocument();
  });
});
