import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useDeleteStrategyQuery,
  useQueryClient,
} from 'libs/queries';
import { useWeb3 } from 'libs/web3';
import { Dispatch, SetStateAction } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { TxStatus } from './create/types';

export const useDeleteStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const deleteMutation = useDeleteStrategyQuery();
  const cache = useQueryClient();

  const deleteStrategy = async (
    strategy: Strategy,
    setStrategyStatus: Dispatch<SetStateAction<TxStatus>>,
    successEventsCb?: () => void,
    beforeTxSuccessCb?: () => void
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
            beforeTxSuccessCb?.();
            setStrategyStatus('initial');
          }, ONE_AND_A_HALF_SECONDS_IN_MS);

          dispatchNotification('deleteStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
          successEventsCb?.();
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
