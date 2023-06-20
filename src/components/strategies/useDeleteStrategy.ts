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

export const useDeleteStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const deleteMutation = useDeleteStrategyQuery();
  const cache = useQueryClient();

  const deleteStrategy = async (
    strategy: Strategy,
    setIsProcessing: Dispatch<SetStateAction<boolean>>,
    successEventsCb?: () => void,
    closeModalCb?: () => void
  ) => {
    const { base, quote, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in delete strategy: missing data ');
    }

    deleteMutation.mutate(
      {
        id,
      },
      {
        onSuccess: async (tx) => {
          setIsProcessing(true);
          setTimeout(() => {
            closeModalCb?.();
            setIsProcessing(false);
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
          setIsProcessing(false);
          console.error('delete mutation failed', e);
        },
      }
    );
  };

  return {
    deleteStrategy,
    deleteMutation,
  };
};
