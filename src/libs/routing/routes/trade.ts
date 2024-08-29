import { Route, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  validAddress,
  validLiteral,
  validNumber,
  validateSearchParams,
} from '../utils';
import { TradeDisposable } from 'pages/trade/disposable';
import { TradeRoot } from 'pages/trade/root';
import { TradeMarket } from 'pages/trade/market';
import { TradeRecurring } from 'pages/trade/recurring';
import { TradeOverlapping } from 'pages/trade/overlapping';
import { defaultEnd, defaultStart } from 'pages/simulator';

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
export interface TradeOverlappingSearch extends TradeSearch {
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
  anchor?: StrategyDirection;
  budget?: string | null;
  chartType?: 'history' | 'range';
}
export type SetOverlapping = (next: TradeOverlappingSearch) => any;

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
    source: validNumber,
    target: validNumber,
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
    min: validNumber,
    max: validNumber,
    budget: validNumber,
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
    buyMin: validNumber,
    buyMax: validNumber,
    buyBudget: validNumber,
    buySettings: validLiteral(['limit', 'range']),
    sellMin: validNumber,
    sellMax: validNumber,
    sellBudget: validNumber,
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
    min: validNumber,
    max: validNumber,
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
