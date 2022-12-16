import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { toStrategy } from 'utils/sdk';
import { Token, useTokens } from 'tokens';
import { MultiCall, useMulticall } from 'hooks/useMulticall';
import { decodeOrder } from 'utils/sdk2';
import { shrinkToken } from 'utils/tokens';
import { fetchTokenData } from 'tokens/tokenHelperFn';
import { QueryKey } from '../queryKey';

export enum StrategyStatus {
  Normal,
  ToBeFilled,
  Completed,
  NoAllocation,
  OffCurve,
}

interface Order {
  token: Token;
  balance: string;
  curveCapacity: string;
  startRate: string;
  endRate: string;
}

export interface Strategy {
  id: number;
  order0: Order;
  order1: Order;
  status: StrategyStatus;
  provider: string;
}

export const useGetUserStrategies = () => {
  const { PoolCollection, Voucher, Token } = useContract();
  const { fetchMulticall } = useMulticall();
  const { user } = useWeb3();
  const { tokens, getTokenById } = useTokens();

  return useQuery<Strategy[]>(
    QueryKey.strategies(user),
    async () => {
      if (!user) {
        return [];
      }

      const balance = await Voucher.read.balanceOf(user);

      const calls: MultiCall[] = Array.from(
        Array(balance.toNumber()),
        (_, i) => ({
          contractAddress: Voucher.read.address,
          interface: Voucher.read.interface,
          methodName: 'tokenOfOwnerByIndex',
          methodParameters: [user, i],
        })
      );
      const mcResult = await fetchMulticall(calls);
      const ids = mcResult.map((id) => id[0]);

      const strategiesByIds = await PoolCollection.read.strategiesByIds(ids);

      const promises = strategiesByIds.map(async (s) => {
        const token0 =
          getTokenById(s.pair[0]) || (await fetchTokenData(Token, s.pair[0]));

        const token1 =
          getTokenById(s.pair[1]) || (await fetchTokenData(Token, s.pair[1]));

        const order0 = decodeOrder({ ...s.orders[0] });
        const order1 = decodeOrder({ ...s.orders[1] });

        return {
          id: s.id.toNumber(),
          order0: {
            token: token0,
            balance: shrinkToken(order0.liquidity.toString(), token0.decimals),
            curveCapacity: shrinkToken(
              order0.currentRate.toString(),
              token0.decimals
            ),
            startRate: order0.lowestRate.toString(),
            endRate: order0.highestRate.toString(),
          },
          order1: {
            token: token1,
            balance: shrinkToken(order1.liquidity.toString(), token1.decimals),
            curveCapacity: shrinkToken(
              order1.currentRate.toString(),
              token1.decimals
            ),
            startRate: order1.lowestRate.toString(),
            endRate: order1.highestRate.toString(),
          },
          status: StrategyStatus.Normal,
          provider: s.provider,
        };
      });

      return await Promise.all(promises);
    },
    { enabled: tokens.length > 0 }
  );
};

interface CreateStrategyOrder {
  token: Token;
  balance: string;
  high: string;
  low: string;
  intercept?: string;
}

export interface CreateStrategyParams {
  token0: CreateStrategyOrder;
  token1: CreateStrategyOrder;
}
export const useCreateStrategy = () => {
  const { user } = useWeb3();
  const { PoolCollection } = useContract();
  const cache = useQueryClient();

  return useMutation(
    (strategy: CreateStrategyParams) => {
      console.log(strategy);
      return PoolCollection.write.createStrategy(...toStrategy(strategy), {
        // TODO fix GAS limit
        gasLimit: '99999999999999999',
      });
    },
    {
      onSuccess: () => {
        void cache.invalidateQueries({ queryKey: QueryKey.strategies(user) });
      },
      onError: () => {
        // TODO: proper error handling
        console.error('could not create strategy');
      },
    }
  );
};
