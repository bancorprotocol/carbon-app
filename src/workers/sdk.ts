import * as Comlink from 'comlink';
import {
  Sdk,
  Config,
  PayableOverrides,
  TradeActionStruct,
  TokenPair,
} from '@bancor/carbon-sdk';
import {
  EncodedStrategy,
  MatchAction,
  StrategyUpdate,
} from '@bancor/carbon-sdk/dist/types';
import { BigNumberish } from 'ethers';
import BigNumber from 'bignumber.js';
import { OrderRow } from 'libs/queries';
import { OrderBook } from 'libs/queries/sdk/orderBook';

const ONE = new BigNumber(1);

export const orderBookConfig = {
  steps: 100,
  buckets: {
    orderBook: 14,
    depthChart: 50,
  },
};

let carbonSDK: Sdk;
let isInitialized = false;
let isInitializing = false;

const init = async (
  config: Config,
  decimalsMap?: Map<string, number>,
  cachedData?: string
) => {
  if (isInitialized || isInitializing) return;
  isInitializing = true;
  carbonSDK = new Sdk(
    config,
    decimalsMap
      ? (address) => decimalsMap.get(address.toLowerCase())
      : undefined
  );
  await carbonSDK.startDataSync(cachedData);
  isInitialized = true;
  isInitializing = false;
};

const buildOrderBook = async (
  buy: boolean,
  baseToken: string,
  quoteToken: string,
  startRate: BigNumber,
  step: BigNumber,
  min: BigNumber,
  max: BigNumber,
  buckets: number
) => {
  const orders: OrderRow[] = [];
  let i = 0;
  let minEqMax = false;

  while (orders.length < buckets && !minEqMax) {
    minEqMax = min.eq(max);
    let rate = startRate[buy ? 'minus' : 'plus'](step.times(i)).toString();
    rate = buy ? rate : ONE.div(rate).toString();
    rate = minEqMax ? max.toString() : rate;
    i++;
    const amount = await carbonSDK.getRateLiquidityDepthByPair(
      baseToken,
      quoteToken,
      rate
    );
    let amountBn = new BigNumber(amount);
    if (amountBn.eq(0)) {
      continue;
    }
    if (buy) {
      amountBn = amountBn.div(rate);
    } else {
      rate = ONE.div(rate).toString();
    }
    const total = amountBn.times(rate).toString();
    orders.push({ rate, total, amount: amountBn.toString() });
    if (minEqMax) {
      Array.from({ length: buckets - 1 }).map((_, i) =>
        orders.push({
          rate: new BigNumber(rate)
            [buy ? 'minus' : 'plus'](step.times(i))
            .toString(),
          total,
          amount: amountBn.toString(),
        })
      );
    }
  }
  return orders;
};

const getOrderBook = async (
  base: string,
  quote: string,
  buckets: number
): Promise<OrderBook> => {
  const buyHasLiq = await carbonSDK.hasLiquidityByPair(base, quote);
  const sellHasLiq = await carbonSDK.hasLiquidityByPair(quote, base);
  const minBuy = new BigNumber(
    buyHasLiq ? await carbonSDK.getMinRateByPair(base, quote) : 0
  );
  const maxBuy = new BigNumber(
    buyHasLiq ? await carbonSDK.getMaxRateByPair(base, quote) : 0
  );
  const minSell = new BigNumber(
    sellHasLiq ? await carbonSDK.getMinRateByPair(quote, base) : 0
  );
  const maxSell = new BigNumber(
    sellHasLiq ? await carbonSDK.getMaxRateByPair(quote, base) : 0
  );

  const stepBuy = maxBuy.minus(minBuy).div(orderBookConfig.steps);
  const stepSell = ONE.div(minSell)
    .minus(ONE.div(maxSell))
    .div(orderBookConfig.steps);

  const getStep = () => {
    if (stepBuy.isFinite() && stepBuy.gt(0)) {
      if (stepSell.isFinite() && stepSell.gt(0)) {
        return stepBuy.lte(stepSell) ? stepBuy : stepSell;
      } else {
        return stepBuy;
      }
    } else if (stepSell.isFinite() && stepSell.gt(0)) {
      return stepSell;
    } else {
      if (minBuy.gt(0) && minBuy.eq(maxBuy)) {
        return minBuy.div(orderBookConfig.steps);
      }
      if (minSell.gt(0) && minSell.eq(maxSell)) {
        return minSell.div(orderBookConfig.steps);
      }
      return ONE.div(10000);
    }
  };
  const step = getStep();

  const getMiddleRate = () => {
    if (
      maxBuy.isFinite() &&
      maxBuy.gt(0) &&
      maxSell.isFinite() &&
      maxSell.gt(0)
    ) {
      return maxBuy.plus(ONE.div(maxSell)).div(2);
    }
    if (maxBuy.isFinite() && maxBuy.gt(0)) {
      return maxBuy;
    }
    if (maxSell.isFinite() && maxSell.gt(0)) {
      return ONE.div(maxSell);
    }
    return new BigNumber(0);
  };
  const middleRate = getMiddleRate();

  const buy = buyHasLiq
    ? await buildOrderBook(
        true,
        base,
        quote,
        middleRate,
        step,
        minBuy,
        maxBuy,
        buckets
      )
    : [];

  const sell = sellHasLiq
    ? await buildOrderBook(
        false,
        quote,
        base,
        middleRate,
        step,
        minSell,
        maxSell,
        buckets
      )
    : [];

  const largestBuy = Math.max(
    ...buy.map((o) => new BigNumber(o.rate).toNumber())
  );

  const smallestSell = Math.min(
    ...sell.map((o) => new BigNumber(o.rate).toNumber())
  );

  const newMiddleRate =
    largestBuy > 0 &&
    smallestSell > 0 &&
    isFinite(largestBuy) &&
    isFinite(smallestSell)
      ? new BigNumber(largestBuy).plus(smallestSell).div(2).toString()
      : middleRate.toString();

  return {
    buy,
    sell,
    middleRate: newMiddleRate,
    step: step.toString(),
  };
};

