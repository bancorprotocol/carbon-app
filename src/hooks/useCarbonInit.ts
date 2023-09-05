import { useCallback } from 'react';
import { useStore } from 'store';
import { useQueryClient } from '@tanstack/react-query';
import * as Comlink from 'comlink';
import { TokenPair } from '@bancor/carbon-sdk';
import { ContractsConfig } from '@bancor/carbon-sdk/contracts-api';
import { config } from 'services/web3/config';
import { lsService } from 'services/localeStorage';
import { carbonSDK } from 'libs/sdk';
import { useModal } from 'hooks/useModal';
import { QueryKey } from 'libs/queries';
import { RPC_URLS } from 'libs/web3';
import { SupportedChainId } from 'libs/web3/web3.constants';
import { buildTokenPairKey, setIntervalUsingTimeout } from 'utils/helpers';
import { carbonApi } from 'utils/carbonApi';

const contractsConfig: ContractsConfig = {
  carbonControllerAddress: config.carbon.carbonController,
  voucherAddress: config.carbon.voucher,
};

const persistSdkCacheDump = async () => {
  console.log('SDK Cache dumped into local storage');
  const cachedDump = await carbonSDK.getCacheDump();
  lsService.setItem('sdkCompressedCacheData', cachedDump, true);
};

const getTokenDecimalMap = () => {
  const tokens = lsService.getItem('tokenListCache')?.tokens || [];
  return new Map(
    tokens.map((token) => [token.address.toLowerCase(), token.decimals])
  );
};

const removeOldI18nKeys = () => {
  Object.keys(localStorage).forEach((key) => {
    if (
      key.match(/carbon-v\d-[a-z]{2}-[A-Z]{2}-translation/) ||
      key.includes('i18nextLng')
    ) {
      localStorage.removeItem(key);
    }
  });
};

export const useCarbonInit = () => {
  const cache = useQueryClient();
  const {
    setCountryBlocked,
    sdk: {
      isInitialized,
      setIsInitialized,
      isLoading,
      setIsLoading,
      isError,
      setIsError,
    },
  } = useStore();
  const { openModal } = useModal();

  const invalidateQueriesByPair = useCallback(
    (pair: TokenPair) => {
      void cache.invalidateQueries({
        predicate: (query) =>
          query.queryKey[1] === buildTokenPairKey(pair) ||
          query.queryKey[1] === buildTokenPairKey([pair[1], pair[0]]) ||
          query.queryKey[1] === 'strategies',
      });
    },
    [cache]
  );

  const onPairDataChangedCallback = useCallback(
    async (pairs: TokenPair[]) => {
      console.log('onPairDataChangedCallback', pairs);
      if (pairs.length === 0) return;
      pairs.forEach((pair) => invalidateQueriesByPair(pair));
    },
    [invalidateQueriesByPair]
  );

  const onPairAddedToCacheCallback = useCallback(
    async (pair: TokenPair) => {
      console.log('onPairAddedToCacheCallback', pair);
      if (pair.length !== 2) return;
      void invalidateQueriesByPair(pair);
      void cache.invalidateQueries({ queryKey: QueryKey.pairs() });
    },
    [cache, invalidateQueriesByPair]
  );

  const init = useCallback(async () => {
    try {
      setIsLoading(true);
      const cacheData = lsService.getItem('sdkCompressedCacheData');

      const [isBlocked] = await Promise.all([
        carbonApi.getCheck(),
        carbonSDK.init(
          RPC_URLS[SupportedChainId.MAINNET],
          contractsConfig,
          getTokenDecimalMap(),
          cacheData
        ),
        carbonSDK.setOnChangeHandlers(
          Comlink.proxy(onPairDataChangedCallback),
          Comlink.proxy(onPairAddedToCacheCallback)
        ),
      ]);
      setCountryBlocked(isBlocked);
      if (isBlocked && !lsService.getItem('hasSeenRestrictedCountryModal')) {
        openModal('restrictedCountry', undefined);
      }

      removeOldI18nKeys();

      setIsInitialized(true);
      setIntervalUsingTimeout(persistSdkCacheDump, 1000 * 60);
    } catch (e) {
      console.error('Error initializing Carbon', e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    onPairDataChangedCallback,
    onPairAddedToCacheCallback,
    setCountryBlocked,
    setIsInitialized,
    openModal,
    setIsError,
  ]);

  return { isInitialized, isLoading, isError, init };
};
