import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { TradeOverlapping } from './overlapping';
import {
  MockServer,
  marketRateHandler,
  CreateStrategyDriver,
  renderWithRouter,
  screen,
  userEvent,
  tokenList,
  mockMarketRate,
  priceHistoryHandler,
} from 'libs/testing-library';
import { TradeProvider } from 'components/trade/TradeContext';
import { Token } from 'libs/tokens';

const basePath = '/trade/overlapping';

const marketRates = mockMarketRate({ USDC: 1, ETH: 2800 });

const mockServer = new MockServer([
  marketRateHandler(marketRates),
  priceHistoryHandler([]),
]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

const WrappedOverlapping = ({ base, quote }: { base: Token; quote: Token }) => {
  return (
    <TradeProvider base={base} quote={quote}>
      <TradeOverlapping />
    </TradeProvider>
  );
};

describe('Create overlapping page', () => {
  test('should populate form with search params and user market price defined in url', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      marketPrice: '2500',
      min: '2000',
      max: '3000',
      spread: '0.01',
      anchor: 'buy',
      budget: '100',
    };

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedOverlapping base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const overlappingDriver = new CreateStrategyDriver(screen);
    const form = await overlappingDriver.findOverlappingForm();
    await overlappingDriver.waitForLoading(form.element);

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    expect(marketPriceIndications[0]).toHaveTextContent('-20.00%');
    expect(marketPriceIndications[1]).toHaveTextContent('+20.00%');

    // Check budget
    expect(form.budget()).toHaveValue(search.budget);

    // Check warning to approve deposit exists
    expect(form.approveWarnings()).toBeInTheDocument();
  });

  test('should populate form and search params with unavailable external price after setting user market price', async () => {
    const user = userEvent.setup();

    const baseToken = tokenList.USDT;
    const quoteToken = tokenList.WBTC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      min: '45000',
      max: '55000',
      spread: '0.01',
      anchor: 'buy',
      budget: '10',
    };
    const marketPrice = '50000';

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedOverlapping base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    const overlappingDriver = new CreateStrategyDriver(screen);
    overlappingDriver.findUserPriceForm();
    const priceInput = await overlappingDriver.findUserPriceInput();

    await user.click(priceInput.editPrice());
    await user.keyboard(marketPrice);
    await user.click(priceInput.approveWarning());
    await user.click(priceInput.confirm());

    expect(router.state.location.search).toStrictEqual({
      ...search,
      marketPrice: marketPrice,
    });
  });

  test('should populate form and search params with available external market price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      min: '2000',
      max: '3000',
      spread: '0.01',
      anchor: 'sell',
      budget: '10',
    };

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedOverlapping base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const overlappingDriver = new CreateStrategyDriver(screen);
    const form = await overlappingDriver.findOverlappingForm();

    // Check price range input and market price indication
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    const marketPriceIndications = form.marketPriceIndicators();
    expect(marketPriceIndications[0]).toHaveTextContent('-28.57%');
    expect(marketPriceIndications[1]).toHaveTextContent('+7.14%');
  });

  test('should populate form with user market price below min price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      min: '2000',
      max: '3000',
      marketPrice: '1500',
      spread: '0.01',
      anchor: 'buy',
      budget: '100',
    };

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedOverlapping base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    // Check search params
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { budget, ...rest } = search;
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual({
      ...rest,
      anchor: 'sell',
    });

    const overlappingDriver = new CreateStrategyDriver(screen);
    const form = await overlappingDriver.findOverlappingForm();

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    expect(marketPriceIndications[0]).toHaveTextContent('+33.33%');
    expect(marketPriceIndications[1]).toHaveTextContent('>+99.99%');
  });

  test('should populate form with user market price above max price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      min: '2000',
      max: '3000',
      marketPrice: '3200',
      spread: '0.01',
      anchor: 'sell',
      budget: '100',
    };

    const { router } = await renderWithRouter({
      component: () => (
        <WrappedOverlapping base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    // Check search params
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { budget, ...rest } = search;
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual({
      ...rest,
      anchor: 'buy',
    });

    const overlappingDriver = new CreateStrategyDriver(screen);
    const form = await overlappingDriver.findOverlappingForm();

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    expect(marketPriceIndications[0]).toHaveTextContent('-37.50%');
    expect(marketPriceIndications[1]).toHaveTextContent('-6.25%');
  });

  test('should populate form without min and max defined and with user market price', async () => {
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
      marketPrice: '3000',
      spread: '0.05',
      anchor: 'buy',
      budget: '100',
    };

    await renderWithRouter({
      component: () => (
        <WrappedOverlapping base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    const overlappingDriver = new CreateStrategyDriver(screen);
    const form = await overlappingDriver.findOverlappingForm();

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue('2970');
    expect(form.max()).toHaveValue('3030');
    expect(marketPriceIndications[0]).toHaveTextContent('-1.00%');
    expect(marketPriceIndications[1]).toHaveTextContent('+1.00%');
  });

  test('should check form touched: after setting user price', async () => {
    const user = userEvent.setup();
    const baseToken = tokenList.ETH;
    const quoteToken = tokenList.USDC;

    const search = {
      base: baseToken.address,
      quote: quoteToken.address,
    };

    await renderWithRouter({
      component: () => (
        <WrappedOverlapping base={baseToken} quote={quoteToken} />
      ),
      basePath,
      search,
    });

    const overlappingDriver = new CreateStrategyDriver(screen);

    const editMarketPriceButton = await overlappingDriver.findEditMarketPrice();
    await user.click(editMarketPriceButton);

    // Anchor required warning only shows up if form state touched is true
    const priceInput = await overlappingDriver.findUserPriceInput();
    await user.keyboard('1');
    await user.click(priceInput.approveWarning());
    await user.click(priceInput.confirm());
  });
});
