import { useNotifications } from 'hooks/useNotifications';
import { QueryKey, usePauseStrategyQuery, useQueryClient } from 'libs/queries';
import { useWagmi } from 'libs/wagmi';
import { useState } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { AnyStrategy } from './common/types';
import { isGradientStrategy } from './common/utils';

export const usePauseStrategy = () => {
  const { user } = useWagmi();
  const { dispatchNotification } = useNotifications();
  const cache = useQueryClient();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const updateMutation = usePauseStrategyQuery();

  const pauseStrategy = async (
    strategy: AnyStrategy,
    successEventsCb?: () => void,
    closeModalCb?: () => void,
  ) => {
    const { base, quote } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in update strategy: missing data ');
    }

    // TODO: support gradient
    if (isGradientStrategy(strategy)) {
      throw new Error('Cannot pause gradient strategy for now');
    }

    updateMutation.mutate(strategy, {
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

        cache.invalidateQueries({
          queryKey: QueryKey.strategiesByUser(user),
        });
        console.log('tx confirmed');
        successEventsCb?.();
      },
      onError: (e) => {
        setIsProcessing(false);
        console.error('update mutation failed', e);
      },
    });
  };

  return {
    pauseStrategy,
    isProcessing,
    updateMutation,
  };
};
