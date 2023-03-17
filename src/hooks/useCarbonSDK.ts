import { useCallback } from 'react';
import { useStore } from 'store';
import { useQueryClient } from '@tanstack/react-query';
import { RPC_URLS } from 'libs/web3';
import { config } from 'services/web3/config';
import { carbonSDK } from 'index';
import * as Comlink from 'comlink';
import { TokenPair } from '@bancor/carbon-sdk';
import { buildTokenPairKey } from 'utils/helpers';
import { lsService } from 'services/localeStorage';
import { QueryKey } from 'libs/queries';

const sdkConfig = {
  rpcUrl: RPC_URLS[1],
  contractAddresses: {
    carbonControllerAddress: config.carbon.carbonController,
    voucherAddress: config.carbon.voucher,
  },
};

const getTokenDecimalMap = () => {
  const tokens = lsService.getItem('tokenListCache')?.tokens || [];
  const importedTokens = lsService.getItem('importedTokens') || [];
  return new Map(
    // TODO filter out duplicates
    [...tokens, ...importedTokens].map((token) => [
      token.address.toLowerCase(),
      token.decimals,
    ])
  );
};

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
      console.log('Web worker: onPairDataChangedCallback', pairs);
      if (pairs.length === 0) return;
      pairs.forEach((pair) => invalidateQueriesByPair(pair));
      const cachedDump = await carbonSDK.getCacheDump();
      lsService.setItem('sdkCacheData', cachedDump);
    },
    [invalidateQueriesByPair]
  );

  const onPairAddedToCacheCallback = useCallback(
    async (pair: TokenPair) => {
      console.log('Web worker: onPairAddedToCacheCallback', pair);
      if (pair.length !== 2) return;
      void invalidateQueriesByPair(pair);
      void cache.invalidateQueries({ queryKey: QueryKey.pairs() });
      const cachedDump = await carbonSDK.getCacheDump();
      lsService.setItem('sdkCacheData', cachedDump);
    },
    [cache, invalidateQueriesByPair]
  );

  const init = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Initializing CarbonSDK...');
      const cacheData = lsService.getItem('sdkCacheData');
      await carbonSDK.init(sdkConfig, getTokenDecimalMap(), cacheData);
      console.log('Web worker: SDK initialized');
      await carbonSDK.setOnChangeHandlers(
        Comlink.proxy(onPairDataChangedCallback),
        Comlink.proxy(onPairAddedToCacheCallback)
      );
      setIsInitialized(true);
      console.log('CarbonSDK initialized jan jan');
    } catch (e) {
      console.error('Error initializing CarbonSDK', e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    onPairDataChangedCallback,
    onPairAddedToCacheCallback,
    setIsInitialized,
    setIsError,
  ]);

  return { isInitialized, isLoading, isError, init };
};
