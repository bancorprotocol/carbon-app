import {
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { Dispatch, SetStateAction, useState } from 'react';
import { Strategy } from 'libs/queries';
import { lsService } from 'services/localeStorage';

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

export const useStrategiesStore = (): StrategiesStore => {
  const [search, setSearch] = useState('');
  const [sort, _setSort] = useState<StrategySort>(
    lsService.getItem('strategyOverviewSort') || StrategySort.RoiDescending
  );
  const [filter, _setFilter] = useState<StrategyFilter>(
    lsService.getItem('strategyOverviewFilter') || StrategyFilter.All
  );

  const setSort = (sort: StrategySort) => {
    _setSort(sort);
    lsService.setItem('strategyOverviewSort', sort);
  };

  const setFilter = (filter: StrategyFilter) => {
    _setFilter(filter);
    lsService.setItem('strategyOverviewFilter', filter);
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
  filter: StrategyFilter.All,
  setFilter: () => {},
  sort: StrategySort.RoiDescending,
  setSort: () => {},
  search: '',
  setSearch: () => {},
  strategyToEdit: undefined,
  setStrategyToEdit: () => {},
};
