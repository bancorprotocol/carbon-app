import { carbonSDK } from 'libs/sdk';
import { useCallback } from 'react';
import { useStore } from 'store';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';

export const useCarbonSDK = () => {
  const cache = useQueryClient();
  const {
    sdk: {
      isInitialized,
      setIsInitialized,
      isLoading,
      setIsLoading,
      isError,
      setIsError,
    },
  } = useStore();

  const onChangeCallback = useCallback(() => {
    void cache.invalidateQueries({ queryKey: QueryKey.sdk });
  }, [cache]);

  const init = useCallback(async () => {
    if (!carbonSDK.isInitialized) {
      try {
        setIsLoading(true);
        console.log('Initializing CarbonSDK...');
        await carbonSDK.startDataSync();
        console.log('CarbonSDK initialized');
        carbonSDK.onChange(onChangeCallback);
        setIsInitialized(true);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
  }, [setIsLoading, onChangeCallback, setIsInitialized, setIsError]);

  return { isInitialized, isLoading, isError, init };
};
