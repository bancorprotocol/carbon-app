import { useMutation, useQuery } from '@tanstack/react-query';
import { getAddress, parseUnits } from 'ethers';
import { useWagmi } from 'libs/wagmi';
import { Token } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { SafeDecimal } from 'libs/safedecimal';
import { useTokens } from 'hooks/useTokens';
import { EncodedStrategyBNStr, StrategyUpdate } from '@bancor/carbon-sdk';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { carbonSDK } from 'libs/sdk';
import { getLowestBits } from 'utils/helpers';
import { useGetAddressFromEns } from 'libs/queries/chain/ens';
import {
  AnyStrategy,
  EditOrders,
  FormStaticOrder,
  StaticOrder,
  Strategy,
} from 'components/strategies/common/types';
import {
  getStrategyStatus,
  isGradientStrategy,
  isGradientStrategyId,
  isZero,
} from 'components/strategies/common/utils';
import { StaticOrderAPI, AnyStrategyAPI } from 'libs/queries/extApi/strategy';
import { carbonApi } from 'services/carbonApi';
import { useMemo } from 'react';
import config from 'config';

const buildStrategyFromAPI = (
  s: AnyStrategyAPI,
  getTokenById: (id: string) => Token | undefined,
): AnyStrategy | undefined => {
  const base = getTokenById(s.base);
  const quote = getTokenById(s.quote);
  if (!base || !quote) return;
  // Gradient
  if (s.type === 'gradient') {
    const buy = s.buy;
    const sell = s.sell;

    return {
      type: 'gradient',
      id: s.id,
      idDisplay: getLowestBits(s.id),
      base,
      quote,
      buy,
      sell,
      owner: s.owner,
      status: getStrategyStatus({ buy, sell }),
      encoded: {
        id: s.id,
        token0: s.base,
        token1: s.quote,
        order0: {
          ...s.encoded.order0,
          gradientType: Number(s.encoded.order0.gradientType),
        },
        order1: {
          ...s.encoded.order1,
          gradientType: Number(s.encoded.order1.gradientType),
        },
      },
    };
  } else {
    const toOrder = (order: StaticOrderAPI): StaticOrder => ({
      budget: order.budget,
      min: order.min,
      max: order.max,
      marginalPrice: order.marginal,
    });
    const buy = toOrder(s.buy);
    const sell = toOrder(s.sell);

    return {
      type: 'regular',
      id: s.id,
      idDisplay: getLowestBits(s.id),
      base,
      quote,
      buy,
      sell,
      owner: s.owner,
      status: getStrategyStatus({ buy, sell }),
      encoded: {
        id: s.id,
        token0: s.base,
        token1: s.quote,
        order0: s.encoded.order0,
        order1: s.encoded.order1,
      },
    };
  }
};

// READ

const buildAPIStrategiesHelper = (
  strategies: AnyStrategyAPI[],
  getTokenById: (id: string) => Token | undefined,
) => {
  return strategies
    .map((strategy) => buildStrategyFromAPI(strategy, getTokenById))
    .filter((strategy): strategy is Strategy => !!strategy);
};

/** We need to add options to disable because we want to use different hooks for explorer  */
export const useGetAllStrategies = (options: { enabled: boolean }) => {
  const { isPending, getTokenById } = useTokens();

  return useQuery<AnyStrategy[]>({
    queryKey: QueryKey.strategyAll(),
    queryFn: async () => {
      const response = await carbonApi.getStrategies({ pageSize: 0 });
      return buildAPIStrategiesHelper(response.strategies, getTokenById);
    },
    enabled: options?.enabled && !isPending,
    retry: false,
  });
};

export const useGetStrategyList = (ids: string[]) => {
  const query = useGetAllStrategies({ enabled: true });
  return useMemo(() => {
    return {
      ...query,
      data: query.data?.filter((strategy) => ids.includes(strategy.id)),
    };
  }, [query, ids]);
};

export const useGetUserStrategies = ({ user }: { user?: string }) => {
  const query = useGetAllStrategies({ enabled: true });
  const { data: ensAddress } = useGetAddressFromEns(user || '');
  const address: string = ensAddress || user || '';
  return useMemo(() => {
    if (!address) return { ...query, data: [] };
    const owner = getAddress(address);
    return {
      ...query,
      data: query.data?.filter((s) => s.owner === owner),
    };
  }, [query, address]);
};

export const useGetStrategy = (id: string) => {
  const query = useGetAllStrategies({ enabled: true });
  return useMemo(() => {
    if (!id) {
      return { ...query, data: undefined };
    }
    return {
      ...query,
      data: query.data?.find((strategy) => strategy.id === id),
    };
  }, [query, id]);
};

interface PropsPair {
  base?: string;
  quote?: string;
}