const obj = {
  init,
  isInitialized: () => isInitialized,
  getAllTokenPairs: () => carbonSDK.getAllTokenPairs(),
  onPairDataChanged: (cb: (affectedPairs: TokenPair[]) => void) => {
    carbonSDK.on('onPairDataChanged', (affectedPairs) => cb(affectedPairs));
    return;
  },
  onPairAddedToCache: (cb: (affectedPairs: TokenPair) => void) => {
    carbonSDK.on('onPairAddedToCache', (affectedPairs) => cb(affectedPairs));
    return;
  },
  setOnChangeHandlers: (
    onPairDataChanged: (affectedPairs: TokenPair[]) => void,
    onPairAddedToCache: (affectedPairs: TokenPair) => void
  ) => {
    carbonSDK.on('onPairDataChanged', (affectedPairs) =>
      onPairDataChanged(affectedPairs)
    );
    carbonSDK.on('onPairAddedToCache', (affectedPairs) =>
      onPairAddedToCache(affectedPairs)
    );
    return;
  },
  getRateLiquidityDepthByPair: (
    baseToken: string,
    quoteToken: string,
    rate: string
  ) => carbonSDK.getRateLiquidityDepthByPair(baseToken, quoteToken, rate),
  hasLiquidityByPair: (baseToken: string, quoteToken: string) =>
    carbonSDK.hasLiquidityByPair(baseToken, quoteToken),
  getMinRateByPair: (baseToken: string, quoteToken: string) =>
    carbonSDK.getMinRateByPair(baseToken, quoteToken),
  getMaxRateByPair: (baseToken: string, quoteToken: string) =>
    carbonSDK.getMaxRateByPair(baseToken, quoteToken),
  getUserStrategies: (address: string) => carbonSDK.getUserStrategies(address),
  createBuySellStrategy: (
    baseToken: string,
    quoteToken: string,
    buyPriceLow: string,
    buyPriceHigh: string,
    buyBudget: string,
    sellPriceLow: string,
    sellPriceHigh: string,
    sellBudget: string,
    overrides?: PayableOverrides | undefined
  ) =>
    carbonSDK.createBuySellStrategy(
      baseToken,
      quoteToken,
      buyPriceLow,
      buyPriceHigh,
      buyBudget,
      sellPriceLow,
      sellPriceHigh,
      sellBudget,
      overrides
    ),
  updateStrategy: (
    strategyId: BigNumberish,
    encoded: EncodedStrategy,
    baseToken: string,
    quoteToken: string,
    data: StrategyUpdate,
    buyMarginalPrice?: string | undefined,
    sellMarginalPrice?: string | undefined,
    overrides?: PayableOverrides | undefined
  ) =>
    carbonSDK.updateStrategy(
      strategyId,
      encoded,
      baseToken,
      quoteToken,
      data,
      buyMarginalPrice,
      sellMarginalPrice,
      overrides
    ),
  deleteStrategy: (strategyId: BigNumberish) =>
    carbonSDK.deleteStrategy(strategyId),
  getTradeData: (
    sourceToken: string,
    targetToken: string,
    amount: string,
    isTradeBySource: boolean
  ) =>
    carbonSDK.getTradeData(sourceToken, targetToken, amount, isTradeBySource),
  getTradeDataFromActions: (
    sourceToken: string,
    targetToken: string,
    isTradeBySource: boolean,
    actionsWei: MatchAction[]
  ) =>
    carbonSDK.getTradeDataFromActions(
      sourceToken,
      targetToken,
      isTradeBySource,
      actionsWei
    ),
  getLiquidityByPair: (baseToken: string, quoteToken: string) =>
    carbonSDK.getLiquidityByPair(baseToken, quoteToken),
  composeTradeBySourceTransaction: (
    sourceToken: string,
    targetToken: string,
    actions: TradeActionStruct[],
    deadline: string,
    minReturn: string,
    overrides?: PayableOverrides | undefined
  ) =>
    carbonSDK.composeTradeBySourceTransaction(
      sourceToken,
      targetToken,
      actions,
      deadline,
      minReturn,
      overrides
    ),
  composeTradeByTargetTransaction: (
    sourceToken: string,
    targetToken: string,
    actions: TradeActionStruct[],
    deadline: string,
    maxInput: string,
    overrides?: PayableOverrides | undefined
  ) =>
    carbonSDK.composeTradeByTargetTransaction(
      sourceToken,
      targetToken,
      actions,
      deadline,
      maxInput,
      overrides
    ),
  getOrderBook,
  getCacheDump: () => carbonSDK.getCacheDump(),
};

export type CarbonSDKWebWorker = typeof obj;

Comlink.expose(obj);

export {};
