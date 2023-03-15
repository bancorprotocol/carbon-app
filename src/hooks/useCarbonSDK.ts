import { useCallback } from 'react';
import { useStore } from 'store';
import { useQueryClient } from '@tanstack/react-query';
import { RPC_URLS } from 'libs/web3';
import { config } from 'services/web3/config';
import { carbonSDK } from 'index';
import * as Comlink from 'comlink';
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
    // TODO: if isInitialized is true, don't init again
    const isInitialized = await carbonSDK.isInitialized();
    if (!isInitialized) {
      try {
        setIsLoading(true);
        console.log('Initializing CarbonSDK...');
        await carbonSDK.init({
          rpcUrl: RPC_URLS[1],
          contractAddresses: {
            carbonControllerAddress: config.carbon.carbonController,
            voucherAddress: config.carbon.voucher,
          },
        });
        console.log('Web worker: SDK initialized');
        await carbonSDK.onChange(Comlink.proxy(onChangeCallback));
        setIsInitialized(true);
        console.log('CarbonSDK initialized jan jan');
      } catch (e) {
        console.error('Error initializing CarbonSDK', e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
  }, [setIsLoading, onChangeCallback, setIsInitialized, setIsError]);

  return { isInitialized, isLoading, isError, init };
};
