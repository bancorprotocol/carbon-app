import { AnyRoute, Route, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  SearchParamsValidator,
  validAddress,
  validLiteral,
  validNumber,
  validateSearchParams,
} from '../utils';
import { StrategyDirection, StrategySettings } from './strategyCreate';
import { activityValidators } from 'components/activity/utils';
import { TradeType } from 'pages/trade/type';
import { TradeDisposable } from 'pages/trade/disposable';
import { TradeRecurringSell } from 'pages/trade/recurring/sell';
import { TradeRecurringBuy } from 'pages/trade/recurring/buy';
import { TradeRecurringSummary } from 'pages/trade/recurring/summary';
import { TradeOverlappingPrice } from 'pages/trade/overlapping/price';
import { TradeOverlappingBudget } from 'pages/trade/overlapping/budget';
import { TradeOverlappingSummary } from 'pages/trade/overlapping/summary';
import { TradeOverview } from 'pages/trade/overview';
import { TradePortfolio } from 'pages/trade/portfolio';
import { TradeActivity } from 'pages/trade/activity';
import { TradeRoot } from 'pages/trade/root';
import { TradeMarket } from 'pages/trade/market';

// TRADE TYPE
export type TradeTypeSelection =
  | 'disposable'
  | 'recurring'
  | 'overlapping'
  | 'market';
export interface TradeTypeSearch extends TradeSearch {
  type?: TradeTypeSelection;
}
const getTradeTypeRoute = <P extends AnyRoute, V>(
  parent: P,
  validators: SearchParamsValidator<V>
) => {
  return new Route({
    getParentRoute: () => parent,
    path: '/type',
    component: TradeType,
    validateSearch: validateSearchParams<TradeTypeSearch & V>({
      ...validators,
      base: validAddress,
      quote: validAddress,
      type: validLiteral(['disposable', 'recurring', 'overlapping', 'market']),
    }),
  });
};

// TRADE DISPOSABLE
export interface TradeDisposableSearch extends TradeSearch {
  direction: StrategyDirection;
  settings: StrategySettings;
  min?: string;
  max?: string;
  budget?: string;
}
const getTradeDisposableRoute = <P extends AnyRoute, V>(
  parent: P,
  validators: SearchParamsValidator<V>
) => {
  return new Route({
    getParentRoute: () => parent,
    path: '/disposable',
    component: TradeDisposable,
    validateSearch: validateSearchParams<TradeDisposableSearch & V>({
      ...validators,
      base: validAddress,
      quote: validAddress,
      direction: validLiteral(['buy', 'sell']),
      settings: validLiteral(['limit', 'range']),
      min: validNumber,
      max: validNumber,
      budget: validNumber,
    }),
  });
};

// TRADE RECURRING
export interface TradeRecurringSearch extends TradeSearch {
  buyMin?: string;
  buyMax?: string;
  buyBudget?: string;
  buySettings: StrategySettings;
  sellMin?: string;
  sellMax?: string;
  sellBudget?: string;
  sellSettings: StrategySettings;
}
const getTradeRecurringRoute = <P extends AnyRoute, V>(
  parent: P,
  validators: SearchParamsValidator<V>
) => {
  const validateSearch = validateSearchParams<TradeRecurringSearch & V>({
    ...validators,
    base: validAddress,
    quote: validAddress,
    buyMin: validNumber,
    buyMax: validNumber,
    buyBudget: validNumber,
    buySettings: validLiteral(['limit', 'range']),
    sellMin: validNumber,
    sellMax: validNumber,
    sellBudget: validNumber,
    sellSettings: validLiteral(['limit', 'range']),
  });
  const root = new Route({
    getParentRoute: () => parent,
    path: '/recurring',
  });
  const sell = new Route({
    getParentRoute: () => root,
    path: '/sell',
    component: TradeRecurringSell,
    validateSearch,
  });
  const buy = new Route({
    getParentRoute: () => root,
    path: '/buy',
    component: TradeRecurringBuy,
    validateSearch,
  });
  const summary = new Route({
    getParentRoute: () => root,
    path: '/summary',
    component: TradeRecurringSummary,
    validateSearch,
  });
  return root.addChildren([sell, buy, summary]);
};

