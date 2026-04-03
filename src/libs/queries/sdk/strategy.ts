import { useMutation, useQuery } from '@tanstack/react-query';
import { isAddress, getAddress } from 'ethers';
import { useWagmi } from 'libs/wagmi';
import { Token } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { SafeDecimal } from 'libs/safedecimal';
import config from 'config';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useTokens } from 'hooks/useTokens';
import { EncodedStrategyBNStr, StrategyUpdate } from '@bancor/carbon-sdk';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { carbonSDK } from 'libs/sdk';
import { getLowestBits } from 'utils/helpers';
import { useGetAddressFromEns } from 'libs/queries/chain/ens';
import {
  AnyStrategy,
  EditOrders,
  StaticOrder,
  Strategy,
} from 'components/strategies/common/types';
import {
  getStrategyStatus,
  isGradientStrategy,
} from 'components/strategies/common/utils';
import { StrategyAPI } from 'libs/queries/extApi/strategy';
import { carbonApi } from 'services/carbonApi';

const buildStrategyFromAPI = (
  s: StrategyAPI,
  getTokenById: (id: string) => Token | undefined,
  encoded?: EncodedStrategyBNStr,
) => {
  const base = getTokenById(s.base);
  const quote = getTokenById(s.quote);
  if (!base || !quote) return;

  const buy: StaticOrder = {
    budget: s.buy.budget,
    min: s.buy.min,
    max: s.buy.max,
    marginalPrice: s.buy.marginal,
  };

  const sell: StaticOrder = {
    budget: s.sell.budget,
    min: s.sell.min,
    max: s.sell.max,
    marginalPrice: s.sell.marginal,
  };

  return {
    type: 'static',
    id: s.id,
    idDisplay: getLowestBits(s.id),
    base,
    quote,
    buy,
    sell,
    owner: s.owner,
    status: getStrategyStatus({ buy, sell }),
    encoded,
  } as Strategy;
};

// READ

const buildAPIStrategiesHelper = (
  strategies: StrategyAPI[],
  getTokenById: (id: string) => Token | undefined,
) => {
  return strategies
    .map((strategy) => buildStrategyFromAPI(strategy, getTokenById))
    .filter((strategy): strategy is Strategy => !!strategy);
};

const fetchAllStrategiesFromApi = async (
  getTokenById: (id: string) => Token | undefined,
) => {
  const response = await carbonApi.getStrategies({ pageSize: 0 });
  return buildAPIStrategiesHelper(response.strategies, getTokenById);
};

/** We need to add options to disable because we want to use different hooks for explorer  */
export const useGetAllStrategies = (options: { enabled: boolean }) => {
  const { isPending, getTokenById } = useTokens();

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategyAll(),
    queryFn: () => fetchAllStrategiesFromApi(getTokenById),
    enabled: options?.enabled && !isPending,
    retry: false,
  });
};

export const useGetStrategyList = (ids: string[]) => {
  const { data: strategies } = useGetAllStrategies({ enabled: true });
  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategyList(ids),
    queryFn: () => strategies!.filter((strategy) => ids.includes(strategy.id)),
    enabled: !strategies,
    retry: false,
  });
};

export const useGetUserStrategies = ({ user }: { user?: string }) => {
  const { data: strategies } = useGetAllStrategies({ enabled: true });
  const { data: ensAddress, isPending } = useGetAddressFromEns(user || '');
  const address: string = ensAddress || user || '';

  const isValidAddress = isAddress(address);
  const isZeroAddress = address === config.addresses.tokens.ZERO;

  return useQuery({
    queryKey: QueryKey.strategiesByUser(address),
    queryFn: async () => {
      if (!isValidAddress || isZeroAddress) return [];
      const owner = getAddress(address);
      return strategies!.filter((s) => s.owner === owner);
    },
    enabled: !!address && !!strategies && !isPending,
    retry: false,
  });
};

export const useGetStrategy = (id: string) => {
  const { isPending } = useTokens();
  const { data: strategies } = useGetAllStrategies({ enabled: true });
  return useQuery<AnyStrategy | undefined>({
    queryKey: QueryKey.strategy(id),
    queryFn: () => strategies!.find((strategy) => strategy.id === id),
    enabled: strategies && !isPending,
    retry: false,
  });
};

interface PropsPair {
  base?: string;
  quote?: string;
}

export const useGetPairStrategies = (pair?: PropsPair) => {
  const { data: strategies } = useGetAllStrategies({ enabled: true });

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategiesByPair(pair?.base, pair?.quote),
    queryFn: () => {
      const base = getAddress(pair!.base!);
      const quote = getAddress(pair!.quote!);
      return strategies!.filter((s) => {
        return s.base.address === base && s.quote.address === quote;
      });
    },
    enabled: !!strategies && !!pair?.base && !!pair.quote,
    retry: false,
  });
};

export const useTokenStrategies = (token?: string) => {
  const { data: strategies } = useGetAllStrategies({ enabled: true });

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategiesByToken(token),
    queryFn: () => {
      const address = getAddress(token!);
      return strategies!.filter((s) => {
        if (s.base.address === address) return true;
        if (s.quote.address === address) return true;
        return false;
      });
    },
    enabled: !!strategies && !!token,
    staleTime: ONE_DAY_IN_MS,
    retry: false,
  });
};

// WRITE

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
        spender: config.addresses.carbon.carbonController,
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

      return sendTransaction(unsignedTx);
    },
  });
};

export const useUpdateStrategyQuery = (strategy: AnyStrategy) => {
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async (orders: EditOrders) => {
      const updates = getFieldsToUpdate(orders, strategy);
      if (!strategy.encoded)
        throw new Error('No encoded found on the strategy');
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
        spender: config.addresses.carbon.carbonController,
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

      return sendTransaction(unsignedTx);
    },
  });
};

export const usePauseStrategyQuery = () => {
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async (strategy: AnyStrategy) => {
      if (!strategy.encoded)
        throw new Error('No encoded found on the strategy');
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

      return sendTransaction(unsignedTx);
    },
  });
};

export const useDeleteStrategyQuery = () => {
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async ({ id }: DeleteStrategyParams) => {
      const unsignedTx = await carbonSDK.deleteStrategy(id);

      return sendTransaction(unsignedTx);
    },
  });
};
