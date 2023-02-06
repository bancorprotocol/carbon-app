import { carbonSDK } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';

const ONE = new BigNumber(1);

export type OrderRow = { rate: string; total: string; amount: string };

export type OrderBook = {
  buy: OrderRow[];
  sell: OrderRow[];
  middleRate: string;
};

export const orderBookBuckets = 100;

const buildOrderBook = async (
  buy: boolean,
  baseToken: string,
  quoteToken: string,
  startRate: BigNumber,
  step: BigNumber
) => {
  const orders: OrderRow[] = [];
  let i = 0;

  while (orders.length < orderBookBuckets) {
    let rate = startRate[buy ? 'minus' : 'plus'](step.times(i)).toString();
    i++;

    rate = buy ? rate : ONE.div(rate).toString();

    let amount = await carbonSDK.getRateLiquidityDepthByPair(
      baseToken,
      quoteToken,
      rate
    );
    if (amount === '0') {
      continue;
    }
    if (buy) {
      amount = new BigNumber(amount).div(rate).toString();
    } else {
      rate = ONE.div(rate).toString();
    }

    const total = new BigNumber(amount).times(rate).toString();

    orders.push({ rate, total, amount });
  }

  return orders;
};

const getOrderBook = async (
  base: string,
  quote: string
): Promise<OrderBook> => {
  const minBuy = new BigNumber(await carbonSDK.getMinRateByPair(base, quote));
  const maxBuy = new BigNumber(await carbonSDK.getMaxRateByPair(base, quote));
  const minSell = new BigNumber(await carbonSDK.getMinRateByPair(quote, base));
  const maxSell = new BigNumber(await carbonSDK.getMaxRateByPair(quote, base));

  const stepBuy = maxBuy.minus(minBuy).div(orderBookBuckets);
  const stepSell = ONE.div(minSell)
    .minus(ONE.div(maxSell))
    .div(orderBookBuckets);

  const step = stepBuy.lte(stepSell) ? stepBuy : stepSell;

  const middleRate = maxBuy.plus(ONE.div(maxSell)).div(2);

  return {
    buy: await buildOrderBook(true, base, quote, middleRate, step),
    sell: await buildOrderBook(false, quote, base, middleRate, step),
    middleRate: middleRate.toString(),
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
