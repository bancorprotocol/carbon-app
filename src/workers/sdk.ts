import * as Comlink from 'comlink';
import {
  Sdk,
  Config,
  PayableOverrides,
  TradeActionStruct,
} from '@bancor/carbon-sdk';
import {
  EncodedStrategy,
  MatchAction,
  StrategyUpdate,
} from '@bancor/carbon-sdk/dist/types';
import { BigNumberish } from 'ethers';

const decimalFetcherSDKMap: { map: Map<string, number> } = {
  map: new Map(),
};
const decimalFetcher = (a: string) =>
  decimalFetcherSDKMap.map.get(a.toLowerCase());

let carbonSDK: Sdk;

const init = (config: Config) => {
  carbonSDK = new Sdk(config, decimalFetcher);
};

const obj = {
  init,
  startDataSync: () => carbonSDK.startDataSync(),
  //isInitialized: () => carbonSDK.isInitialized,
  getPairs: () => carbonSDK.pairs,
  onChange: (cb: () => void) => carbonSDK.onChange(cb),
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
};

export type CarbonSDKWebWorker = typeof obj;

Comlink.expose(obj);

export {};
