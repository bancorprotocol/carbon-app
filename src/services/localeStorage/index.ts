import { ManagedLocalStorage } from 'utils/managedLocalStorage';

const appId = 'bancor';
const appVersion = 'v0';

interface LocalStorageSchema {
  tenderlyRpc: string;
  imposterAccount: string;
  testNumber: number;
}

export const lsService = new ManagedLocalStorage<LocalStorageSchema>((key) =>
  [appId, appVersion, key].join('-')
);
