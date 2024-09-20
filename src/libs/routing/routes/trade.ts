import { Route, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  validAddress,
  validLiteral,
  validNumber,
  validPositiveNumber,
  validateSearchParams,
} from '../utils';
import { TradeDisposable } from 'pages/trade/disposable';
import { TradeRoot } from 'pages/trade/root';
import { TradeMarket } from 'pages/trade/market';
import { TradeRecurring } from 'pages/trade/recurring';
import { TradeOverlapping } from 'pages/trade/overlapping';
import { defaultEnd, defaultStart } from 'components/strategies/common/utils';
import { OverlappingSearch } from 'components/strategies/common/types';

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
}
const tradePage = new Route({
  getParentRoute: () => rootRoute,
  path: '/trade',
  component: TradeRoot,
  beforeLoad: ({ location, search }) => {
    (search as TradeSearch).priceStart ||= defaultStart().toString();
    (search as TradeSearch).priceEnd ||= defaultEnd().toString();
    if (location.pathname.endsWith('trade')) {
      throw redirect({ to: '/trade/disposable', search });
    }
  },
});

const marketPage = new Route({
  getParentRoute: () => tradePage,
  path: '/market',
  component: TradeMarket,
  validateSearch: validateSearchParams<TradeMarketSearch>({
    base: validAddress,
    quote: validAddress,
    priceStart: validNumber,
    priceEnd: validNumber,
    direction: validLiteral(['buy', 'sell']),
  }),
});

const disposablePage = new Route({
  getParentRoute: () => tradePage,
  path: '/disposable',
  component: TradeDisposable,
  validateSearch: validateSearchParams<TradeDisposableSearch>({
    base: validAddress,
    quote: validAddress,
    priceStart: validNumber,
    priceEnd: validNumber,
    direction: validLiteral(['buy', 'sell']),
    settings: validLiteral(['limit', 'range']),
    min: validPositiveNumber,
    max: validPositiveNumber,
    budget: validPositiveNumber,
  }),
});

const recurringPage = new Route({
  getParentRoute: () => tradePage,
  path: '/recurring',
  component: TradeRecurring,
  validateSearch: validateSearchParams<TradeRecurringSearch>({
    base: validAddress,
    quote: validAddress,
    priceStart: validNumber,
    priceEnd: validNumber,
    buyMin: validPositiveNumber,
    buyMax: validPositiveNumber,
    buyBudget: validPositiveNumber,
    buySettings: validLiteral(['limit', 'range']),
    sellMin: validPositiveNumber,
    sellMax: validPositiveNumber,
    sellBudget: validPositiveNumber,
    sellSettings: validLiteral(['limit', 'range']),
  }),
});

const overlappingPage = new Route({
  getParentRoute: () => tradePage,
  path: '/overlapping',
  component: TradeOverlapping,
  validateSearch: validateSearchParams<TradeOverlappingSearch>({
    base: validAddress,
    quote: validAddress,
    priceStart: validNumber,
    priceEnd: validNumber,
    marketPrice: validNumber,
    min: validPositiveNumber,
    max: validPositiveNumber,
    spread: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
    chartType: validLiteral(['history', 'range']),
  }),
});

export default tradePage.addChildren([
  marketPage,
  disposablePage,
  recurringPage,
  overlappingPage,
]);
