import { FC, ReactNode, useEffect, useState } from 'react';
import { SdkContext } from './context';
import { useQueryClient } from '@tanstack/react-query';
import * as Comlink from 'comlink';
import { TokenPair } from '@bancor/carbon-sdk';
import { ContractsConfig } from '@bancor/carbon-sdk/contracts-api';
import { lsService } from 'services/localeStorage';
import { carbonSDK } from 'libs/sdk';
import { QueryKey } from 'libs/queries';
import { CHAIN_ID, RPC_URLS, RPC_HEADERS } from 'libs/wagmi';
import { buildTokenPairKey, setIntervalUsingTimeout } from 'utils/helpers';
import { ONE_HOUR_IN_MS } from 'utils/time';
import config from 'config';

const contractsConfig: ContractsConfig = {
  carbonControllerAddress: config.addresses.carbon.carbonController,
  voucherAddress: config.addresses.carbon.voucher,
  carbonBatcherAddress: config.addresses.carbon.batcher,
  multiCallAddress: config.utils?.multicall3?.address,
};

const defaultCacheTTL = config.sdk.cacheTTL ?? ONE_HOUR_IN_MS;
const persistSdkCacheDump = async () => {
  console.log('SDK Cache dumped into local storage');
  const cachedDump = await carbonSDK.getCacheDump();
  const { ttl = defaultCacheTTL } = lsService.getItem('lastSdkCache') ?? {};
  lsService.setItem('lastSdkCache', { timestamp: Date.now(), ttl });
  lsService.setItem('sdkCompressedCacheData', cachedDump, true);
};

const getTokenDecimalMap = () => {
  const tokens = lsService.getItem('tokenListCache')?.tokens || [];
  return new Map(
    tokens.map((token) => [token.address.toLowerCase(), token.decimals]),
  );
};

interface Props {
  children: ReactNode;
}

export const SDKProvider: FC<Props> = ({ children }) => {
  const cache = useQueryClient();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      try {
        setIsLoading(true);
        const { timestamp, ttl } = lsService.getItem('lastSdkCache') ?? {};
        let cacheData: string | undefined;
        if (timestamp && ttl && timestamp + ttl > Date.now()) {
          cacheData = lsService.getItem('sdkCompressedCacheData');
        }
        await Promise.all([
          carbonSDK.init(
            CHAIN_ID,
            {
              url: RPC_URLS[CHAIN_ID],
              headers: RPC_HEADERS[CHAIN_ID],
            },
            contractsConfig,
            getTokenDecimalMap(),
            {
              cache: cacheData,
              pairBatchSize: config.sdk.pairBatchSize,
              blockRangeSize: config.sdk.blockRangeSize,
              refreshInterval: config.sdk.refreshInterval,
            },
          ),
        ]);
        setIsInitialized(true);
        setIntervalUsingTimeout(persistSdkCacheDump, 1000 * 60);
      } catch (e) {
        console.error('Error initializing Carbon', e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    initSDK();
  }, []);

  useEffect(() => {
    const invalidateQueriesByPair = (pair: TokenPair) => {
      cache.invalidateQueries({
        predicate: (query) =>
          query.queryKey[1] === buildTokenPairKey(pair) ||
          query.queryKey[1] === buildTokenPairKey([pair[1], pair[0]]) ||
          query.queryKey[1] === 'strategies',
      });
    };

    const onPairDataChangedCallback = async (pairs: TokenPair[]) => {
      console.log('onPairDataChangedCallback', pairs);
      for (const pair of pairs) {
        invalidateQueriesByPair(pair);
      }
    };

    const onPairAddedToCacheCallback = async (pair: TokenPair) => {
      console.log('onPairAddedToCacheCallback', pair);
      if (pair.length !== 2) return;
      invalidateQueriesByPair(pair);
      cache.invalidateQueries({ queryKey: QueryKey.pairs() });
    };

    const onCacheClearedCallback = () => {
      cache.invalidateQueries({
        predicate: (key) => key.queryKey.includes('sdk'),
      });
    };

    carbonSDK.setOnChangeHandlers(
      Comlink.proxy(onPairDataChangedCallback),
      Comlink.proxy(onPairAddedToCacheCallback),
      Comlink.proxy(onCacheClearedCallback),
    );

    return () => {
      carbonSDK.setOffChangeHandlers(
        Comlink.proxy(onPairDataChangedCallback),
        Comlink.proxy(onPairAddedToCacheCallback),
        Comlink.proxy(onCacheClearedCallback),
      );
    };
  }, [cache]);

  return (
    <SdkContext.Provider value={{ isInitialized, isLoading, isError }}>
      {children}
    </SdkContext.Provider>
  );
};
