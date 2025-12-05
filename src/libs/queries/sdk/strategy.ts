import { useMutation, useQuery } from '@tanstack/react-query';
import { isAddress, getAddress, TransactionRequest } from 'ethers';
import { useWagmi } from 'libs/wagmi';
import { Token } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { SafeDecimal } from 'libs/safedecimal';
import config from 'config';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useTokens } from 'hooks/useTokens';
import {
  EncodedStrategyBNStr,
  StrategyUpdate,
  Strategy as SDKStrategy,
  PopulatedTransaction,
} from '@bancor/carbon-sdk';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { carbonSDK } from 'libs/sdk';
import { getLowestBits } from 'utils/helpers';
import { useGetAddressFromEns } from 'libs/queries/chain/ens';
import { usePairs } from 'hooks/usePairs';
import {
  AnyStrategy,
  EditOrders,
  GradientOrder,
  StaticOrder,
  Strategy,
} from 'components/strategies/common/types';
import {
  isGradientStrategy,
  isInPast,
  isPaused,
} from 'components/strategies/common/utils';
import { SDKGradientStrategy } from './gradient-mock';
import { useCarbonInit } from 'libs/sdk/context';
import { isZero } from 'components/strategies/common/utils';
import { useMemo } from 'react';

type AnySDKStrategy = SDKStrategy | SDKGradientStrategy;

// READ
const getStatus = (offCurve: boolean, noBudget: boolean) => {
  if (offCurve && noBudget) return 'inactive';
  if (offCurve) return 'paused';
  if (noBudget) return 'noBudget';
  return 'active';
};

// TODO: build strategy outside the useQuery to parallelize token query & strategy query
const buildStrategiesHelper = async (
  strategies: AnySDKStrategy[],
  getTokenById: (id: string) => Token | undefined,
) => {
  const result = strategies.map((s) => {
    const base = getTokenById(s.baseToken);
    const quote = getTokenById(s.quoteToken);
    if (!base || !quote) return;
    if ('sellPriceLow' in s) {
      const sellLow = new SafeDecimal(s.sellPriceLow);
      const sellHigh = new SafeDecimal(s.sellPriceHigh);
      const sellBudget = new SafeDecimal(s.sellBudget);

      const buyLow = new SafeDecimal(s.buyPriceLow);
      const buyHight = new SafeDecimal(s.buyPriceHigh);
      const buyBudget = new SafeDecimal(s.buyBudget);

      const offCurve =
        sellLow.isZero() &&
        sellHigh.isZero() &&
        buyLow.isZero() &&
        buyHight.isZero();

      const noBudget = sellBudget.isZero() && buyBudget.isZero();

      const status = getStatus(offCurve, noBudget);

      // ATTENTION *****************************
      // This is the buy order | UI order 0 and CONTRACT order 1
      // ATTENTION *****************************
      const buy: StaticOrder = {
        budget: s.buyBudget,
        min: s.buyPriceLow,
        max: s.buyPriceHigh,
        marginalPrice: s.buyPriceMarginal,
      };

      // ATTENTION *****************************
      // This is the sell order | UI order 1 and CONTRACT order 0
      // ATTENTION *****************************
      const sell: StaticOrder = {
        budget: s.sellBudget,
        min: s.sellPriceLow,
        max: s.sellPriceHigh,
        marginalPrice: s.sellPriceMarginal,
      };

      return {
        type: 'static',
        id: s.id,
        idDisplay: getLowestBits(s.id),
        base,
        quote,
        buy,
        sell,
        status,
        encoded: s.encoded,
      } as Strategy;
    } else {
      const buy: GradientOrder = {
        budget: s.buyBudget,
        _sP_: s.buy_SP_,
        _eP_: s.buy_EP_,
        _sD_: s.buy_SD_,
        _eD_: s.buy_ED_,
        marginalPrice: s.buyPriceMarginal,
      };

      const sell: GradientOrder = {
        budget: s.sellBudget,
        _sP_: s.sell_SP_,
        _eP_: s.sell_EP_,
        _sD_: s.sell_SD_,
        _eD_: s.sell_ED_,
        marginalPrice: s.sellPriceMarginal,
      };

      const strategy: Strategy<GradientOrder> = {
        type: 'gradient',
        id: s.id,
        idDisplay: getLowestBits(s.id),
        base,
        quote,
        buy,
        sell,
        status: 'active',
        encoded: s.encoded,
      };

      if (isPaused(strategy) || isInPast(strategy)) {
        strategy.status = 'paused';
      }
      if (!Number(strategy.buy.budget) && !Number(strategy.sell.budget)) {
        strategy.status =
          strategy.status === 'paused' ? 'inactive' : 'noBudget';
      }
      return strategy;
    }
  });
  return result.filter((s) => !!s);
};