// TRADE OVERLAPPING
interface TradeOverlappingSearch extends TradeSearch {
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
  anchor?: StrategyDirection;
  budget?: string;
  chartType?: 'history' | 'range';
}
const getTradeOverlappingRoute = <P extends AnyRoute, V>(
  parent: P,
  validators: SearchParamsValidator<V>
) => {
  const root = new Route({
    getParentRoute: () => parent,
    path: '/overlapping',
    validateSearch: validateSearchParams<TradeOverlappingSearch>({
      ...validators,
      base: validAddress,
      quote: validAddress,
      marketPrice: validNumber,
      min: validNumber,
      max: validNumber,
      spread: validNumber,
      budget: validNumber,
      anchor: validLiteral(['buy', 'sell']),
    }),
  });
  const price = new Route({
    getParentRoute: () => root,
    path: '/price',
    component: TradeOverlappingPrice,
  });
  const budget = new Route({
    getParentRoute: () => root,
    path: '/budget',
    component: TradeOverlappingBudget,
  });
  const summary = new Route({
    getParentRoute: () => root,
    path: '/summary',
    component: TradeOverlappingSummary,
  });
  return root.addChildren([price, budget, summary]);
};

// TRADE MARKET
export interface TradeMarketSearch extends TradeSearch {
  direction: StrategyDirection;
  source?: string;
  target?: string;
}
const getTradeMarketRoute = <P extends AnyRoute, V>(
  parent: P,
  validators: SearchParamsValidator<V>
) => {
  return new Route({
    getParentRoute: () => parent,
    path: '/market',
    component: TradeMarket,
    validateSearch: validateSearchParams<TradeMarketSearch & V>({
      ...validators,
      base: validAddress,
      quote: validAddress,
      direction: validLiteral(['buy', 'sell']),
      source: validNumber,
      target: validNumber,
    }),
  });
};

// ROUTES
export interface TradeSearch {
  base?: string;
  quote?: string;
}
const tradePage = new Route({
  getParentRoute: () => rootRoute,
  path: '/trade',
  component: TradeRoot,
  beforeLoad: ({ location, search }) => {
    if (location.pathname.endsWith('trade')) {
      throw redirect({ to: '/trade/overview/type', search });
    }
  },
});

const tradeOverview = new Route({
  getParentRoute: () => tradePage,
  path: '/overview',
  component: TradeOverview,
  beforeLoad: ({ location }) => {
    if (location.pathname.endsWith('overview')) {
      throw redirect({ to: '/trade/overview/type' });
    }
  },
});

interface TradePortfolioSearch {
  token?: string;
}
const portfolioValidator: SearchParamsValidator<TradePortfolioSearch> = {
  token: validAddress,
};
const tradePortfolio = new Route({
  getParentRoute: () => tradePage,
  path: '/portfolio',
  component: TradePortfolio,
  beforeLoad: ({ location }) => {
    if (location.pathname.endsWith('portfolio')) {
      throw redirect({ to: '/trade/portfolio/type' });
    }
  },
});

const tradeActivity = new Route({
  getParentRoute: () => tradePage,
  path: '/activity',
  component: TradeActivity,
  beforeLoad: ({ location }) => {
    if (location.pathname.endsWith('activity')) {
      throw redirect({ to: '/trade/activity/type' });
    }
  },
});

export default tradePage.addChildren([
  tradeOverview.addChildren([
    getTradeTypeRoute(tradeOverview, {}),
    getTradeDisposableRoute(tradeOverview, {}),
    getTradeRecurringRoute(tradeOverview, {}),
    getTradeOverlappingRoute(tradeOverview, {}),
    getTradeMarketRoute(tradeOverview, {}),
  ]),
  tradePortfolio.addChildren([
    getTradeTypeRoute(tradePortfolio, portfolioValidator),
    getTradeDisposableRoute(tradePortfolio, portfolioValidator),
    getTradeRecurringRoute(tradePortfolio, portfolioValidator),
    getTradeOverlappingRoute(tradePortfolio, portfolioValidator),
    getTradeMarketRoute(tradePortfolio, portfolioValidator),
  ]),
  tradeActivity.addChildren([
    getTradeTypeRoute(tradeActivity, activityValidators),
    getTradeDisposableRoute(tradeActivity, activityValidators),
    getTradeRecurringRoute(tradeActivity, activityValidators),
    getTradeOverlappingRoute(tradeActivity, activityValidators),
    getTradeMarketRoute(tradeActivity, activityValidators),
  ]),
]);
