import { carbonSDK } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';

export type OrderRow = { rate: string; total: string; amount: string };

const buckets = 10;

const buildOrderBook = (
  baseToken: string,
  quoteToken: string,
  min: BigNumber | string,
  step: BigNumber | string
) => {
  const orders: OrderRow[] = [];

  for (let i = new BigNumber(0); i.lt(buckets); i = i.plus(1)) {
    const rate = i.times(step).plus(min).toString();
    const amount = carbonSDK.getRateLiquidityDepthByPair(
      baseToken,
      quoteToken,
      rate
    );
    const total = new BigNumber(amount).multipliedBy(rate).toString();
    orders.push({ rate, total, amount });
  }

  console.log('order jan', orders);

  return orders;
};

const getOrderBook = (base: string, quote: string) => {
  const minBuy = new BigNumber(carbonSDK.getMinRateByPair(quote, base));
  const maxBuy = new BigNumber(carbonSDK.getMaxRateByPair(quote, base));
  const minSell = new BigNumber(1).div(carbonSDK.getMaxRateByPair(base, quote));
  const maxSell = new BigNumber(1).div(carbonSDK.getMinRateByPair(base, quote));
  console.log('order jan minBuy', minBuy.toString());
  console.log('order jan maxBuy', maxBuy.toString());
  console.log('order jan minSell', minSell.toString());
  console.log('order jan maxSell', maxSell.toString());

  const deltaBuy = maxBuy.minus(minBuy);
  const deltaSell = maxSell.minus(minSell);

  const step = deltaBuy.lt(deltaSell)
    ? deltaBuy.isZero()
      ? maxSell.minus(minSell).div(buckets)
      : maxBuy.minus(minBuy).div(buckets)
    : deltaSell.isZero()
    ? maxBuy.minus(minBuy).div(buckets)
    : maxSell.minus(minSell).div(buckets);

  return {
    buyOrders: buildOrderBook(base, quote, minBuy, step),
    sellOrders: buildOrderBook(quote, base, minSell, step),
  };
};

export const useGetOrderBook = (base?: string, quote?: string) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery({
    queryKey: QueryKey.tradeOrderBook(base!, quote!),
    queryFn: () => getOrderBook(base!, quote!),
    enabled: isInitialized && !!base && !!quote,
    retry: 1,
  });
};
