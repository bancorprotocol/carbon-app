import { ExtractDataType, IdAndData } from 'types/extractDataById.types';

const appId = 'bancor-ui';
const appVersion = 'v0';

// To add a new localeStorage follow next 3 steps
// STEP 1: add ID
export enum LocaleStorageId {
  TENDERLY_RPC = 'tenderlyRpc',
  IMPOSTER_ACCOUNT = 'imposterAccount',
}

// STEP 2: add type
type LsTenderlyType = IdAndData<LocaleStorageId.TENDERLY_RPC, string>;
type LsImposterType = IdAndData<LocaleStorageId.IMPOSTER_ACCOUNT, string>;

// STEP 3: add type created in step 2 to union
type AllLsTypes = LsTenderlyType | LsImposterType;

export const getLocaleStorage = <T extends LocaleStorageId>(
  id: T
): ExtractDataType<AllLsTypes, T>['data'] | undefined => {
  const lsId = [appId, appVersion, id].join('-');
  const value = localStorage.getItem(lsId);
  if (!value) {
    return;
  }
  return JSON.parse(value);
};

export const setLocaleStorage = <T extends LocaleStorageId>(
  id: T,
  value?: ExtractDataType<AllLsTypes, T>['data']
) => {
  const lsId = [appId, appVersion, id].join('-');
  if (!value) {
    return localStorage.removeItem(lsId);
  }
  const stringValue = JSON.stringify(value);
  localStorage.setItem(lsId, stringValue);
};
