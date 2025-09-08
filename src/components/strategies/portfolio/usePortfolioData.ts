import { AnyStrategyWithFiat, Order } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { useStore } from 'store';
import { FiatPriceDict } from 'utils/carbonApi';

export interface PortfolioData {
  token: Token;
  share: SafeDecimal;
  amount: SafeDecimal;
  value: SafeDecimal;
  strategies: AnyStrategyWithFiat[];
  fiatPrice: number;
}
interface Props {
  strategies?: AnyStrategyWithFiat[];
}

export const usePortfolioData = ({ strategies }: Props) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  const uniqueTokens = useMemo(() => {
    if (!strategies) return [];

    const tokens = new Set<string>();

    strategies.forEach((strategy) => {
      tokens.add(strategy.quote.address);
      tokens.add(strategy.base.address);
    });

    return Array.from(tokens);
  }, [strategies]);

  const tokenPriceQueries = useGetMultipleTokenPrices(uniqueTokens);

  const tokenPriceMap = useMemo(() => {
    const map = new Map<string, FiatPriceDict>();

    tokenPriceQueries.forEach((query, index) => {
      if (query.data) map.set(uniqueTokens[index], query.data);
    });

    return map;
  }, [tokenPriceQueries, uniqueTokens]);

  const totalValue = useMemo(() => {
    if (!strategies?.length) return new SafeDecimal(0);
    return strategies.reduce((acc, strategy) => {
      return acc.plus(strategy.fiatBudget.total);
    }, new SafeDecimal(0));
  }, [strategies]);

  const tableData: PortfolioData[] = useMemo(() => {
    if (!strategies?.length) return [];
    const unsorted = strategies.reduce(
      ((map) => (acc: PortfolioData[], strategy) => {
        const handleData = (token: Token, order: Order) => {
          const fiatPriceDict = tokenPriceMap.get(token.address);
          const tokenPrice = fiatPriceDict?.[selectedFiatCurrency] || 0;

          const amount = new SafeDecimal(order.budget);

          let item = map.get(token.symbol);

          if (!item) {
            const value = amount.times(tokenPrice);
            const share = value.dividedBy(totalValue).times(100);

            item = {
              token,
              share,
              amount,
              value,
              strategies: [strategy],
              fiatPrice: tokenPrice,
            };

            map.set(token.symbol, item);
            acc.push(item);
          } else {
            item.share = item.share.plus(
              amount.times(tokenPrice).dividedBy(totalValue).times(100),
            );
            item.amount = item.amount.plus(order.budget);
            item.value = item.value.plus(amount.times(tokenPrice));
            item.strategies.push(strategy);
          }
        };

        handleData(strategy.quote, strategy.buy);
        handleData(strategy.base, strategy.sell);

        return acc;
      })(new Map<string, PortfolioData>()),
      [],
    );

    return unsorted.sort((a, b) => (a.share.gt(b.share) ? -1 : 1));
  }, [selectedFiatCurrency, strategies, tokenPriceMap, totalValue]);

  const isPending = useMemo(() => {
    return tokenPriceQueries.some((query) => query.isPending);
  }, [tokenPriceQueries]);

  return { tableData, totalValue, isPending };
};
