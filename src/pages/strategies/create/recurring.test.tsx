import { test, expect, afterEach } from 'vitest';
import { renderWithRouter } from 'libs/testing-library';
import { debugTokens } from '../../../../e2e/utils/types';
import { CreateRecurringStrategyPage } from './recurring';

const basePath = '/strategies/create/recurring';
afterEach(async () => {
  window.history.replaceState(null, 'root', '/');
});

test('run recurring form', async () => {
  // ARRANGE
  const { router } = await renderWithRouter({
    component: () => <CreateRecurringStrategyPage />,
    basePath,
    search: {
      base: debugTokens.ETH,
      quote: debugTokens.USDC,
    },
  });

  expect(router.state.location.pathname).toBe(basePath);
  expect(router.state.location.search).toStrictEqual({
    base: debugTokens.ETH,
    quote: debugTokens.USDC,
  });
});
