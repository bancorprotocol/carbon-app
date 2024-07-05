import { describe, test, expect } from 'vitest';
import { HttpResponse, http } from 'msw';
import { renderWithRouter, screen } from 'libs/testing-library';
import userEvent from '@testing-library/user-event';
import { debugTokens } from '../../../../e2e/utils/types';
import { CreateOverlappingStrategyPage } from './overlapping';
import { MockServer } from 'libs/testing-library/utils';

const basePath = '/strategies/create/overlapping';

const marketRates: Record<string, Record<string, number>> = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { USD: 1 },
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': { USD: 2800 },
};

const marketRateHandler = (
  marketRates: Record<string, Record<string, number>>
) => {
  return http.get('**/*/market-rate', ({ request }) => {
    const queryParams = new URL(request.url).searchParams;
    const address = queryParams.get('address')?.toLowerCase();
    if (!address) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({
      data: marketRates[address],
    });
  });
};

const mockServer = new MockServer([marketRateHandler(marketRates)]);

describe('overlapping page', () => {
  mockServer.start();
  test('run overlapping form with deeplink and user market price', async () => {
    // Initialize user and set search params
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

    // Render page
    const { router } = await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check search params
    expect(router.state.location.pathname).toBe(basePath);
    expect(router.state.location.search).toStrictEqual(search);

    // Close price chart
    await user.click(screen.getByTestId('close-chart'));
    const priceChart = screen.queryByRole('heading', {
      name: 'Price Chart',
    });
    expect(priceChart).not.toBeInTheDocument();

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

  test('run overlapping form with external market price', async () => {
    // Set search params
    const search = {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
      min: '2000',
      max: '3000',
      spread: '0.01',
      anchor: 'buy',
      budget: '100',
    };

    // Render page
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

  test('run overlapping form with user market price below min price', async () => {
    // Set search params
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

    // Render page
    const { router } = await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check search params
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

  test('run overlapping form with user market price above max price', async () => {
    // Set search params
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

    // Render page
    const { router } = await renderWithRouter({
      component: () => <CreateOverlappingStrategyPage />,
      basePath,
      search,
    });

    // Check search params
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
});
