import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3 } from 'libs/web3';
import { Token } from 'libs/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { QueryKey } from 'libs/queries/queryKey';
import BigNumber from 'bignumber.js';
import { carbonSDK } from 'libs/sdk/carbonSdk';
import { useContract } from 'hooks/useContract';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useTokens } from 'hooks/useTokens';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { EncodedStrategy } from '@bancor/carbon-sdk/dist/types';

export enum StrategyStatus {
  Active,
  NoBudget,
  Paused,
  Inactive,
}

export interface Order {
  balance: string;
  startRate: string;
  endRate: string;
}

export interface Strategy {
  id: string;
  token0: Token;
  token1: Token;
  order0: Order;
  order1: Order;
  status: StrategyStatus;
  encoded: EncodedStrategy;
}

export const useGetUserStrategies = () => {
  const { isInitialized } = useCarbonSDK();
  const { user } = useWeb3();
  const { tokens, getTokenById, importToken } = useTokens();
  const { Token } = useContract();

  return useQuery<Strategy[]>(
    QueryKey.strategies(user),
    async () => {
      if (!user) return [];

      console.log('Fetching strategies...');
      const strategies = await carbonSDK.getUserStrategies(user);
      console.log('Fetched strategies', strategies);
      const _getTknData = async (address: string) => {
        const data = await fetchTokenData(Token, address);
        importToken(data);
        return data;
      };

      const promises = strategies.map(async (s) => {
        const token0 =
          getTokenById(s.baseToken) || (await _getTknData(s.baseToken));
        const token1 =
          getTokenById(s.quoteToken) || (await _getTknData(s.quoteToken));

        const sellLow = new BigNumber(s.sellPriceLow);
        const sellHigh = new BigNumber(s.sellPriceHigh);
        const sellBudget = new BigNumber(s.sellBudget);

        const buyLow = new BigNumber(s.buyPriceLow);
        const buyHight = new BigNumber(s.buyPriceHigh);
        const buyBudget = new BigNumber(s.buyBudget);

        const offCurve =
          sellLow.isZero() &&
          sellHigh.isZero() &&
          buyLow.isZero() &&
          buyHight.isZero();

        const noBudget = sellBudget.isZero() && buyBudget.isZero();

        const status =
          noBudget && offCurve
            ? StrategyStatus.Inactive
            : offCurve
            ? StrategyStatus.Paused
            : noBudget
            ? StrategyStatus.NoBudget
            : StrategyStatus.Active;

        // ATTENTION *****************************
        // This is the buy order | UI order 0 and CONTRACT order 1
        // ATTENTION *****************************
        const order0: Order = {
          balance: s.buyBudget,
          startRate: s.buyPriceLow,
          endRate: s.buyPriceHigh,
        };

        // ATTENTION *****************************
        // This is the sell order | UI order 1 and CONTRACT order 0
        // ATTENTION *****************************
        const order1: Order = {
          balance: s.sellBudget,
          startRate: s.sellPriceLow,
          endRate: s.sellPriceHigh,
        };

        const strategy: Strategy = {
          id: s.id.toString(),
          token0,
          token1,
          order0,
          order1,
          status,
          encoded: s.encoded,
        };

        return strategy;
      });

      return await Promise.all(promises);
    },
    {
      enabled: tokens.length > 0 && isInitialized,
      staleTime: ONE_DAY_IN_MS,
    }
  );
};

interface CreateStrategyOrder {
  budget: string;
  min: string;
  max: string;
  price: string;
}

type TokenAddressDecimals = Pick<Token, 'address' | 'decimals'>;

export interface CreateStrategyParams {
  token0: TokenAddressDecimals;
  token1: TokenAddressDecimals;
  order0: CreateStrategyOrder;
  order1: CreateStrategyOrder;
  encoded?: EncodedStrategy;
}

export interface UpdateStrategyParams {
  token0: TokenAddressDecimals;
  token1: TokenAddressDecimals;
  order0: CreateStrategyOrder;
  order1: CreateStrategyOrder;
  encoded: EncodedStrategy;
}

export interface DeleteStrategyParams {
  encoded: EncodedStrategy;
}

export const useCreateStrategyQuery = () => {
  const { signer } = useWeb3();

  return useMutation(
    async ({ token0, token1, order0, order1 }: CreateStrategyParams) => {
      const noPrice0 = Number(order0.price) === 0;
      const noPrice1 = Number(order1.price) === 0;

      const order0Low = noPrice0 ? order0.min : order0.price;
      const order0Max = noPrice0 ? order0.max : order0.price;

      const order1Low = noPrice1 ? order1.min : order1.price;
      const order1Max = noPrice1 ? order1.max : order1.price;

      const order0Budget = Number(order0.budget) === 0 ? '0' : order0.budget;
      const order1Budget = Number(order1.budget) === 0 ? '0' : order1.budget;

      const unsignedTx = await carbonSDK.createBuySellStrategy(
        token0.address,
        token1.address,
        order0Low,
        order0Max,
        order0Budget,
        order1Low,
        order1Max,
        order1Budget,
        { gasLimit: 9999999 }
      );

      return signer!.sendTransaction(unsignedTx);
    }
  );
};

export const useUpdateStrategyQuery = () => {
  const { signer } = useWeb3();

  return useMutation(
    async ({
      token0,
      token1,
      order0,
      order1,
      encoded,
    }: UpdateStrategyParams) => {
      const noPrice0 = Number(order0.price) === 0;
      const noPrice1 = Number(order1.price) === 0;

      const order0Low = noPrice0 ? order0.min : order0.price;
      const order0Max = noPrice0 ? order0.max : order0.price;

      const order1Low = noPrice1 ? order1.min : order1.price;
      const order1Max = noPrice1 ? order1.max : order1.price;

      const order0Budget = Number(order0.budget) === 0 ? '0' : order0.budget;
      const order1Budget = Number(order1.budget) === 0 ? '0' : order1.budget;

      const strategyId = encoded.id;

      const unsignedTx = await carbonSDK.updateStrategy(
        strategyId,
        encoded,
        token0.address,
        token1.address,
        {
          buyPriceLow: order0Low,
          buyPriceHigh: order0Max,
          buyBudget: order0Budget,
          sellPriceLow: order1Low,
          sellPriceHigh: order1Max,
          sellBudget: order1Budget,
        }
      );

      return signer!.sendTransaction(unsignedTx);
    }
  );
};

export const useDeleteStrategyQuery = () => {
  const { signer } = useWeb3();

  return useMutation(async ({ encoded }: DeleteStrategyParams) => {
    const strategyId = encoded.id;

    const unsignedTx = await carbonSDK.deleteStrategy(strategyId);

    return signer!.sendTransaction(unsignedTx);
  });
};
