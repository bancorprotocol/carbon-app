import { ModalWallet } from 'modals/modals/ModalWallet';
import {
  ModalTokenList,
  ModalTokenListData,
} from 'modals/modals/ModalTokenList/ModalTokenList';
import { TModals } from 'modals/modals.types';
import {
  ModalCreateConfirm,
  ModalCreateConfirmData,
} from 'modals/modals/ModalCreateConfirm';
import { ModalImportToken, ModalImportTokenData } from './ModalImportToken';

// Step 1: Add modal key and data type to schema
export interface ModalSchema {
  wallet: undefined;
  tokenLists: ModalTokenListData;
  txConfirm: ModalCreateConfirmData;
  importToken: ModalImportTokenData;
}

// Step 2: Create component in modals/modals folder

// Step 3: Add modal component here
export const MODAL_COMPONENTS: TModals = {
  wallet: (props) => ModalWallet(props),
  tokenLists: (props) => ModalTokenList(props),
  txConfirm: (props) => ModalCreateConfirm(props),
  importToken: (props) => ModalImportToken(props),
};
