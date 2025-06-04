import { Order, Strategy } from 'libs/queries';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { useStore } from 'store';
import { sortObjectArray } from 'utils/helpers';
import { FiatPriceDict } from 'utils/carbonApi';

export interface PortfolioData {
  token: Token;
  share: SafeDecimal;
  amount: SafeDecimal;
  value: SafeDecimal;
  strategies: Strategy[];
  fiatPrice: number;
}
interface Props {
  strategies?: Strategy[];
  isPending?: boolean;
}

export const usePortfolioData = ({
  strategies,
  isPending: _isPending,
}: Props) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  const uniqueTokens = useMemo(() => {
    const data = strategies;
    if (!data) return [];

    const tokens = new Set<string>();

    data.forEach((strategy) => {
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
    const data = strategies;
    if (!data) return new SafeDecimal(0);

    return data.reduce((acc, strategy) => {
      const fiatPriceDictQuote = tokenPriceMap.get(strategy.quote.address);
      const tokenPriceQuote = fiatPriceDictQuote?.[selectedFiatCurrency] || 0;

      const amountQuote = new SafeDecimal(strategy.order0.balance);
      const fiatAmountQuote = amountQuote.times(tokenPriceQuote);

      const fiatPriceDictBase = tokenPriceMap.get(strategy.base.address);
      const tokenPriceBase = fiatPriceDictBase?.[selectedFiatCurrency] || 0;

      const amountBase = new SafeDecimal(strategy.order1.balance);
      const fiatAmountBase = amountBase.times(tokenPriceBase);

      const fiatAmount = fiatAmountQuote.plus(fiatAmountBase);
      return acc.plus(fiatAmount);
    }, new SafeDecimal(0));
  }, [selectedFiatCurrency, strategies, tokenPriceMap]);

  const tableData: PortfolioData[] = useMemo(() => {
    const data = strategies;
    if (!data) return [];

    const unsorted = data.reduce(
      ((map) => (acc: PortfolioData[], strategy) => {
        const handleData = (token: Token, order: Order) => {
          const fiatPriceDict = tokenPriceMap.get(token.address);
          const tokenPrice = fiatPriceDict?.[selectedFiatCurrency] || 0;

          const amount = new SafeDecimal(order.balance);

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
            item.amount = item.amount.plus(order.balance);
            item.value = item.value.plus(amount.times(tokenPrice));
            item.strategies.push(strategy);
          }
        };

        handleData(strategy.quote, strategy.order0);
        handleData(strategy.base, strategy.order1);

        return acc;
      })(new Map<string, PortfolioData>()),
      [],
    );

    // TODO cleanup sort function
    return sortObjectArray(unsorted, 'share', (a, b) =>
      a.share.gt(b.share) ? -1 : 1,
    );
  }, [selectedFiatCurrency, strategies, tokenPriceMap, totalValue]);

  const isPending = useMemo(() => {
    return _isPending || tokenPriceQueries.some((query) => query.isPending);
  }, [_isPending, tokenPriceQueries]);

  return { tableData, totalValue, isPending };
};
