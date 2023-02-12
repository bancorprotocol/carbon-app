import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useQueryClient,
  useUpdateStrategy,
} from 'libs/queries';
import { useWeb3 } from 'libs/web3';

export const useUpdate = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const updateMutation = useUpdateStrategy();
  const cache = useQueryClient();

  const pauseStrategy = async (strategy: Strategy) => {
    const { token0, token1, order0, order1, encoded } = strategy;

    if (!token0 || !token1 || !user) {
      throw new Error('error in update strategy: missing data ');
    }

    updateMutation.mutate(
      {
        token0,
        token1,
        order0: {
          budget: order0.balance,
          min: '0',
          max: '0',
          price: '',
        },
        order1: {
          budget: order1.balance,
          min: '0',
          max: '0',
          price: '',
        },
        encoded,
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('pauseStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('update mutation failed', e);
        },
      }
    );
  };

  return {
    pauseStrategy,
  };
};