interface Props {
  user?: string;
}

export const useGetUserStrategies = ({ user }: Props) => {
  const { isInitialized } = useCarbonInit();
  const { isPending, getTokenById } = useTokens();

  const ensAddress = useGetAddressFromEns(user || '');
  const address: string = (ensAddress?.data || user || '').toLowerCase();

  const isValidAddress = isAddress(address);
  const isZeroAddress = address === config.addresses.tokens.ZERO;

  return useQuery({
    queryKey: QueryKey.strategiesByUser(address),
    queryFn: async () => {
      if (!address || !isValidAddress || isZeroAddress) return [];
      const strategies = await carbonSDK.getUserStrategies(address);
      return buildStrategiesHelper(strategies, getTokenById);
    },
    enabled: !!user && !isPending && ensAddress.isFetched && isInitialized,
    staleTime: ONE_DAY_IN_MS,
    retry: false,
  });
};

export const useGetStrategyList = (ids: string[]) => {
  const { isInitialized } = useCarbonInit();
  const { isPending, getTokenById } = useTokens();

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategyList(ids),
    queryFn: async () => {
      const getStrategies = ids.map((id) => carbonSDK.getStrategy(id));
      const responses = await Promise.allSettled(getStrategies);
      const strategies = [];
      for (const res of responses) {
        if (res.status === 'fulfilled') {
          strategies.push(res.value);
        } else {
          console.error(res.reason);
        }
      }
      return buildStrategiesHelper(strategies, getTokenById);
    },
    enabled: !isPending && isInitialized,
    staleTime: ONE_DAY_IN_MS,
    retry: false,
  });
};

/** We need to add options to disable because we want to use different hooks for explorer  */
export const useGetAllStrategies = (options: { enabled: boolean }) => {
  const { isInitialized } = useCarbonInit();
  const { isPending, getTokenById } = useTokens();

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategyAll(),
    queryFn: async () => {
      const all = await carbonSDK.getAllStrategiesByPairs();
      const strategies = all.map((item) => item.strategies).flat();
      return buildStrategiesHelper(strategies, getTokenById);
    },
    enabled: options?.enabled && !isPending && isInitialized,
    staleTime: ONE_DAY_IN_MS,
    retry: false,
  });
};

export const useGetStrategy = (id: string) => {
  const { isInitialized } = useCarbonInit();
  const { isPending, getTokenById } = useTokens();

  return useQuery<AnyStrategy>({
    queryKey: QueryKey.strategy(id),
    queryFn: async () => {
      const strategy = await carbonSDK.getStrategy(id);

      const strategies = await buildStrategiesHelper([strategy], getTokenById);
      return strategies[0];
    },
    enabled: !isPending && isInitialized,
    staleTime: ONE_DAY_IN_MS,
    retry: false,
  });
};

interface PropsPair {
  base?: string;
  quote?: string;
}

