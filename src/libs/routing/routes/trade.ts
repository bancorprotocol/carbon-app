import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validAddress,
  validNumber,
  validPositiveNumber,
} from '../utils';
import { TradeDisposable } from 'pages/trade/disposable';
import { TradeRoot } from 'pages/trade/root';
import { TradeMarket } from 'pages/trade/market';
import { TradeRecurring } from 'pages/trade/recurring';
import { TradeOverlapping } from 'pages/trade/overlapping';
import { defaultEnd, defaultStart } from 'components/strategies/common/utils';
import { OverlappingSearch } from 'components/strategies/common/types';
import * as v from 'valibot';

// TRADE TYPE
export type StrategyType = 'recurring' | 'disposable' | 'overlapping';
export type StrategyDirection = 'buy' | 'sell';
export type StrategySettings = 'limit' | 'range';

export type TradeTypes = StrategyType | 'market';
export interface TradeTypeSearch extends TradeSearch {
  type?: TradeTypes;
}

// TRADE DISPOSABLE
export interface TradeDisposableSearch extends TradeSearch {
  direction?: StrategyDirection;
  settings?: StrategySettings;
  min?: string;
  max?: string;
  budget?: string;
}

// TRADE RECURRING
export interface TradeRecurringSearch extends TradeSearch {
  buyMin?: string;
  buyMax?: string;
  buyBudget?: string;
  buySettings?: StrategySettings;
  sellMin?: string;
  sellMax?: string;
  sellBudget?: string;
  sellSettings?: StrategySettings;
}

// TRADE OVERLAPPING
export type TradeOverlappingSearch = TradeSearch & OverlappingSearch;
export type SetOverlapping = (next: OverlappingSearch) => any;

// TRADE MARKET
export interface TradeMarketSearch extends TradeSearch {
  direction?: StrategyDirection;
  source?: string;
  target?: string;
}

// ROUTES
export interface TradeSearch {
  base?: string;
  quote?: string;
  priceStart?: string;
  priceEnd?: string;
}
const tradePage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trade',
  component: TradeRoot,
  beforeLoad: ({ location, search }) => {
    if (location.pathname.endsWith('trade')) {
      throw redirect({ to: '/trade/disposable', search });
    }
  },
  validateSearch: searchValidator({
    base: v.optional(validAddress),
    quote: v.optional(validAddress),
    priceStart: v.optional(validNumber, defaultStart().toString()),
    priceEnd: v.optional(validNumber, defaultEnd().toString()),
  }),
});

const marketPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/market',
  component: TradeMarket,
  validateSearch: searchValidator({
    direction: v.optional(v.picklist(['buy', 'sell'])),
    source: v.optional(validNumber),
    target: v.optional(validNumber),
  }),
});

const disposablePage = createRoute({
  getParentRoute: () => tradePage,
  path: '/disposable',
  component: TradeDisposable,
  validateSearch: searchValidator({
    direction: v.optional(v.picklist(['buy', 'sell'])),
    settings: v.optional(v.picklist(['limit', 'range'])),
    min: v.optional(validPositiveNumber),
    max: v.optional(validPositiveNumber),
    budget: v.optional(validPositiveNumber),
  }),
});

const recurringPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/recurring',
  component: TradeRecurring,
  validateSearch: searchValidator({
    buyMin: v.optional(validPositiveNumber),
    buyMax: v.optional(validPositiveNumber),
    buyBudget: v.optional(validPositiveNumber),
    buySettings: v.optional(v.picklist(['limit', 'range'])),
    sellMin: v.optional(validPositiveNumber),
    sellMax: v.optional(validPositiveNumber),
    sellBudget: v.optional(validPositiveNumber),
    sellSettings: v.optional(v.picklist(['limit', 'range'])),
  }),
});

const overlappingPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/overlapping',
  component: TradeOverlapping,
  validateSearch: searchValidator({
    marketPrice: v.optional(validNumber),
    min: v.optional(validPositiveNumber),
    max: v.optional(validPositiveNumber),
    spread: v.optional(validNumber),
    budget: v.optional(validNumber),
    anchor: v.optional(v.picklist(['buy', 'sell'])),
    chartType: v.optional(v.picklist(['history', 'range'])),
  }),
});

export default tradePage.addChildren([
  marketPage,
  disposablePage,
  recurringPage,
  overlappingPage,
]);
