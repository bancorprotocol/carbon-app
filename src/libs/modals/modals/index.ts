import {
  ModalWithdrawOrDelete,
  ModalWithdrawOrDeleteData,
} from 'libs/modals/modals/ModalWithdrawOrDelete';
import { ModalWallet } from 'libs/modals/modals/WalletModal/ModalWallet';
import {
  ModalTokenList,
  ModalTokenListData,
} from 'libs/modals/modals/ModalTokenList';
import { TModals } from 'libs/modals/modals.types';
import {
  ModalConfirm,
  ModalCreateConfirmData,
} from 'libs/modals/modals/ModalConfirm/ModalConfirm';
import {
  ModalImportToken,
  ModalImportTokenData,
} from 'libs/modals/modals/ModalImportToken';
import { ModalNotifications } from 'libs/modals/modals/ModalNotifications';
import {
  ModalTradeTokenList,
  ModalTradeTokenListData,
} from 'libs/modals/modals/ModalTradeTokenList';
import { ModalTradeSettings } from 'libs/modals/modals/ModalTradeSettings';

import {
  ModalTradeRouting,
  ModalTradeRoutingData,
} from 'libs/modals/modals/ModalTradeRouting/ModalTradeRouting';
import {
  ModalConfirmPause,
  ModalConfirmPauseData,
} from 'libs/modals/modals/ModalConfirmStrategy/ModalConfirmPause';
import { ModalBurgerMenu } from 'libs/modals/modals/ModalBurgerMenu';
import { ModalRestrictedCountry } from 'libs/modals/modals/ModalRestrictedCountry';
import {
  ModalGenericInfo,
  ModalGenericInfoData,
} from 'libs/modals/modals/ModalGenericInfo';
import {
  ModalDuplicateStrategy,
  ModalDuplicateStrategyData,
} from 'libs/modals/modals/ModalDuplicateStrategy/ModalDuplicateStrategy';
import {
  ModalConfirmWithdraw,
  ModalConfirmWithdrawData,
} from 'libs/modals/modals/ModalConfirmStrategy/ModalConfirmWithdraw';
import {
  ModalConfirmDelete,
  ModalConfirmDeleteData,
} from 'libs/modals/modals/ModalConfirmStrategy/ModalConfirmDelete';
import {
  ModalSimulatorDisclaimer,
  ModalSimulatorDisclaimerData,
} from 'libs/modals/modals/ModalSimulatorDisclaimer';

// Step 1: Add modal key and data type to schema
export interface ModalSchema {
  wallet: undefined;
  tokenLists: ModalTokenListData;
  tradeTokenList: ModalTradeTokenListData;
  txConfirm: ModalCreateConfirmData;
  importToken: ModalImportTokenData;
  notifications: undefined;
  tradeSettings: undefined;
  tradeRouting: ModalTradeRoutingData;
  burgerMenu: undefined;
  restrictedCountry: undefined;
  genericInfo: ModalGenericInfoData;
  duplicateStrategy: ModalDuplicateStrategyData;
  confirmPauseStrategy: ModalConfirmPauseData;
  confirmWithdrawStrategy: ModalConfirmWithdrawData;
  confirmDeleteStrategy: ModalConfirmDeleteData;
  simulatorDisclaimer: ModalSimulatorDisclaimerData;
  withdrawOrDelete: ModalWithdrawOrDeleteData;
}

// Step 2: Create component in modals/modals folder

// Step 3: Add modal component here
export const MODAL_COMPONENTS: TModals = {
  wallet: (props) => ModalWallet(props),
  tokenLists: (props) => ModalTokenList(props),
  txConfirm: (props) => ModalConfirm(props),
  importToken: (props) => ModalImportToken(props),
  notifications: (props) => ModalNotifications(props),
  tradeTokenList: (props) => ModalTradeTokenList(props),
  tradeSettings: (props) => ModalTradeSettings(props),
  tradeRouting: (props) => ModalTradeRouting(props),
  burgerMenu: (props) => ModalBurgerMenu(props),
  restrictedCountry: (props) => ModalRestrictedCountry(props),
  genericInfo: (props) => ModalGenericInfo(props),
  duplicateStrategy: (props) => ModalDuplicateStrategy(props),
  confirmPauseStrategy: (props) => ModalConfirmPause(props),
  confirmWithdrawStrategy: (props) => ModalConfirmWithdraw(props),
  confirmDeleteStrategy: (props) => ModalConfirmDelete(props),
  simulatorDisclaimer: (props) => ModalSimulatorDisclaimer(props),
  withdrawOrDelete: (props) => ModalWithdrawOrDelete(props),
};