/** Inverse a base/quote strategy to quote/base */
const reverseStrategy = (strategy: SDKStrategy): SDKStrategy => {
  const invert = (value: string) => {
    if (isZero(value)) return '0';
    return new SafeDecimal(1).div(value).toString();
  };
  return {
    id: strategy.id,
    baseToken: strategy.quoteToken,
    quoteToken: strategy.baseToken,
    buyPriceLow: invert(strategy.sellPriceHigh),
    buyPriceMarginal: invert(strategy.sellPriceMarginal),
    buyPriceHigh: invert(strategy.sellPriceLow),
    buyBudget: strategy.sellBudget,
    sellPriceLow: invert(strategy.buyPriceHigh),
    sellPriceMarginal: invert(strategy.buyPriceMarginal),
    sellPriceHigh: invert(strategy.buyPriceLow),
    sellBudget: strategy.buyBudget,
    encoded: strategy.encoded,
  };
};
const normalizeStrategy = (
  base: string,
  quote: string,
  strategy: SDKStrategy,
) => {
  if (base === strategy.quoteToken && quote === strategy.baseToken) {
    return reverseStrategy(strategy);
  } else {
    return strategy;
  }
};

export const useGetPairStrategies = (pair?: PropsPair) => {
  const { isInitialized } = useCarbonInit();
  const { isPending, getTokenById } = useTokens();
  const pairs = usePairs();

  const enabled = useMemo(() => {
    if (!pair?.base || !pair.quote) return false;
    if (pairs.isPending || isPending) return false;
    return isInitialized;
  }, [isInitialized, isPending, pair?.base, pair?.quote, pairs.isPending]);

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategiesByPair(pair?.base, pair?.quote),
    queryFn: async () => {
      const base = getAddress(pair!.base!);
      const quote = getAddress(pair!.quote!);
      const strategies = await carbonSDK.getStrategiesByPair(base!, quote!);
      return buildStrategiesHelper(
        strategies.map((s) => normalizeStrategy(base!, quote!, s)),
        getTokenById,
      );
    },
    enabled: enabled,
    staleTime: ONE_DAY_IN_MS,
    retry: false,
  });
};

export const useTokenStrategies = (token?: string) => {
  const { isInitialized } = useCarbonInit();
  const { isPending, getTokenById } = useTokens();
  const { map: pairMap } = usePairs();

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategiesByToken(token),
    queryFn: async () => {
      const allQuotes = new Set<string>();
      const base = getAddress(token!);
      for (const { baseToken, quoteToken } of pairMap.values()) {
        if (baseToken.address === base) allQuotes.add(quoteToken.address);
        if (quoteToken.address === base) allQuotes.add(baseToken.address);
      }
      const getStrategies: Promise<SDKStrategy[]>[] = [];
      for (const quote of allQuotes) {
        getStrategies.push(carbonSDK.getStrategiesByPair(base, quote));
      }

      const allResponses = await Promise.allSettled(getStrategies);
      for (const res of allResponses) {
        if (res.status === 'rejected') console.error(res.reason);
      }
      const allStrategies = allResponses
        .filter((v) => v.status === 'fulfilled')
        .map((v) => (v as PromiseFulfilledResult<SDKStrategy[]>).value);
      const result = await buildStrategiesHelper(
        allStrategies.flat(),
        getTokenById,
      );
      return result;
    },
    enabled: !isPending && !!token && !!pairMap.size && isInitialized,
    staleTime: ONE_DAY_IN_MS,
    retry: false,
  });
};

// WRITE

// TODO: remove when sdk is using ethers v6
export const toTransactionRequest = (tx: PopulatedTransaction) => {
  const next: TransactionRequest = structuredClone(tx) as any;
  if (tx.gasLimit) next.gasLimit = BigInt(tx.gasLimit._hex);
  if (tx.gasPrice) next.gasPrice = BigInt(tx.gasPrice._hex);
  if (tx.value) next.value = BigInt(tx.value._hex);
  if (tx.maxFeePerGas) next.maxFeePerGas = BigInt(tx.maxFeePerGas._hex);
  if (tx.maxPriorityFeePerGas)
    next.maxFeePerGas = BigInt(tx.maxPriorityFeePerGas._hex);
  return next;
};

