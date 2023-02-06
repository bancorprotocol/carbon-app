import { OrderBook, useGetOrderBook } from 'libs/queries/sdk/orderBook';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { orderBy } from 'lodash';

export const useOrderBookWidget = (base?: string, quote?: string) => {
  const orderBookQuery = useGetOrderBook(base, quote);

  const orders = useMemo<OrderBook>(() => {
    const buy = [...(orderBookQuery.data?.buy || [])];
    const sell = [...(orderBookQuery.data?.sell || [])];

    const data = {
      buy: orderBy(buy, 'rate', 'desc'),
      sell: orderBy(sell, 'rate', 'asc'),
    };

    const _subtractPrevAmount = (
      buy: boolean,
      amount: string,
      rate: string,
      i: number
    ) => {
      const prevAmount = data[buy ? 'buy' : 'sell'][i - 1]?.amount || '0';
      const newAmount = new BigNumber(amount).minus(prevAmount);
      const totalAmount = newAmount.times(rate);

      return {
        rate,
        amount: newAmount.toString(),
        total: totalAmount.toString(),
      };
    };

    return {
      buy: data.buy
        .map(({ amount, rate }, i) =>
          _subtractPrevAmount(true, amount, rate, i)
        )
        .filter(({ amount }) => amount !== '0')
        .splice(0, 14),
      sell: data.sell
        .map(({ amount, rate }, i) =>
          _subtractPrevAmount(false, amount, rate, i)
        )
        .filter(({ amount }) => amount !== '0')
        .splice(0, 14),
      middleRate: orderBookQuery.data?.middleRate || '0',
    };
  }, [orderBookQuery.data]);

  return { ...orderBookQuery, data: orders };
};
