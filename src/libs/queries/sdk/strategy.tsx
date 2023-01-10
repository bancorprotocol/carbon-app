import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3 } from 'libs/web3';
import { Token, useTokens } from 'libs/tokens';
import { shrinkToken } from 'utils/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { QueryKey } from 'libs/queries/queryKey';
import BigNumber from 'bignumber.js';
import { sdk } from 'libs/sdk/carbonSdk';
import { useContract } from 'hooks/useContract';
import { useCarbonSDK } from 'libs/sdk';

export enum StrategyStatus {
  Active,
  NoBudget,
  OffCurve,
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
  name?: string;
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
      const strategies = await sdk.getUserStrategies(user);
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
            ? StrategyStatus.OffCurve
            : noBudget
            ? StrategyStatus.NoBudget
            : StrategyStatus.Active;

        // ATTENTION *****************************
        // This is the buy order | UI order 0 and CONTRACT order 1
        // ATTENTION *****************************
        const order0: Order = {
          balance: shrinkToken(s.buyBudget, token1.decimals),
          startRate: new BigNumber(s.buyPriceLow)
            .div(new BigNumber(10).pow(token0.decimals - token1.decimals))
            .toString(),
          endRate: new BigNumber(s.buyPriceHigh)
            .div(new BigNumber(10).pow(token0.decimals - token1.decimals))
            .toString(),
        };

        // ATTENTION *****************************
        // This is the sell order | UI order 1 and CONTRACT order 0
        // ATTENTION *****************************
        const order1: Order = {
          balance: shrinkToken(s.sellBudget, token0.decimals),
          startRate: new BigNumber(1)
            .div(s.sellPriceHigh)
            .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
            .toString(),
          endRate: new BigNumber(1)
            .div(s.sellPriceLow)
            .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
            .toString(),
        };

        const strategy: Strategy = {
          id: s.id.toString(),
          token0,
          token1,
          order0,
          order1,
          status,
        };

        return strategy;
      });

      return await Promise.all(promises);
    },
    { enabled: tokens.length > 0 && isInitialized }
  );
};

interface CreateStrategyOrder {
  budget?: string;
  min?: string;
  max?: string;
  price?: string;
}

type TokenAddressDecimals = Pick<Token, 'address' | 'decimals'>;

export interface CreateStrategyParams {
  token0: TokenAddressDecimals;
  token1: TokenAddressDecimals;
  order0: CreateStrategyOrder;
  order1: CreateStrategyOrder;
}
export const useCreateStrategy = () => {
  const { signer } = useWeb3();

  return useMutation(
    async ({ token0, token1, order0, order1 }: CreateStrategyParams) => {
      const order0Low = order0.price
        ? order0.price
        : order0.min
        ? order0.min
        : '0';
      const order0Max = order0.price
        ? order0.price
        : order0.max
        ? order0.max
        : '0';

      const order1Low = order1.price
        ? order1.price
        : order1.min
        ? order1.min
        : '0';
      const order1Max = order1.price
        ? order1.price
        : order1.max
        ? order1.max
        : '0';

      const unsignedTx = await sdk.createBuySellStrategy(
        token0,
        token1,
        order0Low,
        order0Max,
        order0.budget ?? '0',
        order1Low,
        order1Max,
        order1.budget ?? '0',
        { gasLimit: 9999999 }
      );

      return signer!.sendTransaction(unsignedTx);
    }
  );
};
