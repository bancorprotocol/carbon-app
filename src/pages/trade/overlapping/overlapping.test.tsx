import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { debugTokens } from '../../../../e2e/utils/types';
import { TradeOverlappingPrice } from './price';
import {
  MockServer,
  marketRateHandler,
  CreateOverlappingDriver,
  renderWithRouter,
  screen,
  waitFor,
  userEvent,
} from 'libs/testing-library';

const basePath = '/trade/overview/overlapping';

const marketRates: Record<string, Record<string, number>> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { USD: 1 }, // USDC
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': { USD: 2800 }, // ETH
};

const mockServer = new MockServer([marketRateHandler(marketRates)]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

describe('Create overlapping page', () => {
  test('should populate form with search params and user market price defined in url', async () => {
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      marketPrice: '2500',
      min: '2000',
      max: '3000',
      spread: '0.01',
      anchor: 'buy',
      budget: '100',
    };

    const { router } = await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const form = overlappingDriver.getOverlappingInput();

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    expect(marketPriceIndications[0]).toHaveTextContent('20.00% below');
    expect(marketPriceIndications[1]).toHaveTextContent('20.00% above');

    // Check budget
    expect(form.budget()).toHaveValue(search.budget);

    // Check warning to approve deposit exists
    expect(form.approveWarnings()).toBeInTheDocument();
  });

  test('should populate form and search params with unavailable external price after setting user market price', async () => {
    const user = userEvent.setup();
    const search = {
      base: debugTokens.USDT,
      quote: debugTokens.WBTC,
      min: '45000',
      max: '55000',
      spread: '0.01',
      anchor: 'buy',
      budget: '10',
    };
    const marketPrice = '50000';

    const { router } = await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
      basePath,
      search,
    });

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const priceInput = overlappingDriver.getUserPriceInput();

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
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      min: '2000',
      max: '3000',
      spread: '0.01',
      anchor: 'sell',
      budget: '10',
    };

    const { router } = await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const form = overlappingDriver.getOverlappingInput();

    // Check price range input and market price indication
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    const marketPriceIndications = form.marketPriceIndicators();
    expect(marketPriceIndications[0]).toHaveTextContent('28.57% below');
    expect(marketPriceIndications[1]).toHaveTextContent('7.14% above');
  });

  test('should set default spread with spread unset in the search params', async () => {
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      min: '2000',
      max: '3000',
    };

    await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
      basePath,
      search,
    });

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const form = overlappingDriver.getOverlappingInput();

    expect(form.spread.default()).toBeChecked();
  });

  test('should populate form with user market price below min price', async () => {
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      min: '2000',
      max: '3000',
      marketPrice: '1500',
      spread: '0.01',
      anchor: 'buy',
      budget: '100',
    };

    const { router } = await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
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

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const form = overlappingDriver.getOverlappingInput();

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    expect(marketPriceIndications[0]).toHaveTextContent('33.33% above');
    expect(marketPriceIndications[1]).toHaveTextContent('>99.99% above');
  });

  test('should populate form with user market price above max price', async () => {
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      min: '2000',
      max: '3000',
      marketPrice: '3200',
      spread: '0.01',
      anchor: 'sell',
      budget: '100',
    };

    const { router } = await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
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

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const form = overlappingDriver.getOverlappingInput();

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue(search.min);
    expect(form.max()).toHaveValue(search.max);
    expect(marketPriceIndications[0]).toHaveTextContent('37.50% below');
    expect(marketPriceIndications[1]).toHaveTextContent('6.25% below');
  });

  test('should populate form without min and max defined and with user market price', async () => {
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      marketPrice: '3000',
      spread: '0.05',
      anchor: 'buy',
      budget: '100',
    };

    await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
      basePath,
      search,
    });

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const form = overlappingDriver.getOverlappingInput();

    // Check price range input and market price indication
    const marketPriceIndications = form.marketPriceIndicators();
    expect(form.min()).toHaveValue('2970');
    expect(form.max()).toHaveValue('3030');
    expect(marketPriceIndications[0]).toHaveTextContent('1.00% below');
    expect(marketPriceIndications[1]).toHaveTextContent('1.00% above');
  });

  test('should populate form with invalid range in search (min>max)', async () => {
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      marketPrice: '3000',
      spread: '0.05',
      min: '3000',
      max: '2000',
      anchor: 'buy',
      budget: '100',
    };

    await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
      basePath,
      search,
    });

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const form = overlappingDriver.getOverlappingInput();

    // Check price range input and market price indication
    expect(form.min()).toHaveValue('3000');
    expect(form.max()).toHaveValue('2000');

    await waitFor(() => expect(form.max()).toHaveValue('3003.002251'), {
      timeout: 2000,
    });
  });

  test('should check form touched: after setting user price', async () => {
    const user = userEvent.setup();
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
    };

    await renderWithRouter({
      component: () => <TradeOverlappingPrice />,
      basePath,
      search,
    });

    const overlappingDriver = new CreateOverlappingDriver(screen);
    const priceInput = overlappingDriver.getUserPriceInput();

    // Anchor required warning only shows up if form state touched is true
    await user.click(priceInput.open());
    await user.keyboard('1');
    await user.click(priceInput.approveWarning());
    await user.click(priceInput.confirm());
  });
});