const getFieldsToUpdate = (orders: EditOrders, strategy: AnyStrategy) => {
  const { buy, sell } = orders;
  const fields: Partial<StrategyUpdate> = {};
  if (isGradientStrategy(strategy)) {
    // @todo(gradient) implement edit fields for gradient
  } else {
    if (buy.min !== strategy.buy.min) fields.buyPriceLow = buy.min;
    if (buy.max !== strategy.buy.max) fields.buyPriceHigh = buy.max;
    if (sell.min !== strategy.sell.min) fields.sellPriceLow = sell.min;
    if (sell.max !== strategy.sell.max) fields.sellPriceHigh = sell.max;
  }
  if (buy.budget !== strategy.buy.budget) fields.buyBudget = buy.budget;
  if (sell.budget !== strategy.sell.budget) fields.sellBudget = sell.budget;
  return fields as StrategyUpdate;
};

export interface CreateStrategyParams {
  base: string;
  quote: string;
  buy: StaticOrder;
  sell: StaticOrder;
  encoded?: EncodedStrategyBNStr;
}

export interface UpdateStrategyParams {
  id: string;
  encoded: EncodedStrategyBNStr;
  fieldsToUpdate: StrategyUpdate;
  buyMarginalPrice?: MarginalPriceOptions | string;
  sellMarginalPrice?: MarginalPriceOptions | string;
}

export interface DeleteStrategyParams {
  id: string;
}

export const useCreateStrategyQuery = () => {
  const { getTokenById } = useTokens();
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async ({ base, quote, buy, sell }: CreateStrategyParams) => {
      const unsignedTx = await carbonSDK.createBuySellStrategy(
        base,
        quote,
        buy.min,
        buy.marginalPrice || buy.max,
        buy.max,
        buy.budget || '0',
        sell.min,
        sell.marginalPrice || sell.min,
        sell.max,
        sell.budget || '0',
      );
      const getRawAmount = (address: string, amount: string) => {
        const token = getTokenById(address)!;
        return new SafeDecimal(amount).mul(10 ** token.decimals).toString();
      };
      unsignedTx.customData = {
        assets: [
          {
            address: base,
            rawAmount: getRawAmount(base, sell.budget),
          },
          {
            address: quote,
            rawAmount: getRawAmount(quote, buy.budget),
          },
        ],
      };

      return sendTransaction(toTransactionRequest(unsignedTx));
    },
  });
};

export const useUpdateStrategyQuery = (strategy: AnyStrategy) => {
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async (orders: EditOrders) => {
      const updates = getFieldsToUpdate(orders, strategy);
      const unsignedTx = await carbonSDK.updateStrategy(
        strategy.id,
        strategy.encoded,
        updates,
        orders.buy.marginalPrice,
        orders.sell.marginalPrice,
      );
      const getRawAmount = (token: Token, previous: string, next?: string) => {
        const delta = new SafeDecimal(next ?? 0).minus(previous);
        if (delta.lte(0)) return '0';
        return new SafeDecimal(delta).mul(10 ** token.decimals).toString();
      };
      unsignedTx.customData = {
        assets: [
          {
            address: strategy.base.address,
            rawAmount: getRawAmount(
              strategy.base,
              strategy.sell.budget,
              updates.sellBudget,
            ),
          },
          {
            address: strategy.quote.address,
            rawAmount: getRawAmount(
              strategy.quote,
              strategy.buy.budget,
              updates.buyBudget,
            ),
          },
        ],
      };

      return sendTransaction(toTransactionRequest(unsignedTx));
    },
  });
};

export const usePauseStrategyQuery = () => {
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async (strategy: AnyStrategy) => {
      const unsignedTx = await carbonSDK.updateStrategy(
        strategy.id,
        strategy.encoded,
        {
          buyPriceLow: '0',
          buyPriceHigh: '0',
          sellPriceLow: '0',
          sellPriceHigh: '0',
        },
      );

      return sendTransaction(toTransactionRequest(unsignedTx));
    },
  });
};

export const useDeleteStrategyQuery = () => {
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async ({ id }: DeleteStrategyParams) => {
      const unsignedTx = await carbonSDK.deleteStrategy(id);

      return sendTransaction(toTransactionRequest(unsignedTx));
    },
  });
};
