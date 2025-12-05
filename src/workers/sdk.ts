import './runtime-config';
import * as Comlink from 'comlink';
import {
  PayableOverrides,
  TradeActionBNStr,
  TokenPair,
  MatchActionBNStr,
  StrategyUpdate,
  EncodedStrategyBNStr,
} from '@bancor/carbon-sdk';
import { Toolkit } from '@bancor/carbon-sdk/strategy-management';
import { ChainCache, initSyncedCache } from '@bancor/carbon-sdk/chain-cache';
import {
  ContractsApi,
  ContractsConfig,
} from '@bancor/carbon-sdk/contracts-api';
import Decimal from 'decimal.js';
import { OrderRow } from 'libs/queries';
import { OrderBook } from 'libs/queries/sdk/orderBook';
import { JsonRpcProvider } from 'ethers';

Decimal.set({
  precision: 100,
  rounding: Decimal.ROUND_HALF_DOWN,
  toExpNeg: -30,
  toExpPos: 30,
});

const ONE = new Decimal(1);

let api: ContractsApi;
let sdkCache: ChainCache;
let carbonSDK: Toolkit;
let isInitialized = false;
let isInitializing = false;

const init = async (
  chainId: number,
  rpc: {
    url: string;
    headers?: { [key: string]: string | number };
  },
  config: ContractsConfig,
  decimalsMap?: Map<string, number>,
  sdkConfig?: {
    cache?: string;
    pairBatchSize?: number;
    blockRangeSize?: number;
    refreshInterval?: number;
  },
) => {
  if (isInitialized || isInitializing) return;
  isInitializing = true;
  const provider = new JsonRpcProvider(rpc.url, chainId, {
    staticNetwork: true,
  });

  api = new ContractsApi(provider, config);
  const { cache, startDataSync } = initSyncedCache(
    api.reader,
    sdkConfig?.cache,
    sdkConfig?.pairBatchSize,
    sdkConfig?.refreshInterval,
    sdkConfig?.blockRangeSize,
  );
  sdkCache = cache;
  carbonSDK = new Toolkit(
    api,
    sdkCache,
    decimalsMap
      ? (address) => decimalsMap.get(address.toLowerCase())
      : undefined,
  );
  await startDataSync();
  isInitialized = true;
  isInitializing = false;
};

const buildOrderBook = async (
  isBuy: boolean,
  baseToken: string,
  quoteToken: string,
  startRate: Decimal,
  step: Decimal,
  min: Decimal,
  max: Decimal,
  steps: number,
): Promise<OrderRow[]> => {
  const orders: OrderRow[] = [];
  const rates: string[] = [];

  for (let i = 0; i <= steps + 1; i++) {
    const incrementBy = step.times(i);
    let rate = startRate[isBuy ? 'minus' : 'plus'](incrementBy);
    rate = isBuy ? rate : ONE.div(rate);
    if (rate.gt(0)) {
      rates.push(rate.toString());
    }
  }

  const results = await carbonSDK.getRateLiquidityDepthsByPair(
    baseToken,
    quoteToken,
    rates,
  );

  results.forEach((liquidity, i) => {
    const length = orders.length;
    let rate = rates[i];
    let liquidityBn = new Decimal(liquidity);
    let totalBn = liquidityBn;

    if (liquidityBn.eq(0)) {
      console.warn('order book getRateLiquidityDepthsByPair returns 0');
      return;
    }
    if (isBuy) {
      if (length === 0) {
        liquidityBn = liquidityBn.div(rate);
      } else {
        if (liquidityBn.eq(orders[length - 1].originalTotal || '0')) {
          liquidityBn = new Decimal(orders[length - 1].amount);
        } else {
          const firstRate = new Decimal(orders[0].rate);
          const firstTotal = new Decimal(orders[0].originalTotal || '0');
          const delta = liquidityBn.minus(firstTotal);
          liquidityBn = firstTotal.div(firstRate).plus(delta.div(rate));
        }
      }
    } else {
      rate = ONE.div(rate).toString();
      totalBn = totalBn.times(rate);
    }
    orders.push({
      rate,
      total: totalBn.toString(),
      amount: liquidityBn.toString(),
      originalTotal: liquidity,
    });
  });

  const sortedOrders = orders.sort(
    (a, b) => +new Decimal(a.rate).sub(b.rate).toNumber(),
  );

  return sortedOrders;
};

