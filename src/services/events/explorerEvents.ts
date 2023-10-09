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
  filter: string;
  sort: string;
}

interface ExploreSearch {
  explore_search_type: ExplorerType;
  explore_search_wallet: string | null;
  explore_search_token_pair: string | null;
  explore_search_base_token: string | null;
  explore_search_quote_token: string | null;
  explore_search_active_sort: string | null;
  explore_search_active_filter: string | null;
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
  resultsFilter: {
    input: ExplorerSearchInput & {
      filter: StrategyFilter;
    };
    gtmData: ExploreSearch & {
      explore_search_results_change_type: 'filter';
      explore_search_filter: StrategyFilter;
    };
  };
  resultsSort: {
    input: ExplorerSearchInput & {
      sort: StrategySort;
    };
    gtmData: ExploreSearch & {
      explore_search_results_change_type: 'sort';
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

function toGmtExplorerSearch(input: ExplorerSearchInput) {
  const { type, slug, strategies, filter, sort } = input;
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
    explore_search_active_sort: sort,
    explore_search_active_filter: filter,
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
  resultsFilter: ({ type, slug, strategies, filter, sort }) => {
    sendGTMEvent('explorer', 'exploreSearchResultsFilter', {
      ...toGmtExplorerSearch({ type, slug, strategies, filter, sort }),
    });
  },
  resultsSort: ({ type, slug, strategies, filter, sort }) => {
    sendGTMEvent('explorer', 'exploreSearchResultsSort', {
      ...toGmtExplorerSearch({ type, slug, strategies, filter, sort }),
    });
  },
  manageClick: ({ type, slug, strategies, strategyEvent, filter, sort }) => {
    sendGTMEvent('explorer', 'exploreSearchManageClick', {
      ...toGmtExplorerSearch({ type, slug, strategies, filter, sort }),
      ...prepareGtmStrategyData(strategyEvent),
    });
  },
  viewOwnersStrategiesClick: (input) => {
    const { type, slug, strategies, strategyEvent, filter, sort } = input;
    sendGTMEvent('explorer', 'exploreSearchViewOwnersStrategiesClick', {
      ...toGmtExplorerSearch({ type, slug, strategies, filter, sort }),
      ...prepareGtmStrategyData(strategyEvent),
    });
  },
};
