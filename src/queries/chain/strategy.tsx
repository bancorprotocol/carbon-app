import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { toStrategy } from 'utils/sdk';
import { Token } from 'services/tokens';

enum ServerStateKeysEnum {
  Strategies = 'strategies',
}

export const useGetUserStrategies = () => {
  const { PoolCollection } = useContract();
  const { user } = useWeb3();

  return useQuery(
    [ServerStateKeysEnum.Strategies],
    async () => {
      const result = await PoolCollection.read.strategiesByProvider(user!);

      return result.map((s) => ({
        id: s.id.toString(),
        tokens: { source: s.tokens[0], target: s.tokens[1] },
        orders: {
          source: s.orders[0].toString(),
          target: s.orders[1].toString(),
        },
        provider: s.provider,
      }));
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
        return cache.invalidateQueries([ServerStateKeysEnum.Strategies]);
      },
    }
  );
};
