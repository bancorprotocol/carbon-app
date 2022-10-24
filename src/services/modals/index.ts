import { IdAndDataType } from 'types/extractDataById.types';

// Step 1: Add modal type to enum
export enum ModalType {
  WALLET,
  TOKEN_LIST,
}

// Step 2: Create Modal Component in elements/modals folder

// Step 3: Import Modal Component in providers/ModalProvider.ts

// Step 3: create optional MODAL data
type ModalWalletData = {
  foo: string;
  bar: string;
};

// Step 4: add modal to union type
export type AllModalsUnion =
  | IdAndDataType<ModalType.WALLET, ModalWalletData>
  | IdAndDataType<ModalType.TOKEN_LIST, undefined>;
