import { test, expect, afterEach } from 'vitest';
import { cleanup, renderWithRouter, screen } from 'libs/testing-library';
import { debugTokens } from '../../../../e2e/utils/types';
import { CreateRecurringStrategyPage } from './recurring';

const basePath = '/strategies/create/recurring';
afterEach(async () => {
  cleanup(); // Clear the screen after each test
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

  // ACT

  // ASSERT
  expect(router.state.location.pathname).toBe(basePath);
  expect(router.state.location.search).toStrictEqual({
    base: debugTokens.ETH,
    quote: debugTokens.USDC,
  });
  screen.debug();
  screen.logTestingPlaygroundURL();
});
