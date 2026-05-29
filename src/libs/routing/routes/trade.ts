import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validAddress,
  validNumber,
  validInputNumber,
  validBoolean,
  validDirection,
  validSettings,
  validChartType,
} from '../utils';
import { TradeDisposable } from 'pages/trade/disposable';
import { TradeRoot } from 'pages/trade/root';
import { TradeMarket } from 'pages/trade/market';
import { TradeRecurring } from 'pages/trade/recurring';
import { TradeOverlapping } from 'pages/trade/overlapping';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { defaultSpread } from 'components/strategies/overlapping/utils';
import { TradeAuction } from 'pages/trade/auction';
import { TradeQuickAuction } from 'pages/trade/quick-auction';
import { addMonths, startOfDay, subWeeks } from 'date-fns';
import { toUnixUTC } from 'components/simulator/utils';
import { TradeChannel } from 'pages/trade/channel';
import { TradeQuickChannel } from 'pages/trade/quick-channel';
import * as v from 'valibot';
import { TradeTriangle } from 'pages/trade/triangle';
import { TradeQuickTriangle } from 'pages/trade/quick-triangle';

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
  presetMin?: string;
  presetMax?: string;
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
export type TradeOverlappingSearch = Partial<
  (typeof overlappingPage)['types']['searchSchema']
>;
export type SetOverlapping = (next: TradeOverlappingSearch) => any;

// TRADE MARKET
export interface TradeMarketSearch extends TradeSearch {
  direction?: StrategyDirection;
  sourceInput?: string;
  targetInput?: string;
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
const tradePage = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trade',
  component: TradeRoot,
  beforeLoad: ({ location }) => {
    if (location.pathname.endsWith('trade')) {
      throw redirect({
        to: '/trade/disposable',
        search: { direction: 'sell', settings: 'limit' },
      });
    }
  },
  validateSearch: searchValidator({
    marketPrice: v.optional(validNumber),
    base: v.optional(validAddress),
    quote: v.optional(validAddress),
    chartStart: v.optional(validNumber),
    chartEnd: v.optional(validNumber),
  }),
});

const marketPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/market',
  component: TradeMarket,
  validateSearch: searchValidator({
    direction: v.optional(validDirection),
    sourceInput: v.optional(validInputNumber),
    targetInput: v.optional(validInputNumber),
  }),
});

const disposablePage = createRoute({
  getParentRoute: () => tradePage,
  path: '/disposable',
  component: TradeDisposable,
  validateSearch: searchValidator({
    direction: v.optional(validDirection),
    settings: v.optional(validSettings),
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    presetMin: v.optional(validNumber),
    presetMax: v.optional(validNumber),
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
    buyPresetMin: v.optional(validNumber),
    buyPresetMax: v.optional(validNumber),
    buyBudget: v.optional(validInputNumber),
    buySettings: v.optional(validSettings),
    buyMarginalPrice: v.optional(v.enum(MarginalPriceOptions)),
    sellMin: v.optional(validInputNumber),
    sellMax: v.optional(validInputNumber),
    sellPresetMin: v.optional(validNumber),
    sellPresetMax: v.optional(validNumber),
    sellBudget: v.optional(validInputNumber),
    sellSettings: v.optional(validSettings),
    sellMarginalPrice: v.optional(v.enum(MarginalPriceOptions)),
  }),
});

const overlappingPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/overlapping',
  component: TradeOverlapping,
  beforeLoad: ({ search }) => {
    if (!search.preset && search.fullRange) search.preset = 'Infinity';
    delete search.fullRange;
  },
  validateSearch: searchValidator({
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    preset: v.optional(validNumber),
    spread: v.optional(validNumber, defaultSpread),
    budget: v.optional(validNumber),
    anchor: v.optional(validDirection),
    chartType: v.optional(validChartType),
    // @deprecated (March 2026)
    fullRange: v.optional(validBoolean),
  }),
});

