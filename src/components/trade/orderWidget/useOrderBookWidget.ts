import {
  OrderBook,
  OrderRow,
  useGetOrderBook,
  useGetOrderBookLastTradeBuy,
} from 'libs/queries/sdk/orderBook';
import { useMemo } from 'react';
import { orderBy } from 'lodash';
import { useTokens } from 'hooks/useTokens';
import { useStore } from 'store';
import { SafeDecimal } from 'libs/safedecimal';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

const ROW_AMOUNT_MIN_THRESHOLD = 0.0001;

SafeDecimal.set({
  precision: 100,
  rounding: SafeDecimal.ROUND_HALF_DOWN,
  toExpNeg: -30,
  toExpPos: 30,
});

const _subtractPrevAmount = (
  data: OrderRow[],
  amount: string,
  rate: string,
  total: string,
  i: number
) => {
  const prevAmount = data[i - 1]?.amount || '0';
  const newAmount = new SafeDecimal(amount).minus(prevAmount);
  const newTotal = new SafeDecimal(rate).times(newAmount);

  return {
    rate,
    amount: newAmount.toString(),
    total: newTotal.toString(),
  };
};

const buildOrders = (data: OrderRow[], buckets: number): OrderRow[] => {
  return data
    .map(({ amount, rate, total }, i) => {
      return _subtractPrevAmount(data, amount, rate, total, i);
    })
    .filter(({ amount }) => {
      return new SafeDecimal(amount).gte(ROW_AMOUNT_MIN_THRESHOLD);
    })
    .splice(0, buckets);
};

export const useOrderBookWidget = (base?: string, quote?: string) => {
  const {
    orderBook: {
      settings: { steps, orderBookBuckets },
    },
  } = useStore();
  const orderBookQuery = useGetOrderBook(steps, base, quote);
  const lastTradeBuyQuery = useGetOrderBookLastTradeBuy(quote, base);
  const { getTokenById } = useTokens();
  const { data } = orderBookQuery;

  const quoteToken = getTokenById(quote!);
  const { getFiatValue } = useFiatCurrency(quoteToken);

  const orders = useMemo<OrderBook & { middleRateFiat: string }>(() => {
    const buy = orderBy(data?.buy || [], ({ rate }) => +rate, 'desc');
    const sell = orderBy(data?.sell || [], ({ rate }) => +rate, 'asc');

    return {
      buy: buildOrders(buy, orderBookBuckets),
      sell: buildOrders(sell, orderBookBuckets),
      middleRate: data?.middleRate || '0',
      middleRateFiat: getFiatValue(data?.middleRate || '').toString(),
    };
  }, [data?.buy, data?.middleRate, data?.sell, getFiatValue, orderBookBuckets]);

  return {
    ...orderBookQuery,
    data: orders,
    isLastTradeBuy: lastTradeBuyQuery.data,
    isLastTradeLoading: lastTradeBuyQuery.isPending,
  };
};
