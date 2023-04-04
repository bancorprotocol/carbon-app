import * as Comlink from 'comlink';
import {
  Sdk,
  Config,
  PayableOverrides,
  TradeActionStruct,
  TokenPair,
  SerializableMatchAction,
  StrategyUpdate,
} from '@bancor/carbon-sdk';
import { BigNumberish } from 'ethers';
import BigNumber from 'bignumber.js';
import { OrderRow } from 'libs/queries';
import { OrderBook } from 'libs/queries/sdk/orderBook';

const ONE = new BigNumber(1);

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
  steps: number
): Promise<OrderRow[]> => {
  const orders: OrderRow[] = [];
  const rates: string[] = [];

  for (let i = 0; i <= steps + 1; i++) {
    const incrementBy = step.times(i);
    let rate = startRate[buy ? 'minus' : 'plus'](incrementBy);
    rate = buy ? rate : ONE.div(rate);
    rates.push(rate.toString());
  }

  let results = await carbonSDK.getRateLiquidityDepthsByPair(
    baseToken,
    quoteToken,
    rates
  );

  results.forEach((liquidity, i) => {
    const length = orders.length;
    let rate = rates[i];
    let liquidityBn = new BigNumber(liquidity);
    let totalBn = liquidityBn;

    if (liquidityBn.eq(0)) {
      console.warn('order book getRateLiquidityDepthsByPair returns 0');
      return;
    }
    if (buy) {
      if (length === 0) {
        liquidityBn = liquidityBn.div(rate);
      } else {
        if (liquidityBn.eq(orders[length - 1].originalTotal || '0')) {
          liquidityBn = new BigNumber(orders[length - 1].amount);
        } else {
          const firstRate = new BigNumber(orders[0].rate);
          const firstTotal = new BigNumber(orders[0].originalTotal || '0');
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

  return orders;
};

const getStep = (
  stepBuy: BigNumber,
  stepSell: BigNumber,
  minBuy: BigNumber,
  maxBuy: BigNumber,
  steps: number,
  minSell: BigNumber,
  maxSell: BigNumber
): BigNumber => {
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

const getMiddleRate = (maxBuy: BigNumber, maxSell: BigNumber): BigNumber => {
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

const getOrderBook = async (
  base: string,
  quote: string,
  steps: number
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
    maxSell
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
        steps
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
        steps
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
  getAllPairs: () => carbonSDK.getAllPairs(),
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
  hasLiquidityByPair: (baseToken: string, quoteToken: string) =>
    carbonSDK.hasLiquidityByPair(baseToken, quoteToken),
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
    encoded: string,
    data: StrategyUpdate,
    buyMarginalPrice?: string | undefined,
    sellMarginalPrice?: string | undefined,
    overrides?: PayableOverrides | undefined
  ) =>
    carbonSDK.updateStrategy(
      strategyId,
      encoded,
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
    actionsWei: SerializableMatchAction[]
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
  getLastTradeByPair: (source: string, target: string) =>
    carbonSDK.getLastTradeByPair(source, target),
};

export type CarbonSDKWebWorker = typeof sdkExposed;

Comlink.expose(sdkExposed);

export {};
