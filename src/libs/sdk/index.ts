import * as Comlink from 'comlink';
import { CarbonSDKWebWorker } from 'workers/sdk';

export type { Action, TradeActionStruct } from '@bancor/carbon-sdk';

const worker = new Worker(new URL('./../../workers/sdk.ts', import.meta.url));
export const carbonSDK = Comlink.wrap<CarbonSDKWebWorker>(worker);
