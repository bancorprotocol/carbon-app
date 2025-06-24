import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validAddress,
  validNumber,
  validInputNumber,
  getLastVisitedPair,
} from '../utils';
import { TradeDisposable } from 'pages/trade/disposable';
import { TradeRoot } from 'pages/trade/root';
import { TradeMarket } from 'pages/trade/market';
import { TradeRecurring } from 'pages/trade/recurring';
import { TradeOverlapping } from 'pages/trade/overlapping';
import { OverlappingSearch } from 'components/strategies/common/types';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { toUnixUTCDay } from 'components/simulator/utils';
import { subMonths } from 'date-fns';
import * as v from 'valibot';
import { defaultSpread } from 'components/strategies/overlapping/utils';

// TRADE TYPE
export type StrategyType =
  | 'recurring'
  | 'disposable'
  | 'overlapping'
  | 'gradient';
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

// TRADE AUCTION
export interface TradeAuctionSearch extends TradeSearch {
  direction?: StrategyDirection;
  start?: string;
  end?: string;
  min?: string;
  max?: string;
  budget?: string;
}

// ROUTES
export interface TradeSearch {
  base?: string;
  quote?: string;
  chartStart?: string;
  chartEnd?: string;
  marketPrice?: string;
}
const defaultPair = getLastVisitedPair();
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
    marketPrice: v.optional(validNumber),
    base: v.optional(v.fallback(validAddress, defaultPair.base)),
    quote: v.optional(v.fallback(validAddress, defaultPair.quote)),
    chartStart: v.optional(validNumber, toUnixUTCDay(subMonths(new Date(), 3))),
    chartEnd: v.optional(validNumber, toUnixUTCDay(new Date())),
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
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    spread: v.optional(validNumber),
    budget: v.optional(validNumber),
    anchor: v.optional(v.picklist(['buy', 'sell'])),
    chartType: v.optional(v.picklist(['history', 'range'])),
  }),
});

const auctionPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/auction',
  // @todo(gradient)
  component: () => null,
  // component: TradeAuction,
  validateSearch: searchValidator({
    direction: v.optional(v.picklist(['buy', 'sell'])),
    _sP_: v.optional(validInputNumber),
    _eP_: v.optional(validInputNumber),
    _sD_: v.optional(validNumber),
    _eD_: v.optional(validNumber),
    budget: v.optional(validInputNumber),
  }),
});

const customPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/custom',
  // @todo(gradient)
  component: () => null,
  // component: TradeCustom,
  validateSearch: searchValidator({
    directions: v.optional(v.array(v.picklist(['buy', 'sell']))),
    buy_SP_: v.optional(validInputNumber),
    buy_EP_: v.optional(validInputNumber),
    buy_SD_: v.optional(validNumber),
    buy_ED_: v.optional(validNumber),
    buyBudget: v.optional(validInputNumber),
    sell_SP_: v.optional(validInputNumber),
    sell_EP_: v.optional(validInputNumber),
    sell_SD_: v.optional(validNumber),
    sell_ED_: v.optional(validNumber),
    sellBudget: v.optional(validInputNumber),
  }),
});

const quickAuctionPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/quick-auction',
  // @todo(gradient)
  component: () => null,
  // component: TradeQuickAuction,
  validateSearch: searchValidator({
    direction: v.optional(v.picklist(['buy', 'sell'])),
    _sP_: v.optional(validInputNumber),
    _eP_: v.optional(validInputNumber),
    deltaTime: v.optional(validInputNumber),
    budget: v.optional(validInputNumber),
  }),
});

const quickCustomPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/quick-custom',
  // @todo(gradient)
  component: () => null,
  // component: TradeQuickCustom,
  validateSearch: searchValidator({
    directions: v.optional(v.array(v.picklist(['buy', 'sell']))),
    buy_SP_: v.optional(validInputNumber),
    buy_EP_: v.optional(validInputNumber),
    buyDeltaTime: v.optional(validNumber),
    buyBudget: v.optional(validInputNumber),
    sell_SP_: v.optional(validInputNumber),
    sell_EP_: v.optional(validInputNumber),
    sellDeltaTime: v.optional(validNumber),
    sellBudget: v.optional(validInputNumber),
  }),
});

export default tradePage.addChildren([
  marketPage,
  disposablePage,
  recurringPage,
  overlappingPage,
  auctionPage,
  customPage,
  quickAuctionPage,
  quickCustomPage,
]);
