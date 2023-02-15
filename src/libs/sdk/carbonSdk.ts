import CarbonSDK from '@bancor/carbon-sdk';
import { RPC_URLS } from 'libs/web3';

export const decimalFetcherSDKMap: { map: Map<string, number> } = {
  map: new Map(),
};
const decimalFetcher = (a: string) =>
  decimalFetcherSDKMap.map.get(a.toLowerCase());

export const carbonSDK = new CarbonSDK(RPC_URLS[1]);
