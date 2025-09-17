import { createContext, useContext, useMemo } from 'react';
import { UseQueryResult } from 'libs/queries';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { useStore } from 'store';
import { SafeDecimal } from 'libs/safedecimal';
import { useTrending } from 'libs/queries/extApi/tradeCount';
import {
  AnyStrategy,
  AnyStrategyWithFiat,
} from 'components/strategies/common/types';

export const useGetEnrichedStrategies = (
  allStrategies: UseQueryResult<AnyStrategy[] | AnyStrategy, any>,
) => {
  const { fiatCurrency } = useStore();
  const trending = useTrending();
  const currency = fiatCurrency.selectedFiatCurrency;
  const isPending = allStrategies.isPending;

  const tokens = useMemo(() => {
    if (!allStrategies.data) return [];
    const data = allStrategies.data ?? [];
    const strategies = Array.isArray(data) ? data : [data];
    const all = strategies.map(({ base, quote }) => [
      base.address,
      quote.address,
    ]);
    const unique = new Set(all.flat());
    return Array.from(unique);
  }, [allStrategies.data]);

  const allPrices = useGetMultipleTokenPrices(tokens);

  const allEnrichedStrategies = useMemo(() => {
    if (isPending) return;
    const data = allStrategies.data ?? [];
    const strategies = Array.isArray(data) ? data : [data];
    const tokens = strategies.map(({ base, quote }) => [base, quote]).flat();
    const addresses = Array.from(new Set(tokens?.map((t) => t.address)));
    const prices: Record<string, number | undefined> = {};
    for (let i = 0; i < allPrices.data.length; i++) {
      const address = addresses[i];
      const price = allPrices.data[i]?.[currency];
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
  }, [
    allPrices,
    allStrategies.data,
    currency,
    trending.data?.tradeCount,
    isPending,
  ]);

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
