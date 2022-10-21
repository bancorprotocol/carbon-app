import { IdAndDataType } from 'types/extractDataById.types';
import { ManagedLocalStorage } from 'utils/managedLocalStorage';

const appId = 'bancor';
const appVersion = 'v0';

// To add a new LocalStorage follow next 2 steps
// STEP 1: add ID
export enum LocalStorageId {
  TENDERLY_RPC = 'tenderlyRpc',
  IMPOSTER_ACCOUNT = 'imposterAccount',
}

// STEP 2: add type to union
type AllLsTypes =
  | IdAndDataType<LocalStorageId.TENDERLY_RPC, string>
  | IdAndDataType<LocalStorageId.IMPOSTER_ACCOUNT, string>;

export const lsService = new ManagedLocalStorage<LocalStorageId, AllLsTypes>(
  (key) => [appId, appVersion, key].join('-')
);
