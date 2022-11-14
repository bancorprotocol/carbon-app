import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';

enum ServerStateKeysEnum {
  Strategies = 'strategies',
}

export const useGetUserStrategies = () => {
  const { PoolCollection } = useContract();
  const { user } = useWeb3();

  return useQuery(
    [ServerStateKeysEnum.Strategies],
    async () => {
      PoolCollection.read.strategiesByProvider(user!);
    },
    {
      enabled: !!user,
    }
  );
};

// TODO: this should be utils from SDK + implement
// eslint-disable-next-line unused-imports/no-unused-vars
const toStrategy = (uiStrategy: any) => {
  return ['bla', 'yada', 1, 1, 1, 1, 1, 1, 1, 1] as const;
};

// TODO: strongly type UI Order and Strategy
export const useCreateStrategy = (strategy: any) => {
  const { PoolCollection } = useContract();
  const cache = useQueryClient();

  return useMutation(
    async () => {
      PoolCollection.write.createStrategy(...toStrategy(strategy));
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
