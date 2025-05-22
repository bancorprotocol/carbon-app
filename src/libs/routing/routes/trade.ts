import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validAddress,
  validNumber,
  validInputNumber,
} from '../utils';
import { TradeDisposable } from 'pages/trade/disposable';
import { TradeRoot } from 'pages/trade/root';
import { TradeMarket } from 'pages/trade/market';
import { TradeRecurring } from 'pages/trade/recurring';
import { TradeOverlapping } from 'pages/trade/overlapping';
import { OverlappingSearch } from 'components/strategies/common/types';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import * as v from 'valibot';
import { defaultSpread } from 'components/strategies/overlapping/utils';

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
}

// ROUTES
export interface TradeSearch {
  base?: string;
  quote?: string;
  priceStart?: string;
  priceEnd?: string;
  marketPrice?: string;
}
const tradePage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trade',
  component: TradeRoot,
  beforeLoad: ({ location, search }) => {
    if (location.pathname.endsWith('trade')) {
      throw redirect({ to: '/trade/overlapping', search });
    }
  },
  validateSearch: searchValidator({
    base: v.optional(v.fallback(validAddress, '')),
    quote: v.optional(v.fallback(validAddress, '')),
    priceStart: v.optional(validNumber),
    priceEnd: v.optional(validNumber),
  }),
});

const marketPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/market',
  component: TradeMarket,
  validateSearch: searchValidator({
    direction: v.optional(v.picklist(['buy', 'sell'])),
  }),
});

const disposablePage = createRoute({
  getParentRoute: () => tradePage,
  path: '/disposable',
  component: TradeDisposable,
  validateSearch: searchValidator({
    marketPrice: v.optional(validNumber),
    direction: v.optional(v.picklist(['buy', 'sell'])),
    settings: v.optional(v.picklist(['limit', 'range'])),
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    budget: v.optional(validInputNumber),
    marginalPrice: v.optional(v.enum(MarginalPriceOptions)),
  }),
});

const recurringPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/recurring',
  component: TradeRecurring,
  validateSearch: searchValidator({
    marketPrice: v.optional(validNumber),
    buyMin: v.optional(validInputNumber),
    buyMax: v.optional(validInputNumber),
    buyBudget: v.optional(validInputNumber),
    buySettings: v.optional(v.picklist(['limit', 'range'])),
    buyMarginalPrice: v.optional(v.enum(MarginalPriceOptions)),
    sellMin: v.optional(validInputNumber),
    sellMax: v.optional(validInputNumber),
    sellBudget: v.optional(validInputNumber),
    sellSettings: v.optional(v.picklist(['limit', 'range'])),
    sellMarginalPrice: v.optional(v.enum(MarginalPriceOptions)),
  }),
});

const overlappingPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/overlapping',
  component: TradeOverlapping,
  beforeLoad: ({ search }) => {
    if (!('spread' in search)) {
      search.spread = defaultSpread;
    }
  },
  validateSearch: searchValidator({
    marketPrice: v.optional(validNumber),
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
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
