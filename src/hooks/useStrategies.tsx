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
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UseQueryResult } from 'libs/queries';
import { lsService } from 'services/localeStorage';
import { toPairName, fromPairSearch } from 'utils/pairSearch';
import { getCompareFunctionBySortType } from 'components/strategies/overview/utils';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { useStore } from 'store';
import { SafeDecimal } from 'libs/safedecimal';
import { useNavigate, useSearch } from 'libs/routing';
import { useTradeCount } from 'libs/queries/extApi/tradeCount';
import {
  AnyStrategy,
  AnyStrategyWithFiat,
} from 'components/strategies/common/types';

export type StrategyFilterOutput = ReturnType<typeof useStrategyFilter>;

export interface MyStrategiesSearch {
  search?: string;
}
type Search = MyStrategiesSearch;

export const useStrategyFilter = (
  strategies: AnyStrategyWithFiat[],
  isPending: boolean,
) => {
  const searchParams: Search = useSearch({ strict: false });
  const navigate = useNavigate({ from: '/' });
  const search = searchParams.search || '';

  const setSearch = useCallback(
    (search: string) => {
      navigate({
        params: (params) => params,
        search: () => ({ search }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const [sort, setSort] = useState<StrategySort>(getSortFromLS());
  const [filter, setFilter] = useState<StrategyFilter>(getFilterFromLS());

  useEffect(() => {
    lsService.setItem('strategyOverviewSort', sort);
  }, [sort]);
  useEffect(() => {
    lsService.setItem('strategyOverviewFilter', filter);
  }, [filter]);

  const filteredStrategies = useMemo(() => {
    const pairSearch = fromPairSearch(search);
    // Filter
    const filtered = strategies.filter((strategy) => {
      if (filter.status === 'active' && strategy.status !== 'active') {
        return false;
      }
      if (filter.status === 'inactive' && strategy.status === 'active') {
        return false;
      }
      // @todo(gradient)
      // if (filter.type === 'gradient' && !isGradientStrategy(strategy)) {
      //   return false;
      // }
      // if (filter.type === 'static' && isGradientStrategy(strategy)) {
      //   return false;
      // }
      if (!search) return true;
      const name = toPairName(strategy.base, strategy.quote);
      return fromPairSearch(name).includes(pairSearch);
    });

    // Sort
    const compareFunction = getCompareFunctionBySortType(sort);
    return filtered?.sort((a, b) => {
      const order = compareFunction(a, b);
      return order || getCompareFunctionBySortType('recent')(a, b);
    });
  }, [search, strategies, filter, sort]);

  return {
    strategies,
    filteredStrategies,
    isPending,
    search,
    setSearch,
    sort,
    setSort,
    filter,
    setFilter,
  };
};

export const useStrategiesWithFiat = (
  query: UseQueryResult<AnyStrategy[] | AnyStrategy, unknown>,
) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();
  const data = query.data ?? [];
  const strategies = Array.isArray(data) ? data : [data];
  const tokens = strategies.map(({ base, quote }) => [base, quote]).flat();
  const addresses = Array.from(new Set(tokens?.map((t) => t.address)));
  const priceQueries = useGetMultipleTokenPrices(addresses);
  const prices: Record<string, number | undefined> = {};
  for (let i = 0; i < priceQueries.length; i++) {
    const address = addresses[i];
    const price = priceQueries[i].data?.[selectedFiatCurrency];
    prices[address] = price;
  }

  const tradeCountQuery = useTradeCount();
  const result = strategies.map((strategy) => {
    const basePrice = new SafeDecimal(prices[strategy.base.address] ?? 0);
    const quotePrice = new SafeDecimal(prices[strategy.quote.address] ?? 0);
    const base = basePrice.times(strategy.sell.budget);
    const quote = quotePrice.times(strategy.buy.budget);
    const total = base.plus(quote);
    const trades = tradeCountQuery.data[strategy.id];
    return {
      ...strategy,
      fiatBudget: { base, quote, total },
      tradeCount: trades?.tradeCount ?? 0,
      tradeCount24h: trades?.tradeCount24h ?? 0,
    };
  });
  return {
    strategies: result,
    isPending:
      query.isPending ||
      priceQueries.some((q) => q.isPending) ||
      tradeCountQuery.isPending,
  };
};

type StrategyCtx = ReturnType<typeof useStrategyFilter>;
export const StrategyContext = createContext<StrategyCtx>({
  strategies: [],
  filteredStrategies: [],
  isPending: true,
  search: '',
  setSearch: () => undefined,
  sort: 'trades',
  setSort: () => undefined,
  filter: {
    status: 'all',
    // @todo(gradient)
    // type: 'all',
  },
  setFilter: () => undefined,
});

interface StrategyProviderProps {
  query: UseQueryResult<AnyStrategy[], unknown>;
  children: ReactNode;
}
export const StrategyProvider: FC<StrategyProviderProps> = (props) => {
  const { strategies, isPending } = useStrategiesWithFiat(props.query);
  const ctx = useStrategyFilter(strategies, isPending);
  return (
    <StrategyContext.Provider value={ctx}>
      {props.children}
    </StrategyContext.Provider>
  );
};

export const useStrategyCtx = () => useContext(StrategyContext);
