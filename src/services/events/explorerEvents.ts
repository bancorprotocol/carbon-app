import {
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { CarbonEvents, EventCategory } from './googleTagManager/types';
import { ExplorerType } from 'components/explorer/utils';
import { sendGTMEvent } from './googleTagManager';

interface ExplorerQuery {
  search: string;
  filter: StrategyFilter;
  sort: StrategySort;
}

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
    input: ExplorerQuery;
    gtmData: ExplorerQuery;
  };
}

export const explorerEvents: CarbonEvents['explorer'] = {
  exploreSearchTypeChange: (type) => {
    sendGTMEvent('explorer', 'exploreSearchTypeChange', {
      explore_search_type_change: type,
    });
  },
  exploreSearch: (search) => sendGTMEvent('explorer', 'exploreSearch', search),
  exploreSearchResultsFilterSort: (query) => {
    sendGTMEvent('explorer', 'exploreSearchResultsFilterSort', query);
  },
};