const setGradientChartDates = (search: {
  chartStart?: string;
  chartEnd?: string;
}) => {
  if (!search.chartStart) {
    const date = startOfDay(subWeeks(new Date(), 7));
    search.chartStart = toUnixUTC(date).toString();
  }
  if (!search.chartEnd) {
    const date = startOfDay(addMonths(new Date(), 2));
    search.chartEnd = toUnixUTC(date).toString();
  }
};

const auctionPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/auction',
  component: TradeAuction,
  beforeLoad: ({ search }) => {
    setGradientChartDates(search);
  },
  validateSearch: searchValidator({
    direction: v.optional(validDirection),
    startPrice: v.optional(validInputNumber),
    endPrice: v.optional(validInputNumber),
    startDate: v.optional(validNumber),
    endDate: v.optional(validNumber),
    budget: v.optional(validInputNumber),
  }),
});

export type ChannelSearch = (typeof channelPage)['types']['searchSchema'] &
  TradeSearch;
const channelPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/channel',
  component: TradeChannel,
  beforeLoad: ({ search }) => {
    setGradientChartDates(search);
  },
  validateSearch: searchValidator({
    deltaPrice: v.optional(validInputNumber),
    deltaType: v.optional(v.picklist(['percent', 'token'])),
    buyBudget: v.optional(validInputNumber),
    sellStartPrice: v.optional(validInputNumber),
    sellEndPrice: v.optional(validInputNumber),
    sellStartDate: v.optional(validNumber),
    sellEndDate: v.optional(validNumber),
    sellBudget: v.optional(validInputNumber),
  }),
});

const trianglePage = createRoute({
  getParentRoute: () => tradePage,
  path: '/triangle',
  component: TradeTriangle,
  beforeLoad: ({ search }) => {
    setGradientChartDates(search);
  },
  validateSearch: searchValidator({
    buyStartPrice: v.optional(validInputNumber),
    buyEndPrice: v.optional(validInputNumber),
    buyStartDate: v.optional(validNumber),
    buyEndDate: v.optional(validNumber),
    buyBudget: v.optional(validInputNumber),
    sellStartPrice: v.optional(validInputNumber),
    sellEndPrice: v.optional(validInputNumber),
    sellStartDate: v.optional(validNumber),
    sellEndDate: v.optional(validNumber),
    sellBudget: v.optional(validInputNumber),
  }),
});

const quickAuctionPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/quick-auction',
  component: TradeQuickAuction,
  validateSearch: searchValidator({
    direction: v.optional(validDirection),
    startPrice: v.optional(validInputNumber),
    endPrice: v.optional(validInputNumber),
    deltaTime: v.optional(validInputNumber),
    budget: v.optional(validInputNumber),
  }),
});

export type QuickChannelSearch =
  (typeof quickChannelPage)['types']['searchSchema'] & TradeSearch;
const quickChannelPage = createRoute({
  getParentRoute: () => tradePage,
  path: '/quick-channel',
  component: TradeQuickChannel,
  validateSearch: searchValidator({
    deltaPrice: v.optional(validInputNumber),
    deltaType: v.optional(v.picklist(['percent', 'token'])),
    buyBudget: v.optional(validInputNumber),
    sellStartPrice: v.optional(validInputNumber),
    sellEndPrice: v.optional(validInputNumber),
    sellBudget: v.optional(validInputNumber),
    sellDeltaTime: v.optional(validInputNumber),
  }),
});
const quickTrianglePage = createRoute({
  getParentRoute: () => tradePage,
  path: '/quick-triangle',
  component: TradeQuickTriangle,
  validateSearch: searchValidator({
    buyStartPrice: v.optional(validInputNumber),
    buyEndPrice: v.optional(validInputNumber),
    buyDeltaTime: v.optional(validNumber),
    buyBudget: v.optional(validInputNumber),
    sellStartPrice: v.optional(validInputNumber),
    sellEndPrice: v.optional(validInputNumber),
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
  channelPage,
  trianglePage,
  quickAuctionPage,
  quickChannelPage,
  quickTrianglePage,
]);
