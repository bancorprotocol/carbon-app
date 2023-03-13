import { useCallback } from 'react';
import { useStore } from 'store';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { RPC_URLS } from 'libs/web3';
import { config } from 'services/web3/config';
import { obj } from 'index';
import { wait } from 'utils/helpers';

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
    // const isInitialized = await obj.isInitialized();
    if (true) {
      try {
        setIsLoading(true);
        console.log('Initializing CarbonSDK...');
        await obj.init({
          rpcUrl: RPC_URLS[1],
          contractAddresses: {
            carbonControllerAddress: config.carbon.carbonController,
            voucherAddress: config.carbon.voucher,
          },
        });
        await obj.startDataSync();
        console.log('Web worker: SDK initialized');
        // TODO: make onChange callback work
        // await obj.onChange(onChangeCallback);
        await wait(5000);
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
