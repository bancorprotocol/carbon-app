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
import { Strategy, StrategyWithFiat, UseQueryResult } from 'libs/queries';
import { lsService } from 'services/localeStorage';
import { toPairName, fromPairSlug } from 'utils/pairSearch';
import { getCompareFunctionBySortType } from 'components/strategies/overview/utils';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { useStore } from 'store';
import { SafeDecimal } from 'libs/safedecimal';

export type StrategyFilterOutput = ReturnType<typeof useStrategyFilter>;

export const useStrategyFilter = (
  strategies: StrategyWithFiat[],
  isLoading: boolean
) => {
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
    const filtered = strategies.filter((strategy) => {
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
  }, [search, strategies, filter, sort]);

  return {
    strategies: filteredStrategies,
    isLoading,
    search,
    setSearch,
    sort,
    setSort,
    filter,
    setFilter,
  };
};

const useStrategiesWithFiat = (query: UseQueryResult<Strategy[], unknown>) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();
  const strategies = query.data ?? [];
  const tokens = strategies.map(({ base, quote }) => [base, quote]).flat();
  const addresses = Array.from(new Set(tokens?.map((t) => t.address)));
  const priceQueries = useGetMultipleTokenPrices(addresses);
  const prices: Record<string, number | undefined> = {};
  for (let i = 0; i < priceQueries.length; i++) {
    const address = addresses[i];
    const price = priceQueries[i].data?.[selectedFiatCurrency];
    prices[address] = price;
  }
  return strategies.map((strategy) => {
    const basePrice = new SafeDecimal(prices[strategy.base.address] ?? 0);
    const quotePrice = new SafeDecimal(prices[strategy.quote.address] ?? 0);
    const base = basePrice.times(strategy.order1.balance);
    const quote = quotePrice.times(strategy.order0.balance);
    const total = base.plus(quote);
    return { ...strategy, fiatBudget: { base, quote, total } };
  });
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
  const strategies = useStrategiesWithFiat(props.query);
  const ctx = useStrategyFilter(strategies, props.query.isLoading);
  return (
    <StrategyContext.Provider value={ctx}>
      {props.children}
    </StrategyContext.Provider>
  );
};

export const useStrategyCtx = () => useContext(StrategyContext);
