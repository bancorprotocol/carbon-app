import {
  StrategyFilter,
  StrategySort,
  getFilterFromLS,
  getSortFromLS,
} from 'components/strategies/overview/StrategyFilterSort';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Strategy, UseQueryResult } from 'libs/queries';
import { lsService } from 'services/localeStorage';
import { toPairName, fromPairSlug } from 'utils/pairSearch';
import { getCompareFunctionBySortType } from 'components/strategies/overview/utils';

type StrateyQuery = UseQueryResult<Strategy[], unknown>;
export type StrategyFilterOutput = ReturnType<typeof useStrategyFilter>;

export const useStrategyFilter = (query: StrateyQuery) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<StrategySort>(getSortFromLS());
  const [filter, setFilter] = useState<StrategyFilter>(getFilterFromLS());

  useEffect(() => {
    lsService.setItem('strategyOverviewSort', sort);
  }, [sort]);
  useEffect(() => {
    lsService.setItem('strategyOverviewFilter', filter);
  }, [filter]);

  const filteredStrategies = useMemo(() => {
    // Filter
    const filtered = (query.data ?? []).filter((strategy) => {
      if (filter === 'active' && strategy.status !== 'active') {
        return false;
      }
      if (filter === 'inactive' && strategy.status === 'active') {
        return false;
      }
      if (!search) return true;
      const name = toPairName(strategy.base, strategy.quote);
      return fromPairSlug(name).includes(search);
    });

    // Sort
    const compareFunction = getCompareFunctionBySortType(sort);
    return filtered?.sort(compareFunction);
  }, [search, query.data, filter, sort]);

  return {
    strategies: filteredStrategies,
    isLoading: query.isLoading,
    search,
    setSearch,
    sort,
    setSort,
    filter,
    setFilter,
  };
};

type StrategyCtx = ReturnType<typeof useStrategyFilter>;
export const StrategyContext = createContext<StrategyCtx>({
  strategies: [],
  isLoading: true,
  search: '',
  setSearch: () => undefined,
  sort: 'roiDesc',
  setSort: () => undefined,
  filter: 'all',
  setFilter: () => undefined,
});

interface StrategyProviderProps {
  query: UseQueryResult<Strategy[], unknown>;
  children: ReactNode;
}
export const StrategyProvider: FC<StrategyProviderProps> = (props) => {
  const ctx = useStrategyFilter(props.query);
  return (
    <StrategyContext.Provider value={ctx}>
      {props.children}
    </StrategyContext.Provider>
  );
};

export const useStrategyCtx = () => useContext(StrategyContext);
