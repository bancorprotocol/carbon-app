import { test, expect, afterEach } from 'vitest';
import { renderWithRouter } from 'libs/testing-library';
import { debugTokens } from '../../../e2e/utils/types';
import { TradeRecurring } from './recurring';

const basePath = '/trade/recurring';
afterEach(async () => {
  window.history.replaceState(null, 'root', '/');
});

test('run recurring form', async () => {
  // ARRANGE
  const { router } = await renderWithRouter({
    component: () => <TradeRecurring />,
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
