import { createContext, useContext, useMemo } from 'react';
import { useGetTokensPrice } from 'libs/queries/extApi/tokenPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { useTrending } from 'libs/queries/extApi/tradeCount';
import {
  AnyStrategy,
  AnyStrategyWithFiat,
} from 'components/strategies/common/types';

export interface QueryLike<T> {
  isPending: boolean;
  data?: T;
}

export const useGetEnrichedStrategies = (
  query: QueryLike<AnyStrategy[] | AnyStrategy>,
) => {
  const trending = useTrending();

  const allPrices = useGetTokensPrice();
  const isPending = query.isPending || allPrices.isPending;

  const allEnrichedStrategies = useMemo(() => {
    if (isPending) return;
    const data = query.data ?? [];
    const strategies = Array.isArray(data) ? data : [data];
    const prices = allPrices.data ?? {};

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
  }, [allPrices, query.data, trending.data?.tradeCount, isPending]);

  return { data: allEnrichedStrategies, isPending };
};

interface StrategyCtx {
  strategies?: AnyStrategyWithFiat[];
  isPending: boolean;
}
export const StrategyContext = createContext<StrategyCtx>({
  strategies: [],
  isPending: true,
});

export const useStrategyCtx = () => useContext(StrategyContext);
