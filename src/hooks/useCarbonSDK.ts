import { carbonSDK } from 'libs/sdk';
import { useCallback } from 'react';
import { useStore } from 'store';

export const useCarbonSDK = () => {
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
  const init = useCallback(async () => {
    if (!carbonSDK.isInitialized) {
      try {
        setIsLoading(true);
        console.log('Initializing CarbonSDK...');
        await carbonSDK.startDataSync();
        console.log('CarbonSDK initialized');
        setIsInitialized(true);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
  }, [setIsInitialized, setIsLoading, setIsError]);

  return { isInitialized, isLoading, isError, init };
};
