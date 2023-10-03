import {
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { CarbonEvents, EventCategory } from './googleTagManager/types';
import { ExplorerType } from 'components/explorer/utils';
import { sendGTMEvent } from './googleTagManager';
import { StrategyEventType } from './types';
import { Strategy } from 'libs/queries';
import { prepareGtmStrategyData } from './strategyEvents';

interface ExplorerSearchInput {
  type: ExplorerType;
  slug?: string;
  strategies: Strategy[];
}

interface ExploreSearch {
  explore_search_type: ExplorerType;
  explore_search_wallet: string | null;
  explore_search_token_pair: string | null;
  explore_search_base_token: string | null;
  explore_search_quote_token: string | null;
  explore_search_strategies_results: number;
  explore_search_portfolio_results: number;
}

export interface EventExplorerSchema extends EventCategory {
  typeChange: {
    input: ExplorerType;
    gtmData: {
      explore_search_type_change: ExplorerType;
    };
  };
  search: {
    input: ExplorerSearchInput;
    gtmData: ExploreSearch;
  };
  resultsFilterSort: {
    input: ExplorerSearchInput & {
      filter: StrategyFilter;
      sort: StrategySort;
    };
    gtmData: ExploreSearch & {
      explore_search_filter: StrategyFilter;
      explore_search_sort: StrategySort;
    };
  };
  manageClick: {
    input: ExplorerSearchInput & {
      strategyEvent: StrategyEventType;
    };
    gtmData: ExploreSearch;
  };
  viewOwnersStrategiesClick: {
    input: ExplorerSearchInput & {
      strategyEvent: StrategyEventType;
    };
    gtmData: ExploreSearch;
  };
}

function toGmtExplorerSearch({ type, slug, strategies }: ExplorerSearchInput) {
  const tokens = strategies
    .map((s) => [s.base.address, s.quote.address])
    .flat();
  return {
    explore_search_type: type,
    explore_search_wallet: type === 'wallet' && slug ? slug : null,
    explore_search_token_pair:
      type === 'token-pair' && slug ? slug.replace('_', '/') : null,
    explore_search_base_token:
      type === 'token-pair' && slug ? slug.split('_').shift()! : null,
    explore_search_quote_token:
      type === 'token-pair' && slug ? slug.split('_').pop()! : null,
    explore_search_strategies_results: strategies.length,
    explore_search_portfolio_results: new Set(tokens).size,
  };
}

export const explorerEvents: CarbonEvents['explorer'] = {
  typeChange: (type) => {
    sendGTMEvent('explorer', 'exploreSearchTypeChange', {
      explore_search_type_change: type,
    });
  },
  search: (event) => {
    sendGTMEvent('explorer', 'exploreSearch', toGmtExplorerSearch(event));
  },
  resultsFilterSort: ({ type, slug, strategies, filter, sort }) => {
    sendGTMEvent('explorer', 'exploreSearchResultsFilterSort', {
      ...toGmtExplorerSearch({ type, slug, strategies }),
      explore_search_filter: filter,
      explore_search_sort: sort,
    });
  },
  manageClick: ({ type, slug, strategies, strategyEvent }) => {
    sendGTMEvent('explorer', 'exploreSearchManageClick', {
      ...toGmtExplorerSearch({ type, slug, strategies }),
      ...prepareGtmStrategyData(strategyEvent),
    });
  },
  viewOwnersStrategiesClick: ({ type, slug, strategies, strategyEvent }) => {
    sendGTMEvent('explorer', 'exploreSearchViewOwnersStrategiesClick', {
      ...toGmtExplorerSearch({ type, slug, strategies }),
      ...prepareGtmStrategyData(strategyEvent),
    });
  },
};