const getStep = (
  stepBuy: Decimal,
  stepSell: Decimal,
  minBuy: Decimal,
  maxBuy: Decimal,
  steps: number,
  minSell: Decimal,
  maxSell: Decimal,
): Decimal => {
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
      return minBuy.div(steps + 2);
    }
    if (minSell.gt(0) && minSell.eq(maxSell)) {
      return minSell.div(steps + 2);
    }
    return ONE.div(10000);
  }
};

const getMiddleRate = (maxBuy: Decimal, maxSell: Decimal): Decimal => {
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
  return new Decimal(0);
};

const getOrderBook = async (
  base: string,
  quote: string,
  steps: number,
): Promise<OrderBook> => {
  const buyHasLiq = await carbonSDK.hasLiquidityByPair(base, quote);
  const sellHasLiq = await carbonSDK.hasLiquidityByPair(quote, base);

  const minBuy = new Decimal(
    buyHasLiq ? await carbonSDK.getMinRateByPair(base, quote) : 0,
  );
  const maxBuy = new Decimal(
    buyHasLiq ? await carbonSDK.getMaxRateByPair(base, quote) : 0,
  );
  const minSell = new Decimal(
    sellHasLiq ? await carbonSDK.getMinRateByPair(quote, base) : 0,
  );
  const maxSell = new Decimal(
    sellHasLiq ? await carbonSDK.getMaxRateByPair(quote, base) : 0,
  );

  const minSellNormalized = ONE.div(maxSell);
  const maxSellNormalized = ONE.div(minSell);

  const deltaBuy = maxBuy.minus(minBuy);
  const deltaSell = maxSellNormalized.minus(minSellNormalized);

  const stepBuy = deltaBuy.div(steps);
  const stepSell = deltaSell.div(steps);

  const step = getStep(
    stepBuy,
    stepSell,
    minBuy,
    maxBuy,
    steps,
    minSell,
    maxSell,
  );

  const middleRate = getMiddleRate(maxBuy, maxSell);

  const hasOverlappingRates = maxBuy.gt(minSellNormalized);
  const buyStartRate = hasOverlappingRates ? middleRate : maxBuy;
  const sellStartRate = hasOverlappingRates ? middleRate : minSellNormalized;

  const buy = buyHasLiq
    ? await buildOrderBook(
        true,
        base,
        quote,
        buyStartRate,
        step,
        minBuy,
        maxBuy,
        steps,
      )
    : [];

  const sell = sellHasLiq
    ? await buildOrderBook(
        false,
        quote,
        base,
        sellStartRate,
        step,
        minSell,
        maxSell,
        steps,
      )
    : [];

  return {
    buy,
    sell,
    middleRate: middleRate.toString(),
    step: step.toString(),
  };
};

