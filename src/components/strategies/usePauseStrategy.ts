import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useQueryClient,
  useUpdateStrategyQuery,
} from 'libs/queries';
import { useWeb3 } from 'libs/web3';
import { useState } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';

export const usePauseStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const updateMutation = useUpdateStrategyQuery();
  const cache = useQueryClient();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const pauseStrategy = async (
    strategy: Strategy,
    successEventsCb?: () => void,
    closeModalCb?: () => void
  ) => {
    const { base, quote, encoded, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in update strategy: missing data ');
    }

    updateMutation.mutate(
      {
        id,
        encoded,
        fieldsToUpdate: {
          buyPriceLow: '0',
          buyPriceHigh: '0',
          sellPriceLow: '0',
          sellPriceHigh: '0',
        },
      },
      {
        onSuccess: async (tx) => {
          setIsProcessing(true);
          setTimeout(() => {
            closeModalCb?.();
            setIsProcessing(false);
          }, ONE_AND_A_HALF_SECONDS_IN_MS);

          dispatchNotification('pauseStrategy', { txHash: tx.hash });
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
          console.error('update mutation failed', e);
        },
      }
    );
  };

  return {
    pauseStrategy,
    isProcessing,
    updateMutation,
  };
};
