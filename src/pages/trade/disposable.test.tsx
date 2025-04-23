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
import { TradeDisposable } from './disposable';

const basePath = '/trade/disposable';

const marketRates = mockMarketRate({ USDC: 1, ETH: 2800 });

const mockServer = new MockServer([
  marketRateHandler(marketRates),
  priceHistoryHandler([]),
]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

const WrappedDisposable = ({ base, quote }: { base: Token; quote: Token }) => {
  return (
    <TradeProvider base={base} quote={quote}>
      <TradeDisposable />
    </TradeProvider>
  );
};

describe('Create disposable page', () => {
  test('should warn user if limit strategy input price is above or below market price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      direction: 'sell',
      settings: 'limit',
      min: '2100',
      max: '2100',
      budget: '2',
    };

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedDisposable base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const disposableDriver = new CreateStrategyDriver(screen);
    const form = await disposableDriver.findDisposableForm();

    // Check form
    expect(form.price()).toHaveValue(search.min);
    expect(form.price()).toHaveValue(search.max);
    expect(form.budget()).toHaveValue(search.budget);

    // Check price range input and market price indication
    await waitFor(() => {
      const marketPriceIndications = form.marketPriceIndicators();
      expect(marketPriceIndications[0]).toHaveTextContent('-25.00%');
    });
    // Check warning to approve deposit exists
    expect(form.approveWarnings()).toBeInTheDocument();
  });

  test('should warn user if range strategy input price is above or below market price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      direction: 'buy',
      settings: 'range',
      min: '2940',
      max: '3080',
      budget: '2',
    };

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedDisposable base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const disposableDriver = new CreateStrategyDriver(screen);
    const form = await disposableDriver.findDisposableForm();

    // Check form
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(marketPriceIndications[0]).toHaveTextContent('+5.00%');
    expect(marketPriceIndications[1]).toHaveTextContent('+10.00%');

    // Check warning to approve deposit exists
    expect(form.approveWarnings()).toBeInTheDocument();
  });

  test('should warn user if market price is not available', async () => {
    const baseToken = tokenList.WBTC;
    const quoteToken = tokenList.USDT;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      direction: 'buy',
      settings: 'range',
      min: '45000',
      max: '55000',
      budget: '1',
    };

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedDisposable base={baseToken} quote={quoteToken} />
      ),
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
