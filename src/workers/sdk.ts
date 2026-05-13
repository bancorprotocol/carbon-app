import './runtime-config';
import * as Comlink from 'comlink';
import {
  PayableOverrides,
  TradeActionBNStr,
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
import { JsonRpcProvider, FetchRequest } from 'ethers';

Decimal.set({
  precision: 100,
  rounding: Decimal.ROUND_HALF_DOWN,
  toExpNeg: -30,
  toExpPos: 30,
});

let api: ContractsApi;
let sdkCache: ChainCache;
let carbonSDK: Toolkit;

let syncedCache: {
  cache: ChainCache;
  startDataSync: () => Promise<void>;
};

const setup = async (
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
  // Create FetchRequest to support custom headers (required for ethers v6)
  const fetchRequest = new FetchRequest(rpc.url);
  if (rpc.headers) {
    // Set all custom headers on the FetchRequest instance
    for (const [key, value] of Object.entries(rpc.headers)) {
      fetchRequest.setHeader(key, String(value));
    }
  }

  const provider = new JsonRpcProvider(fetchRequest, chainId, {
    staticNetwork: true,
  });

  api = new ContractsApi(provider, config);
  syncedCache = initSyncedCache(
    api.reader,
    sdkConfig?.cache,
    sdkConfig?.pairBatchSize,
    sdkConfig?.refreshInterval,
    sdkConfig?.blockRangeSize,
  );
  sdkCache = syncedCache.cache;
  carbonSDK = new Toolkit(
    api,
    syncedCache.cache,
    decimalsMap
      ? (address) => decimalsMap.get(address.toLowerCase())
      : undefined,
  );
};

const sdkExposed = {
  setup,
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
  getTradeData: Toolkit.getTradeDataStatic,
  getTradeDataFromActions: Toolkit.getTradeDataFromActionsStatic,
  getLiquidityByPair: Toolkit.getLiquidityByPairStatic,
  getMaxSourceAmountByPair: Toolkit.getMaxSourceAmountByPairStatic,
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
  getCacheDump: () => sdkCache.serialize(),
  // Gradient
  createGradientStrategy: (
    ...args: Parameters<(typeof carbonSDK)['createBuySellGradientStrategy']>
  ) => carbonSDK.createBuySellGradientStrategy(...args),
  updateGradientStrategy: (
    ...args: Parameters<(typeof carbonSDK)['updateGradientStrategy']>
  ) => carbonSDK.updateGradientStrategy(...args),
  deleteGradientStrategy: (
    ...args: Parameters<(typeof carbonSDK)['deleteGradientStrategy']>
  ) => carbonSDK.deleteGradientStrategy(...args),
  getGradientStrategyById: (
    ...args: Parameters<(typeof carbonSDK)['getGradientStrategyById']>
  ) => carbonSDK.getGradientStrategyById(...args),
  getGradientStrategiesByPair: (
    ...args: Parameters<(typeof carbonSDK)['getGradientStrategiesByPair']>
  ) => carbonSDK.getGradientStrategiesByPair(...args),
  getGradientStrategyByUsre: (
    ...args: Parameters<(typeof carbonSDK)['getUserGradientStrategies']>
  ) => carbonSDK.getUserGradientStrategies(...args),
};

export type CarbonSDKWebWorker = typeof sdkExposed;

Comlink.expose(sdkExposed);

export {};
