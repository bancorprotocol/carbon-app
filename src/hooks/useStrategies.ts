import {
  StrategyFilter,
  StrategySort,
  getFilterFromLS,
  getSortFromLS,
} from 'components/strategies/overview/StrategyFilterSort';
import { useMemo, useState } from 'react';
import { Strategy, useGetUserStrategies } from 'libs/queries';
import { lsService } from 'services/localeStorage';
import { toPairName, toPairSlug } from 'utils/pairSearch';
import { getCompareFunctionBySortType } from 'components/strategies/overview/utils';

export const useStrategies = (user?: string) => {
  const query = useGetUserStrategies({ user });
  const [search, setSearch] = useState('');
  const [sort, _setSort] = useState<StrategySort>(getSortFromLS());
  const [filter, _setFilter] = useState<StrategyFilter>(getFilterFromLS());

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

  const strategies = useMemo(() => {
    // Filter
    const filtered = query.data?.filter((strategy) => {
      if (filter === 'active' && strategy.status !== 'active') {
        return false;
      }
      if (filter === 'inactive' && strategy.status === 'active') {
        return false;
      }
      if (!search) return true;
      const name = toPairName(strategy.base, strategy.quote);
      return toPairSlug(name).includes(search);
    });

    // Sort
    const compareFunction = getCompareFunctionBySortType(sort);
    return filtered?.sort(compareFunction);
  }, [search, query, filter, sort]);

  return {
    strategies,
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
