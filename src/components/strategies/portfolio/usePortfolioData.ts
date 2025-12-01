import { AnyStrategyWithFiat, Order } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetTokensPrice } from 'libs/queries/extApi/tokenPrice';

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
  const tokensPriceQuery = useGetTokensPrice();

  const totalValue = useMemo(() => {
    if (!strategies?.length) return new SafeDecimal(0);
    return strategies.reduce((acc, strategy) => {
      return acc.plus(strategy.fiatBudget.total);
    }, new SafeDecimal(0));
  }, [strategies]);

  const tableData: PortfolioData[] = useMemo(() => {
    if (!strategies?.length) return [];
    if (tokensPriceQuery.isPending) return [];
    const prices = tokensPriceQuery.data ?? {};
    const unsorted = strategies.reduce(
      ((map) => (acc: PortfolioData[], strategy) => {
        const handleData = (token: Token, order: Order) => {
          const tokenPrice = prices[token.address];
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
  }, [
    strategies,
    tokensPriceQuery.data,
    tokensPriceQuery.isPending,
    totalValue,
  ]);

  return { tableData, totalValue, isPending: tokensPriceQuery.isPending };
};