/** Inverse a base/quote strategy to quote/base */
const reverseStrategy = (strategy: AnyStrategy): AnyStrategy => {
  const invert = (value: string) => {
    if (isZero(value)) return '0';
    return new SafeDecimal(1).div(value).toString();
  };
  if (isGradientStrategy(strategy)) {
    return {
      ...strategy,
      base: strategy.quote,
      quote: strategy.base,
      buy: {
        ...strategy.sell,
        startPrice: invert(strategy.sell.startPrice),
        endPrice: invert(strategy.sell.endPrice),
        marginalPrice: invert(strategy.sell.marginalPrice),
      },
      sell: {
        ...strategy.buy,
        startPrice: invert(strategy.buy.startPrice),
        endPrice: invert(strategy.buy.endPrice),
        marginalPrice: invert(strategy.buy.marginalPrice),
      },
    };
  } else {
    return {
      ...strategy,
      base: strategy.quote,
      quote: strategy.base,
      buy: {
        min: invert(strategy.sell.max),
        max: invert(strategy.sell.min),
        marginalPrice: invert(strategy.sell.marginalPrice),
        budget: strategy.sell.budget,
      },
      sell: {
        min: invert(strategy.buy.max),
        max: invert(strategy.buy.min),
        marginalPrice: invert(strategy.buy.marginalPrice),
        budget: strategy.buy.budget,
      },
    };
  }
};
const normalizeStrategy = (
  base: string,
  quote: string,
  strategy: AnyStrategy,
) => {
  if (base === strategy.quote.address && quote === strategy.base.address) {
    return reverseStrategy(strategy);
  } else {
    return strategy;
  }
};

export const useGetPairStrategies = (pair?: PropsPair) => {
  const query = useGetAllStrategies({ enabled: true });
  return useMemo(() => {
    if (!pair?.base || !pair?.quote) {
      return { ...query, data: [] };
    }
    const base = getAddress(pair.base);
    const quote = getAddress(pair.quote);
    const data = query.data
      ?.map((s) => normalizeStrategy(base, quote, s))
      .filter((s) => s.base.address === base && s.quote.address === quote);
    return { ...query, data };
  }, [pair, query]);
};

export const useTokenStrategies = (token?: string) => {
  const query = useGetAllStrategies({ enabled: true });
  return useMemo(() => {
    if (!token) {
      return { ...query, data: [] };
    }
    const address = getAddress(token);
    return {
      ...query,
      data: query.data?.filter((s) => {
        if (s.base.address === address) return true;
        if (s.quote.address === address) return true;
        return false;
      }),
    };
  }, [token, query]);
};

// WRITE

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
        return parseUnits(amount, token.decimals).toString();
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
    mutationFn: async (orders: EditOrders<FormStaticOrder>) => {
      if (!strategy.encoded) {
        throw new Error('No encoded found on the strategy');
      }
      if (strategy.type === 'gradient') {
        throw new Error('Strategy is gradient, use dedicated function for it');
      }
      const { buy, sell } = orders;
      const fields: Partial<StrategyUpdate> = {};

      if (buy.min !== strategy.buy.min) fields.buyPriceLow = buy.min;
      if (buy.max !== strategy.buy.max) fields.buyPriceHigh = buy.max;
      if (sell.min !== strategy.sell.min) fields.sellPriceLow = sell.min;
      if (sell.max !== strategy.sell.max) fields.sellPriceHigh = sell.max;
      if (buy.budget !== strategy.buy.budget) fields.buyBudget = buy.budget;
      if (sell.budget !== strategy.sell.budget) fields.sellBudget = sell.budget;

      const unsignedTx = await carbonSDK.updateStrategy(
        strategy.id,
        strategy.encoded,
        fields as StrategyUpdate,
        orders.buy.marginalPrice,
        orders.sell.marginalPrice,
      );
      const getRawAmount = (token: Token, previous: string, next?: string) => {
        const delta = new SafeDecimal(next ?? 0).minus(previous);
        if (delta.lte(0)) return '0';
        return parseUnits(delta.toString(), token.decimals).toString();
      };
      unsignedTx.customData = {
        spender: config.addresses.carbon.carbonController,
        assets: [
          {
            address: strategy.base.address,
            rawAmount: getRawAmount(
              strategy.base,
              strategy.sell.budget,
              fields.sellBudget,
            ),
          },
          {
            address: strategy.quote.address,
            rawAmount: getRawAmount(
              strategy.quote,
              strategy.buy.budget,
              fields.buyBudget,
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
      if (!strategy.encoded) {
        throw new Error('No encoded found on the strategy');
      }
      if (strategy.type === 'regular') {
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
      } else {
        console.log(strategy.encoded);
        const unsignedTx = await carbonSDK.updateGradientStrategy(
          strategy.id,
          strategy.encoded,
          {
            buyInitialPrice: '0',
            buyFinalPrice: '0',
            sellInitialPrice: '0',
            sellFinalPrice: '0',
          },
        );
        return sendTransaction(unsignedTx);
      }
    },
  });
};

export const useDeleteStrategyQuery = () => {
  const { sendTransaction } = useWagmi();

  return useMutation({
    mutationFn: async ({ id }: DeleteStrategyParams) => {
      const unsignedTx = isGradientStrategyId(BigInt(id))
        ? await carbonSDK.deleteGradientStrategy(id)
        : await carbonSDK.deleteStrategy(id);

      return sendTransaction(unsignedTx);
    },
  });
};
