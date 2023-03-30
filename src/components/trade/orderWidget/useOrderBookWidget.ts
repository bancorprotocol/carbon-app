import {
  OrderBook,
  OrderRow,
  useGetOrderBook,
  useGetOrderBookLastTradeBuy,
} from 'libs/queries/sdk/orderBook';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { orderBy } from 'lodash';
import { useTokens } from 'hooks/useTokens';
import { useStore } from 'store';

const _subtractPrevAmount = (
  data: OrderRow[],
  amount: string,
  rate: string,
  total: string,
  i: number
) => {
  const prevAmount = data[i - 1]?.amount || '0';
  const prevTotal = data[i - 1]?.total || '0';
  const newAmount = new BigNumber(amount).minus(prevAmount);
  const newTotal = new BigNumber(total).minus(prevTotal);

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
      rate: new BigNumber(rate).toFixed(quoteDecimals, 1),
      amount: new BigNumber(amount).toFixed(baseDecimals, 1),
      total: new BigNumber(total).toFixed(quoteDecimals, 1),
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
