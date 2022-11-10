import { ModalWallet } from 'modals/modals/ModalWallet';
import { ModalTokenList } from 'modals/modals/ModalTokenList';
import { TModals } from 'modals/modals.types';
import {
  ModalTxConfirm,
  ModalTxConfirmData,
} from 'modals/modals/ModalTxConfirm';
import {
  ModalCreateStrategy,
  ModalCreateStrategyData,
} from 'modals/modals/ModalCreateStrategy';

// Step 1: Add modal key and data type to schema
export interface ModalSchema {
  wallet: undefined;
  tokenLists: undefined;
  txConfirm: ModalTxConfirmData;
  createStrategy: ModalCreateStrategyData;
}

// Step 2: Create component in modals/modals folder

// Step 3: Add modal component here
export const MODAL_COMPONENTS: TModals = {
  wallet: (props) => ModalWallet(props),
  tokenLists: (props) => ModalTokenList(props),
  txConfirm: (props) => ModalTxConfirm(props),
  createStrategy: (props) => ModalCreateStrategy(props),
};
