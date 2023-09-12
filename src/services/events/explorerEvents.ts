import {
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { CarbonEvents, EventCategory } from './googleTagManager/types';
import { ExplorerType } from 'components/explorer/utils';
import { sendGTMEvent } from './googleTagManager';

export interface EventExplorerSchema extends EventCategory {
  exploreSearchTypeChange: {
    input: ExplorerType;
    gtmData: {
      explore_search_type_change: ExplorerType;
    };
  };
  exploreSearch: {
    input: string;
    gtmData: string;
  };
  exploreSearchResultsFilterSort: {
    input: {
      search: string;
      filter: StrategyFilter;
      sort: StrategySort;
    };
    gtmData: {
      explore_search: string;
      explore_search_filter: StrategyFilter;
      explore_search_sort: StrategySort;
    };
  };
}

export const explorerEvents: CarbonEvents['explorer'] = {
  exploreSearchTypeChange: (type) => {
    sendGTMEvent('explorer', 'exploreSearchTypeChange', {
      explore_search_type_change: type,
    });
  },
  exploreSearch: (search) => sendGTMEvent('explorer', 'exploreSearch', search),
  exploreSearchResultsFilterSort: ({ search, filter, sort }) => {
    sendGTMEvent('explorer', 'exploreSearchResultsFilterSort', {
      explore_search: search,
      explore_search_filter: filter,
      explore_search_sort: sort,
    });
  },
};
