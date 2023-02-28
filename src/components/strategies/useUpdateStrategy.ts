import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useQueryClient,
  useUpdateStrategyQuery,
} from 'libs/queries';
import { useWeb3 } from 'libs/web3';

export const useUpdateStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const updateMutation = useUpdateStrategyQuery();
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

  const renewStrategy = async (strategy: Strategy) => {
    const { token0, token1, order0, order1, encoded } = strategy;

    if (!token0 || !token1 || !user) {
      throw new Error('error in renew strategy: missing data ');
    }
    const isOrder0Limit = !!!order0.endRate;
    const isOrder1Limit = !!!order1.endRate;

    updateMutation.mutate(
      {
        token0,
        token1,
        order0: {
          budget: order0.balance,
          min: isOrder0Limit ? '' : order0.startRate,
          max: isOrder0Limit ? '' : order0.endRate,
          price: isOrder0Limit ? order0.startRate : '',
        },
        order1: {
          budget: order1.balance,
          min: isOrder1Limit ? '' : order1.startRate,
          max: isOrder1Limit ? '' : order1.endRate,
          price: isOrder1Limit ? order1.startRate : '',
        },
        encoded,
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('renewStrategy', { txHash: tx.hash });
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
    renewStrategy,
  };
};
