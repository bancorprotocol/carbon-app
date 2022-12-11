import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { toStrategy } from 'utils/sdk';
import { Token } from 'services/tokens';
import { useTokens } from 'queries/tokens';

enum ServerStateKeysEnum {
  Strategies = 'strategies',
}

enum StrategyStatus {
  Normal,
  ToBeFilled,
  Completed,
  NoAllocation,
}

export interface Strategy {
  id: string;
  tokens: SourceTarget;
  orders: SourceTarget;
  status: StrategyStatus;
  provider: string;
}

export interface SourceTarget {
  source: Token;
  target: Token;
}

export const useGetUserStrategies = () => {
  const { PoolCollection } = useContract();
  const { user } = useWeb3();
  const tokens = useTokens().tokens;

  return useQuery<Strategy[]>(
    [ServerStateKeysEnum.Strategies],
    async () => {
      if (!tokens) return [];
      const result = await PoolCollection.read.strategiesByProvider(user!);
      return result.map((s) => {
        const source = tokens.find((t) => t.address === s.pair[0])!;
        const target = tokens.find((t) => t.address === s.pair[1])!;
        const orderSource = tokens.find(
          (t) => t.address === s.orders[0].toString()
        )!;
        const orderTarget = tokens.find(
          (t) => t.address === s.orders[1].toString()
        )!;
        return {
          id: s.id.toString(),
          tokens: { source, target },
          orders: {
            source: orderSource,
            target: orderTarget,
          },
          status: StrategyStatus.Normal,
          provider: s.provider,
        };
      });
    },
    { enabled: !!user }
  );
};

interface CreateStrategyOrder {
  token: Token;
  liquidity: string;
  high: string;
  low: string;
  intercept?: string;
}

export interface CreateStrategyParams {
  source: CreateStrategyOrder;
  target: CreateStrategyOrder;
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
