import { carbonSDK } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';

export type OrderRow = { rate: string; total: string; amount: string };

const buildOrderBook = async (
  baseToken: string,
  quoteToken: string,
  min: BigNumber | string,
  buckets: number,
  step: BigNumber | string
) => {
  const orders: OrderRow[] = [];

  for (let i = new BigNumber(0); i.lte(buckets); i = i.plus(1)) {
    const rate = i.times(step).plus(min).toString();
    const amount = await carbonSDK.getRateLiquidityDepthByPair(
      baseToken,
      quoteToken,
      rate
    );
    const total = new BigNumber(amount).times(rate).toString();
    orders.push({ rate, total, amount });
  }

  console.log('order jan', orders);

  return orders;
};

const getOrderBook = async (
  base: string,
  quote: string,
  buckets = 10,
  normalize?: boolean
) => {
  const minBuy = new BigNumber(await carbonSDK.getMinRateByPair(base, quote));
  const maxBuy = new BigNumber(await carbonSDK.getMaxRateByPair(base, quote));
  const minSell = new BigNumber(await carbonSDK.getMinRateByPair(quote, base));
  const maxSell = new BigNumber(await carbonSDK.getMaxRateByPair(quote, base));

  console.log('order jan minBuy', minBuy.toString());
  console.log('order jan maxBuy', maxBuy.toString());
  console.log('order jan minSell', minSell.toString());
  console.log('order jan maxSell', maxSell.toString());

  const deltaBuy = maxBuy.minus(minBuy);
  const deltaSell = maxSell.minus(minSell);

  const stepBuy = deltaBuy.div(buckets);
  const stepSell = deltaSell.div(buckets);

  const stepNormalized = stepBuy.lte(stepSell) ? stepBuy : stepSell;

  return {
    buyOrders: await buildOrderBook(
      base,
      quote,
      minBuy,
      buckets,
      normalize ? stepNormalized : stepBuy
    ),
    sellOrders: await buildOrderBook(
      quote,
      base,
      minSell,
      buckets,
      normalize ? stepNormalized : stepSell
    ),
  };
};

export const useGetOrderBook = (
  base?: string,
  quote?: string,
  buckets = 14,
  normalize = false
) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery({
    queryKey: QueryKey.tradeOrderBook(base!, quote!, buckets!, normalize!),
    queryFn: () => getOrderBook(base!, quote!, buckets!, normalize!),
    enabled: isInitialized && !!base && !!quote,
    retry: 1,
  });
};
