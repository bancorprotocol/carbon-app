import * as Comlink from 'comlink';
import { CarbonSDKWebWorker } from 'workers/sdk';
export type {
  Action,
  TradeActionBNStr,
  MatchActionBNStr,
} from '@bancor/carbon-sdk';

const worker = new Worker(new URL('./../../workers/sdk.ts', import.meta.url), {
  type: 'module',
});
export const carbonSDK = Comlink.wrap<CarbonSDKWebWorker>(worker);
