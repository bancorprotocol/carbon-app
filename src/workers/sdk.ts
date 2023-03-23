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
  let i = 0;
  let minEqMax = false;
  const rates: string[] = [];

  console.log('jan buildOrderBook reached');

  while (rates.length < steps && !minEqMax) {
    minEqMax = min.eq(max);
    let rate = startRate[buy ? 'minus' : 'plus'](step.times(i)).toString();
    rate = buy ? rate : ONE.div(rate).toString();
    rate = minEqMax ? max.toString() : rate;
    i++;
    rates.push(rate);

    if (minEqMax) {
      Array.from({ length: steps - 1 }).map((_, i) =>
        rates.push(
          new BigNumber(rate)
            [buy ? 'minus' : 'plus'](step.times(i + 1))
            .toString()
        )
      );
    }
  }

  console.log('jan rates', rates);

  const results = await carbonSDK.getRateLiquidityDepthsByPair(
    baseToken,
    quoteToken,
    rates
  );

  console.log('jan results', results);

  results.forEach((liquidity, i) => {
    const length = orders.length;
    let rate = rates[i];
    let liquidityBn = new BigNumber(liquidity);

    if (liquidityBn.eq(0)) {
      console.log('liquidity is 0');
      return;
    }
    console.log('jan ------------------');
    console.log('jan liquidityBn unchanged', liquidityBn.toString());
    console.log('jan rate unchanged', rate);
    if (buy) {
      if (length === 0) {
        liquidityBn = liquidityBn.div(rate);
        console.log('jan first liquidityBn', liquidityBn.toString());
      } else {
        if (liquidityBn.eq(orders[length - 1].total)) {
          console.log('jan done NOTHING');
          liquidityBn = new BigNumber(orders[length - 1].amount);
          console.log('jan liquidityBn', liquidityBn.toString());
        } else {
          const firstRate = new BigNumber(orders[0].rate);
          console.log('jan firstRate', firstRate.toString());
          const firstTotal = new BigNumber(orders[0].total);
          console.log('jan firstTotal', firstTotal.toString());
          const delta = liquidityBn.minus(firstTotal);
          console.log('jan delta', delta.toString());
          liquidityBn = firstTotal.div(firstRate).plus(delta.div(rate));
          console.log('jan liquidityBn', liquidityBn.toString());
        }
      }
    } else {
      rate = ONE.div(rate).toString();
    }
    orders.push({
      rate,
      total: liquidity,
      amount: liquidityBn.toString(),
    });
  });

  console.log('jan orders', orders);

  return orders;
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
  console.log('jan minBuy', minBuy.toString());
  console.log('jan maxBuy', maxBuy.toString());
  console.log('jan minSell', minSell.toString());
  console.log('jan maxSell', maxSell.toString());

  const stepBuy = maxBuy.minus(minBuy).div(steps);
  const stepSell = ONE.div(minSell).minus(ONE.div(maxSell)).div(steps);
  console.log('jan stepBuy', stepBuy.toString());
  console.log('jan stepSell', stepSell.toString());

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
        return minBuy.div(steps);
      }
      if (minSell.gt(0) && minSell.eq(maxSell)) {
        return minSell.div(steps);
      }
      return ONE.div(10000);
    }
  };
  const step = getStep();
  console.log('jan step', step.toString());

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
  console.log('jan middleRate', middleRate.toString());

  const buyStartRate = middleRate.minus(
    step.times(middleRate.minus(maxBuy).div(step).toFixed(0)).plus(step)
  );
  console.log('jan buyStartRate', buyStartRate.toString());

  const sellStartRate = middleRate.plus(
    step
      .times(ONE.div(maxSell).minus(middleRate).div(step).toFixed(0))
      .plus(step)
  );
  console.log('jan sellStartRate', sellStartRate.toString());

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

  console.log('jan buy', buy);

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

  console.log('jan sell', sell);

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
};

export type CarbonSDKWebWorker = typeof obj;

Comlink.expose(obj);

export {};
