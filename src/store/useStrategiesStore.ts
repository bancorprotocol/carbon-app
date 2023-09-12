import {
  EnumStrategyFilter,
  EnumStrategySort,
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { Dispatch, SetStateAction, useState } from 'react';
import { Strategy } from 'libs/queries';
import { lsService } from 'services/localeStorage';
import { explorerEvents } from 'services/events/explorerEvents';

export interface StrategiesStore {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  sort: StrategySort;
  setSort: (sort: StrategySort) => void;
  filter: StrategyFilter;
  setFilter: (filter: StrategyFilter) => void;
  strategyToEdit: Strategy | undefined;
  setStrategyToEdit: Dispatch<SetStateAction<Strategy | undefined>>;
}

/** Used for local storage migration */
export const strategySortMapping: Record<EnumStrategySort, StrategySort> = {
  [EnumStrategySort.Recent]: 'recent',
  [EnumStrategySort.Old]: 'old',
  [EnumStrategySort.PairAscending]: 'pairAsc',
  [EnumStrategySort.PairDescending]: 'pairDesc',
  [EnumStrategySort.RoiAscending]: 'roiAsc',
  [EnumStrategySort.RoiDescending]: 'roiDesc',
};
const isEnumSort = (
  sort: StrategySort | EnumStrategySort
): sort is EnumStrategySort => sort in strategySortMapping;

export const getSortFromLS = (): StrategySort => {
  const sort = lsService.getItem('strategyOverviewSort');
  if (sort === undefined) return 'roiDesc';
  return isEnumSort(sort) ? strategySortMapping[sort] : sort;
};

/** Used for local storage migration */
export const strategyFilterMapping: Record<EnumStrategyFilter, StrategyFilter> =
  {
    [EnumStrategyFilter.All]: 'all',
    [EnumStrategyFilter.Active]: 'active',
    [EnumStrategyFilter.Inactive]: 'inactive',
  };

const isEnumFilter = (
  filter: StrategyFilter | EnumStrategyFilter
): filter is EnumStrategyFilter => filter in strategyFilterMapping;

export const getFilterFromLS = (): StrategyFilter => {
  const filter = lsService.getItem('strategyOverviewFilter');
  if (filter === undefined) return 'all';
  return isEnumFilter(filter) ? strategyFilterMapping[filter] : filter;
};

export const useStrategiesStore = (): StrategiesStore => {
  const [search, setSearch] = useState('');
  const [sort, _setSort] = useState<StrategySort>(getSortFromLS());
  const [filter, _setFilter] = useState<StrategyFilter>(getFilterFromLS());

  const setSort = (sort: StrategySort) => {
    _setSort(sort);
    lsService.setItem('strategyOverviewSort', sort);
    // use global location because local useLocation is not available here
    if (window.location.pathname.startsWith('/explorer')) {
      explorerEvents.exploreSearchResultsFilterSort({ search, sort, filter });
    }
  };

  const setFilter = (filter: StrategyFilter) => {
    _setFilter(filter);
    lsService.setItem('strategyOverviewFilter', filter);
    // use global location because local useLocation is not available here
    if (window.location.pathname.startsWith('/explorer')) {
      explorerEvents.exploreSearchResultsFilterSort({ search, sort, filter });
    }
  };

  // TODO clean up edit strategy
  const [strategyToEdit, setStrategyToEdit] = useState<Strategy | undefined>(
    undefined
  );

  return {
    search,
    setSearch,
    sort,
    setSort,
    filter,
    setFilter,
    strategyToEdit,
    setStrategyToEdit,
  };
};

export const defaultStrategiesStore: StrategiesStore = {
  filter: 'all',
  setFilter: () => {},
  sort: 'roiDesc',
  setSort: () => {},
  search: '',
  setSearch: () => {},
  strategyToEdit: undefined,
  setStrategyToEdit: () => {},
};
