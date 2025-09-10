import { FC, ReactNode, createContext, useContext, useMemo } from 'react';
import { UseQueryResult } from 'libs/queries';
import { toPairName, fromPairSearch } from 'utils/pairSearch';
import { useGetAllTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { useStore } from 'store';
import { SafeDecimal } from 'libs/safedecimal';
import { useSearch } from 'libs/routing';
import { useTrending } from 'libs/queries/extApi/tradeCount';
import {
  AnyStrategy,
  AnyStrategyWithFiat,
} from 'components/strategies/common/types';

// export type StrategyFilterOutput = ReturnType<typeof useStrategyFilter>;

// export interface MyStrategiesSearch {
//   search?: string;
// }
// type Search = MyStrategiesSearch;

// export const useStrategyFilter = (
//   strategies: AnyStrategyWithFiat[],
//   isPending: boolean,
// ) => {
//   const searchParams: Search = useSearch({ strict: false });
//   const navigate = useNavigate({ from: '/' });
//   const search = searchParams.search || '';

//   const setSearch = useCallback(
//     (search: string) => {
//       navigate({
//         params: (params) => params,
//         search: () => ({ search }),
//         replace: true,
//         resetScroll: false,
//       });
//     },
//     [navigate],
//   );

//   const [sort, setSort] = useState<StrategySort>(getSortFromLS());
//   const [filter, setFilter] = useState<StrategyFilter>(getFilterFromLS());

//   useEffect(() => {
//     lsService.setItem('strategyOverviewSort', sort);
//   }, [sort]);
//   useEffect(() => {
//     lsService.setItem('strategyOverviewFilter', filter);
//   }, [filter]);

//   const filteredStrategies = useMemo(() => {
//     const pairSearch = fromPairSearch(search);
//     // Filter
//     const filtered = strategies.filter((strategy) => {
//       if (filter.status === 'active' && strategy.status !== 'active') {
//         return false;
//       }
//       if (filter.status === 'inactive' && strategy.status === 'active') {
//         return false;
//       }
//       // @todo(gradient)
//       // if (filter.type === 'gradient' && !isGradientStrategy(strategy)) {
//       //   return false;
//       // }
//       // if (filter.type === 'static' && isGradientStrategy(strategy)) {
//       //   return false;
//       // }
//       if (!search) return true;
//       const name = toPairName(strategy.base, strategy.quote);
//       return fromPairSearch(name).includes(pairSearch);
//     });

//     // Sort
//     const compareFunction = getCompareFunctionBySortType(sort);
//     return filtered?.sort((a, b) => {
//       const order = compareFunction(a, b);
//       return order || getCompareFunctionBySortType('recent')(a, b);
//     });
//   }, [search, strategies, filter, sort]);

//   return {
//     strategies,
//     filteredStrategies,
//     isPending,
//     search,
//     setSearch,
//     sort,
//     setSort,
//     filter,
//     setFilter,
//   };
// };

export const useGetEnrichedStrategies = (
  allStrategies: UseQueryResult<AnyStrategy[] | AnyStrategy, any>,
) => {
  const { fiatCurrency } = useStore();
  const allPrices = useGetAllTokenPrices();
  const trending = useTrending();
  const currency = fiatCurrency.selectedFiatCurrency;

  const isPending = useMemo(() => {
    if (allStrategies.isPending) return true;
    if (trending.isPending) return true;
    if (!allPrices.length) return true;
    return allPrices.some((query) => query.isPending);
  }, [allPrices, allStrategies.isPending, trending.isPending]);

  const allEnrichedStrategies = useMemo(() => {
    const data = allStrategies.data ?? [];
    const strategies = Array.isArray(data) ? data : [data];
    const tokens = strategies.map(({ base, quote }) => [base, quote]).flat();
    const addresses = Array.from(new Set(tokens?.map((t) => t.address)));
    const prices: Record<string, number | undefined> = {};
    for (let i = 0; i < allPrices.length; i++) {
      const address = addresses[i];
      const price = allPrices[i].data?.[currency];
      prices[address] = price;
    }

    const tradeCount = new Map<string, number>();
    const tradeCount24h = new Map<string, number>();
    for (const item of trending.data?.tradeCount ?? []) {
      tradeCount.set(item.id, item.strategyTrades);
      tradeCount24h.set(item.id, item.strategyTrades_24h);
    }

    return strategies.map((strategy) => {
      const basePrice = new SafeDecimal(prices[strategy.base.address] ?? 0);
      const quotePrice = new SafeDecimal(prices[strategy.quote.address] ?? 0);
      const base = basePrice.times(strategy.sell.budget);
      const quote = quotePrice.times(strategy.buy.budget);
      const total = base.plus(quote);
      return {
        ...strategy,
        fiatBudget: { base, quote, total },
        tradeCount: tradeCount.get(strategy.id) ?? 0,
        tradeCount24h: tradeCount24h.get(strategy.id) ?? 0,
      } as AnyStrategyWithFiat;
    });
  }, [allPrices, allStrategies.data, currency, trending.data?.tradeCount]);

  return { data: allEnrichedStrategies, isPending };
};

const useFilterStrategies = (
  url: '/explore' | '/portfolio',
  strategies?: AnyStrategyWithFiat[],
) => {
  const { search } = useSearch({ from: url });
  if (!search || !strategies) return strategies ?? [];
  const pairSearch = fromPairSearch(search);
  return strategies.filter((strategy) => {
    const name = toPairName(strategy.base, strategy.quote);
    return fromPairSearch(name).includes(pairSearch);
    // TODO: implement filter by owner
  });
};

interface StrategyCtx {
  strategies: AnyStrategyWithFiat[];
  isPending: boolean;
}
const StrategyContext = createContext<StrategyCtx>({
  strategies: [],
  isPending: true,
});

interface StrategyProviderProps {
  url: '/explore' | '/portfolio';
  query: UseQueryResult<AnyStrategy[], unknown>;
  children: ReactNode;
}
export const StrategyProvider: FC<StrategyProviderProps> = (props) => {
  const { data, isPending } = useGetEnrichedStrategies(props.query);
  const strategies = useFilterStrategies(props.url, data);

  return (
    <StrategyContext.Provider value={{ strategies, isPending }}>
      {props.children}
    </StrategyContext.Provider>
  );
};

export const useStrategyCtx = () => useContext(StrategyContext);
