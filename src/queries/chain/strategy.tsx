import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { toStrategy } from 'utils/sdk';
import { Token, useTokens } from 'tokens';
import { MultiCall, useMulticall } from 'hooks/useMulticall';
import { decodeOrder } from 'utils/sdk2';
import { shrinkToken } from 'utils/tokens';
import { getMockTokenById } from 'tokens/tokenHelperFn';

enum ServerStateKeysEnum {
  Strategies = 'strategies',
}

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
  const { PoolCollection, Voucher } = useContract();
  const { fetchMulticall } = useMulticall();
  const { user } = useWeb3();
  const { tokens, getTokenById } = useTokens();

  return useQuery<Strategy[]>(
    [ServerStateKeysEnum.Strategies],
    async () => {
      const balance = await Voucher.read.balanceOf(user!);

      const calls: MultiCall[] = Array.from(
        Array(balance.toNumber()),
        (_, i) => ({
          contractAddress: Voucher.read.address,
          interface: Voucher.read.interface,
          methodName: 'tokenOfOwnerByIndex',
          methodParameters: [user!, i],
        })
      );
      const mcResult = await fetchMulticall(calls);
      const ids = mcResult.map((id) => id[0]);

      const strategies = await PoolCollection.read.strategiesByIds(ids);

      return strategies.map((s) => {
        // TODO future improvement: fetch symbol and decimals instead of mock token
        const token0 = getTokenById(s.pair[0]) || getMockTokenById(s.pair[0]);
        const token1 = getTokenById(s.pair[1]) || getMockTokenById(s.pair[1]);

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
            startRate: order0.lowestRate.toFixed(10).toString(),
            endRate: order0.highestRate.toFixed(10).toString(),
          },
          order1: {
            token: token1,
            balance: shrinkToken(order1.liquidity.toString(), token1.decimals),
            curveCapacity: shrinkToken(
              order1.currentRate.toString(),
              token1.decimals
            ),
            startRate: order1.lowestRate.toFixed(10).toString(),
            endRate: order1.highestRate.toFixed(10).toString(),
          },
          status: StrategyStatus.Normal,
          provider: s.provider,
        };
      });
    },
    { enabled: !!user && tokens.length > 0 }
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
        cache.invalidateQueries([ServerStateKeysEnum.Strategies]);
      },
      onError: () => {
        // TODO: proper error handling
        console.error('could not create strategy');
      },
    }
  );
};
