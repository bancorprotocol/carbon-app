import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useDeleteStrategyQuery,
  useQueryClient,
} from 'libs/queries';
import { useWagmi } from 'libs/wagmi';
import { useState } from 'react';

import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';

export const useDeleteStrategy = () => {
  const { user } = useWagmi();
  const { dispatchNotification } = useNotifications();
  const deleteMutation = useDeleteStrategyQuery();
  const cache = useQueryClient();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const deleteStrategy = async (
    strategy: Strategy,
    successEventsCb?: () => void,
    closeModalCb?: () => void,
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
          cache.invalidateQueries({
            queryKey: QueryKey.strategiesByUser(user),
          });
          console.log('tx confirmed');
          successEventsCb?.();
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('delete mutation failed', e);
        },
      },
    );
  };

  return {
    deleteStrategy,
    isProcessing,
    deleteMutation,
  };
};
