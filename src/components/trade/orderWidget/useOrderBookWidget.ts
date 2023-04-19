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
import Decimal from 'decimal.js';

Decimal.set({
  precision: 100,
  rounding: Decimal.ROUND_HALF_DOWN,
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
  const newAmount = new Decimal(amount).minus(prevAmount);
  const newTotal = new Decimal(rate).times(newAmount);

  return {
    rate,
    amount: newAmount.toString(),
    total: newTotal.toString(),
  };
};

const buildOrders = (
  data: OrderRow[],
  baseDecimals: number,
  quoteDecimals: number,
  buckets: number
): OrderRow[] => {
  return data
    .map(({ amount, rate, total }, i) =>
      _subtractPrevAmount(data, amount, rate, total, i)
    )
    .filter(({ amount }) => amount !== '0')
    .splice(0, buckets)
    .map(({ amount, rate, total }) => ({
      rate: new Decimal(rate).toFixed(quoteDecimals, 1),
      amount: new Decimal(amount).toFixed(baseDecimals, 1),
      total: new Decimal(total).toFixed(quoteDecimals, 1),
    }));
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

  const baseDecimals = getTokenById(base!)?.decimals || 0;
  const quoteDecimals = getTokenById(quote!)?.decimals || 0;

  const orders = useMemo<OrderBook>(() => {
    const buy = orderBy(data?.buy || [], ({ rate }) => +rate, 'desc');
    const sell = orderBy(data?.sell || [], ({ rate }) => +rate, 'asc');

    return {
      buy: buildOrders(buy, baseDecimals, quoteDecimals, orderBookBuckets),
      sell: buildOrders(sell, baseDecimals, quoteDecimals, orderBookBuckets),
      middleRate: data?.middleRate || '0',
    };
  }, [
    baseDecimals,
    data?.buy,
    data?.middleRate,
    data?.sell,
    orderBookBuckets,
    quoteDecimals,
  ]);

  return {
    ...orderBookQuery,
    data: orders,
    isLastTradeBuy: lastTradeBuyQuery.data,
    isLastTradeLoading: lastTradeBuyQuery.isLoading,
  };
};
