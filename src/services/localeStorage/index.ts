import { ManagedLocalStorage } from 'utils/managedLocalStorage';

const APP_ID = 'bancor';
const APP_VERSION = 'v0';

// ************************** /
// BEWARE!! Keys are not to be removed or changed without setting a proper clean-up and migration logic in place!! Same for changing the app version!
// ************************** /

interface LocalStorageSchema {
  tenderlyRpc: string;
  imposterAccount: string;
  testNumber: number;
  testObject: {
    id: string;
  };
}

export const lsService = new ManagedLocalStorage<LocalStorageSchema>((key) =>
  [APP_ID, APP_VERSION, key].join('-')
);
