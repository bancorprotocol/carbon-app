import { IdAndDataType } from 'types/extractDataById.types';
import { ModalWallet, ModalWalletData } from 'modals/modals/ModalWallet';
import { ModalTokenList } from 'modals/modals/ModalTokenList';
import { FC } from 'react';

// Step 1: Add modal type to enum
export enum ModalType {
  WALLET,
  TOKEN_LIST,
}

// Step 2: Create Modal Component in /modals/modals folder

// Step 3: add modal to union type
export type AllModalsUnion =
  | IdAndDataType<ModalType.WALLET, ModalWalletData>
  | IdAndDataType<ModalType.TOKEN_LIST, undefined>;

export const ModalsMap = new Map<ModalType, FC<{ id: string }>>();

// Step 4: add modal component to map
ModalsMap.set(ModalType.WALLET, (props) => ModalWallet(props));
ModalsMap.set(ModalType.TOKEN_LIST, (props) => ModalTokenList(props));
