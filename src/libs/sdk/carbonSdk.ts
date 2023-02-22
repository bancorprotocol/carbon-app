import CarbonSDK, { Config } from '@bancor/carbon-sdk';
import { RPC_URLS } from 'libs/web3';
import { config } from 'services/web3/config';

export const decimalFetcherSDKMap: { map: Map<string, number> } = {
  map: new Map(),
};
const decimalFetcher = (a: string) =>
  decimalFetcherSDKMap.map.get(a.toLowerCase());

const sdkConfig: Config = {
  rpcUrl: RPC_URLS[1],
  contractAddresses: {
    carbonControllerAddress: config.carbon.carbonController,
    voucherAddress: config.carbon.voucher,
  },
};

export const carbonSDK = new CarbonSDK(sdkConfig, decimalFetcher);
