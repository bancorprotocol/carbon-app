import { ModalWallet, ModalWalletData } from 'modals/modals/ModalWallet';
import { ModalTokenList } from 'modals/modals/ModalTokenList';
import { FC } from 'react';

// Step 1: Add modal key and data type to schema
export interface ModalSchema {
  wallet: ModalWalletData;
  tokenLists: undefined;
}

// Step 2: Create Modal Component in modals/modals folder

// no action required here
export const ModalsMap = new Map<keyof ModalSchema, FC<{ id: string }>>();

// Step 3: add modal component to map
ModalsMap.set('wallet', (props) => ModalWallet(props));
ModalsMap.set('tokenLists', (props) => ModalTokenList(props));
