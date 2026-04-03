import * as Comlink from 'comlink';
import { CarbonSDKWebWorker } from 'workers/sdk';
export type {
  Action,
  TradeActionBNStr,
  MatchActionBNStr,
} from '@bancor/carbon-sdk';
import config from 'config';
import { CHAIN_ID, RPC_HEADERS, RPC_URLS } from 'libs/wagmi';
import { ContractsConfig } from '@bancor/carbon-sdk/contracts-api';
import { lsService } from 'services/localeStorage';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonApi } from 'services/carbonApi';

const worker = new Worker(new URL('./../../workers/sdk.ts', import.meta.url), {
  type: 'module',
});
export const carbonSDK = Comlink.wrap<CarbonSDKWebWorker>(worker);

const contractsConfig: ContractsConfig = {
  carbonControllerAddress: config.addresses.carbon.carbonController,
  voucherAddress: config.addresses.carbon.voucher,
  carbonBatcherAddress: config.addresses.carbon.batcher,
  multiCallAddress: config.utils?.multicall3?.address,
};

const defaultCacheTTL = config.sdk.cacheTTL ?? ONE_HOUR_IN_MS;

const shouldUseSeedData = () => {
  if (!import.meta.env.PROD) return false;
  if (!config.ui.useSeedData) return false;
  if (lsService.getItem('tenderlyRpc')) return false;
  return true;
};

const getTokenDecimalMap = () => {
  const tokens = lsService.getItem('tokenListCache')?.tokens || [];
  return new Map(
    tokens.map((token) => [token.address.toLowerCase(), token.decimals]),
  );
};

let awaitInit: Promise<void>;
export const getSDK = async () => {
  if (!awaitInit) {
    let cache: string | undefined;
    if (shouldUseSeedData()) {
      cache = await carbonApi.getSeedData();
    } else {
      const { timestamp, ttl } = lsService.getItem('lastSdkCache') ?? {};
      if (timestamp && ttl && timestamp + ttl > Date.now()) {
        cache = lsService.getItem('sdkCompressedCacheData');
      }
    }
    awaitInit = carbonSDK.init(
      CHAIN_ID,
      {
        url: RPC_URLS[CHAIN_ID],
        headers: RPC_HEADERS[CHAIN_ID],
      },
      contractsConfig,
      getTokenDecimalMap(),
      {
        cache,
        pairBatchSize: config.sdk.pairBatchSize,
        blockRangeSize: config.sdk.blockRangeSize,
        refreshInterval: config.sdk.refreshInterval,
      },
    );
    setTimeout(async () => {
      console.log('SDK Cache dumped into local storage');
      const cachedDump = await carbonSDK.getCacheDump();
      const { ttl = defaultCacheTTL } = lsService.getItem('lastSdkCache') ?? {};
      lsService.setItem('lastSdkCache', { timestamp: Date.now(), ttl });
      lsService.setItem('sdkCompressedCacheData', cachedDump, true);
    }, 1000 * 60);
  }
  await awaitInit;
  return carbonSDK;
};
