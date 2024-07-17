import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { renderWithRouter, screen, waitFor } from 'libs/testing-library';
import userEvent from '@testing-library/user-event';
import { debugTokens } from '../../../../e2e/utils/types';
import { CreateOverlappingStrategyPage } from './overlapping';
import { MockServer, marketRateHandler } from 'libs/testing-library/utils';

const basePath = '/strategies/create/overlapping';

const marketRates: Record<string, Record<string, number>> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { USD: 1 }, // USDC
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': { USD: 2800 }, // ETH
};

const mockServer = new MockServer([marketRateHandler(marketRates)]);

beforeAll(() => mockServer.start());
afterAll(() => mockServer.close());

describe('Create overlapping page', () => {
  test('should open and close chart', async () => {
    const user = userEvent.setup();
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

    await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check close chart
    await user.click(screen.getByTestId('close-chart'));
    expect(screen.queryByTestId('strategy-graph')).not.toBeInTheDocument();

    // Check open chart
    await user.click(screen.getByTestId('open-chart'));
    expect(screen.queryByTestId('strategy-graph')).toBeInTheDocument();
  });

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
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    // Check price range input and market price indication
    const priceRangeMin = await screen.findByTestId('input-min');
    const priceRangeMax = await screen.findByTestId('input-max');
    const marketPriceIndications = await screen.findAllByTestId(
      'market-price-indication'
    );
    expect(priceRangeMin).toHaveValue(search.min);
    expect(priceRangeMax).toHaveValue(search.max);
    expect(marketPriceIndications[0]).toHaveTextContent('20.00% below');
    expect(marketPriceIndications[1]).toHaveTextContent('20.00% above');

    // Check budget
    const inputBudget = screen.getByTestId('input-budget');
    expect(inputBudget).toHaveValue(search.budget);

    // Check warning to approve deposit exists
    const depositWarning = screen.queryByTestId('approve-warnings');
    expect(depositWarning).toBeInTheDocument();
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
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    const userPriceInput = await screen.findByTestId('input-price');
    const userWarning = await screen.findByTestId('approve-price-warnings');
    const setMarketPriceButton = await screen.findByTestId(
      'set-overlapping-price'
    );
    await user.click(userPriceInput);
    await user.keyboard(marketPrice);
    await user.click(userWarning);
    await user.click(setMarketPriceButton);

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
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    // Check price range input and market price indication
    const priceRangeMin = await screen.findByTestId('input-min');
    const priceRangeMax = await screen.findByTestId('input-max');
    const marketPriceIndications = await screen.findAllByTestId(
      'market-price-indication'
    );
    expect(priceRangeMin).toHaveValue(search.min);
    expect(priceRangeMax).toHaveValue(search.max);
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
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    const defaultSpreadOption = await screen.findByTestId('spread-0.05');
    expect(defaultSpreadOption).toBeChecked();
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
      component: () => <CreateOverlappingStrategyPage />,
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

    // Check price range input and market price indication
    const priceRangeMin = await screen.findByTestId('input-min');
    const priceRangeMax = await screen.findByTestId('input-max');
    const marketPriceIndications = await screen.findAllByTestId(
      'market-price-indication'
    );
    expect(priceRangeMin).toHaveValue(search.min);
    expect(priceRangeMax).toHaveValue(search.max);
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
      component: () => <CreateOverlappingStrategyPage />,
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

    // Check price range input and market price indication
    const priceRangeMin = await screen.findByTestId('input-min');
    const priceRangeMax = await screen.findByTestId('input-max');
    const marketPriceIndications = await screen.findAllByTestId(
      'market-price-indication'
    );
    expect(priceRangeMin).toHaveValue(search.min);
    expect(priceRangeMax).toHaveValue(search.max);
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
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check price range input and market price indication
    const priceRangeMin = await screen.findByTestId('input-min');
    const priceRangeMax = await screen.findByTestId('input-max');
    const marketPriceIndications = await screen.findAllByTestId(
      'market-price-indication'
    );
    expect(priceRangeMin).toHaveValue('2970');
    expect(priceRangeMax).toHaveValue('3030');
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
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check price range input and market price indication
    const priceRangeMin = await screen.findByTestId('input-min');
    const priceRangeMax = await screen.findByTestId('input-max');
    expect(priceRangeMin).toHaveValue('3000');
    expect(priceRangeMax).toHaveValue('2000');

    await waitFor(
      () => expect(priceRangeMax).toHaveValue('3003.0022515009377'),
      {
        timeout: 2000,
      }
    );
  });

  test('should check form touched: after changing min range', async () => {
    const user = userEvent.setup();
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
    };

    await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    const anchorWarningHidden = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningHidden).not.toBeInTheDocument();

    const priceMin = await screen.findByTestId('input-min');
    await user.click(priceMin);
    await user.keyboard('3005');

    // Text only shows up if form state touched is true
    const anchorWarningShown = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningShown).toBeInTheDocument();
  });

  test('should check form touched: after changing max range', async () => {
    const user = userEvent.setup();
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
    };

    await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    const anchorWarningHidden = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningHidden).not.toBeInTheDocument();

    const priceMin = await screen.findByTestId('input-max');
    await user.click(priceMin);
    await user.keyboard('3005');

    // Text only shows up if form state touched is true
    const anchorWarningShown = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningShown).toBeInTheDocument();
  });

  test('should check form touched: after changing spread', async () => {
    const user = userEvent.setup();
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
    };

    await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    const anchorWarningHidden = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningHidden).not.toBeInTheDocument();

    const customSpread = await screen.findByTestId('spread-input');
    await user.click(customSpread);
    await user.keyboard('0.1');

    // Text only shows up if form state touched is true
    const anchorWarningShown = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningShown).toBeInTheDocument();
  });

  test('should check form touched: after setting user price', async () => {
    const user = userEvent.setup();
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
    };

    await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    const anchorWarningHidden = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningHidden).not.toBeInTheDocument();

    const editPriceButton = await screen.findByTestId('edit-market-price');
    await user.click(editPriceButton);
    await user.keyboard('1');
    const approveWarning = await screen.findByTestId('approve-price-warnings');
    await user.click(approveWarning);
    const confirmPrice = await screen.findByTestId('set-overlapping-price');
    await user.click(confirmPrice);

    // Text only shows up if form state touched is true
    const anchorWarningShown = screen.queryByText(
      'Please select a token to proceed'
    );
    expect(anchorWarningShown).toBeInTheDocument();
  });
});
