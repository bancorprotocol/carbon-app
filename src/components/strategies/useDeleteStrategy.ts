import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useDeleteStrategyQuery,
  useQueryClient,
} from 'libs/queries';
import { useWeb3 } from 'libs/web3';
import { Dispatch, SetStateAction } from 'react';
import { StrategyTxStatus } from './create/types';

export const useDeleteStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const deleteMutation = useDeleteStrategyQuery();
  const cache = useQueryClient();

  const deleteStrategy = async (
    strategy: Strategy,
    setStrategyStatus: Dispatch<SetStateAction<StrategyTxStatus>>,
    successEventsCb?: () => void
  ) => {
    const { base, quote, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in delete strategy: missing data ');
    }

    setStrategyStatus('waitingForConfirmation');

    deleteMutation.mutate(
      {
        id,
      },
      {
        onSuccess: async (tx) => {
          setStrategyStatus('processing');
          setTimeout(() => {
            setStrategyStatus('initial');
            successEventsCb?.();
          }, 2000);

          dispatchNotification('deleteStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          setStrategyStatus('initial');
          console.error('delete mutation failed', e);
        },
      }
    );
  };

  return {
    deleteStrategy,
  };
};
