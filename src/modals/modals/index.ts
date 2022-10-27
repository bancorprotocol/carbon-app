import { ModalWallet } from 'modals/modals/ModalWallet';
import { ModalTokenList } from 'modals/modals/ModalTokenList';
import { TModals } from 'modals/modals.types';
import {
  ModalDataExample,
  ModalDataExampleData,
} from 'modals/modals/ModalDataExample';

// Step 1: Add modal key and data type to schema
export interface ModalSchema {
  wallet: undefined;
  tokenLists: undefined;
  dataExample: ModalDataExampleData;
}

// Step 2: Create component in modals/modals folder

// Step 3: Add modal component here
export const MODAL_COMPONENTS: TModals = {
  wallet: (props) => ModalWallet(props),
  tokenLists: (props) => ModalTokenList(props),
  dataExample: (props) => ModalDataExample(props),
};
