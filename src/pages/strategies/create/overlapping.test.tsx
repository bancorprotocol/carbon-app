import { test, expect, afterEach, vitest } from 'vitest';
import { renderWithRouter, screen } from 'libs/testing-library';
import { debugTokens } from '../../../../e2e/utils/types';
import { CreateOverlappingStrategyPage } from './overlapping';
import userEvent from '@testing-library/user-event';

vitest.mock('hooks/useMarketPrice', () => {
  return {
    useMarketPrice: () => {
      return { marketPrice: 2800, isPending: false };
    },
  };
});

const basePath = '/strategies/create/overlapping';
afterEach(async () => {
  window.history.replaceState(null, 'root', '/');
});

test('run overlapping form with deeplink and user market price', async () => {
  // Initialize user and set params
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
  await user.click(screen.getByText('Close Chart'));
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
