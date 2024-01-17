import { Route } from '@tanstack/react-router';
import { rootRoot } from 'libs/routing/routes/root';
import { TradePage } from 'pages/trade';

export interface TradeSearch {
  base: string;
  quote: string;
}

export const tradePage = new Route({
  getParentRoute: () => rootRoot,
  path: '/trade',
  component: TradePage,
  validateSearch: (search: Record<string, unknown>): TradeSearch => {
    return { base: search.base as string, quote: search.quote as string };
  },
});