const sdkExposed = {
  init,
  isInitialized: () => isInitialized,
  getAllPairs: () => api.reader.pairs(),
  setOnChangeHandlers: (
    onPairDataChanged: (affectedPairs: TokenPair[]) => void,
    onPairAddedToCache: (affectedPairs: TokenPair) => void,
    onCacheCleared: () => void,
  ) => {
    sdkCache.on('onPairDataChanged', onPairDataChanged);
    sdkCache.on('onPairAddedToCache', onPairAddedToCache);
    sdkCache.on('onCacheCleared', onCacheCleared);
  },
  setOffChangeHandlers: (
    onPairDataChanged: (affectedPairs: TokenPair[]) => void,
    onPairAddedToCache: (affectedPairs: TokenPair) => void,
    onCacheCleared: () => void,
  ) => {
    sdkCache.off('onPairDataChanged', onPairDataChanged);
    sdkCache.off('onPairAddedToCache', onPairAddedToCache);
    sdkCache.off('onCacheCleared', onCacheCleared);
  },
  hasLiquidityByPair: (baseToken: string, quoteToken: string) =>
    carbonSDK.hasLiquidityByPair(baseToken, quoteToken),
  getUserStrategies: (address: string) => carbonSDK.getUserStrategies(address),
  getAllStrategiesByPairs: () => carbonSDK.getStrategiesByPairs(),
  getStrategiesByPair: (token0: string, token1: string) =>
    carbonSDK.getStrategiesByPair(token0, token1),
  getStrategy: (id: string) => carbonSDK.getStrategyById(id),
  createBuySellStrategy: (
    baseToken: string,
    quoteToken: string,
    buyPriceLow: string,
    buyPriceMarginal: string,
    buyPriceHigh: string,
    buyBudget: string,
    sellPriceLow: string,
    sellPriceMarginal: string,
    sellPriceHigh: string,
    sellBudget: string,
    overrides?: PayableOverrides | undefined,
  ) =>
    carbonSDK.createBuySellStrategy(
      baseToken,
      quoteToken,
      buyPriceLow,
      buyPriceMarginal,
      buyPriceHigh,
      buyBudget,
      sellPriceLow,
      sellPriceMarginal,
      sellPriceHigh,
      sellBudget,
      overrides,
    ),
  batchCreateBuySellStrategies: (
    ...args: Parameters<(typeof carbonSDK)['batchCreateBuySellStrategies']>
  ) => carbonSDK.batchCreateBuySellStrategies(...args),
  updateStrategy: (
    strategyId: string,
    encoded: EncodedStrategyBNStr,
    data: StrategyUpdate,
    buyMarginalPrice?: string | undefined,
    sellMarginalPrice?: string | undefined,
    overrides?: PayableOverrides | undefined,
  ) =>
    carbonSDK.updateStrategy(
      strategyId,
      encoded,
      data,
      buyMarginalPrice,
      sellMarginalPrice,
      overrides,
    ),
  deleteStrategy: (strategyId: string) => carbonSDK.deleteStrategy(strategyId),
  getTradeData: (
    sourceToken: string,
    targetToken: string,
    amount: string,
    isTradeBySource: boolean,
  ) =>
    carbonSDK.getTradeData(sourceToken, targetToken, amount, isTradeBySource),
  getTradeDataFromActions: (
    sourceToken: string,
    targetToken: string,
    isTradeBySource: boolean,
    actionsWei: MatchActionBNStr[],
  ) =>
    carbonSDK.getTradeDataFromActions(
      sourceToken,
      targetToken,
      isTradeBySource,
      actionsWei,
    ),
  getLiquidityByPair: (baseToken: string, quoteToken: string) =>
    carbonSDK.getLiquidityByPair(baseToken, quoteToken),
  composeTradeBySourceTransaction: (
    sourceToken: string,
    targetToken: string,
    actions: TradeActionBNStr[],
    deadline: string,
    minReturn: string,
    overrides?: PayableOverrides | undefined,
  ) =>
    carbonSDK.composeTradeBySourceTransaction(
      sourceToken,
      targetToken,
      actions,
      deadline,
      minReturn,
      overrides,
    ),
  composeTradeByTargetTransaction: (
    sourceToken: string,
    targetToken: string,
    actions: TradeActionBNStr[],
    deadline: string,
    maxInput: string,
    overrides?: PayableOverrides | undefined,
  ) =>
    carbonSDK.composeTradeByTargetTransaction(
      sourceToken,
      targetToken,
      actions,
      deadline,
      maxInput,
      overrides,
    ),
  getOrderBook,
  getCacheDump: () => sdkCache.serialize(),
  getMaxSourceAmountByPair: (source: string, target: string) =>
    carbonSDK.getMaxSourceAmountByPair(source, target),
};

export type CarbonSDKWebWorker = typeof sdkExposed;

Comlink.expose(sdkExposed);

export {};
