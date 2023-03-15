import { useCallback } from 'react';
import { useStore } from 'store';
import { useQueryClient } from '@tanstack/react-query';
import { RPC_URLS } from 'libs/web3';
import { config } from 'services/web3/config';
import { carbonSDK } from 'index';
import * as Comlink from 'comlink';
import { TokenPair } from '@bancor/carbon-sdk';
import { buildTokenPairKey } from 'utils/helpers';

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

  const onChangeCallback = useCallback(
    (pairs: TokenPair[]) => {
      pairs.forEach((pair) => {
        void cache.invalidateQueries({
          predicate: (query) =>
            query.queryKey[1] === buildTokenPairKey(pair) ||
            query.queryKey[1] === buildTokenPairKey([pair[1], pair[0]]),
        });
      });
    },
    [cache]
  );

  const init = useCallback(async () => {
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
