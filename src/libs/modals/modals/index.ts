import {
  ModalWithdrawOrDelete,
  ModalWithdrawOrDeleteData,
} from 'libs/modals/modals/ModalWithdrawOrDelete';
import { ModalWallet } from 'libs/modals/modals/WalletModal/ModalWallet';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList/types';
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
import { lazy } from 'react';

// Step 1: Add modal key and data type to schema
export interface ModalSchema {
  wallet: undefined;
  tokenLists: ModalTokenListData;
  txConfirm: ModalCreateConfirmData;
  importToken: ModalImportTokenData;
  notifications: undefined;
  tradeRouting: ModalTradeRoutingData;
  burgerMenu: undefined;
  restrictedCountry: undefined;
  genericInfo: ModalGenericInfoData;
  duplicateStrategy: ModalDuplicateStrategyData;
  confirmPauseStrategy: ModalConfirmPauseData;
  confirmWithdrawStrategy: ModalConfirmWithdrawData;
  confirmDeleteStrategy: ModalConfirmDeleteData;
  withdrawOrDelete: ModalWithdrawOrDeleteData;
}

// Step 2: Create component in modals/modals folder

// Step 3: Add modal component here
export const MODAL_COMPONENTS: TModals = {
  wallet: (props) => ModalWallet(props),
  tokenLists: lazy(
    () => import('libs/modals/modals/ModalTokenList/ModalTokenList'),
  ),
  txConfirm: (props) => ModalConfirm(props),
  importToken: (props) => ModalImportToken(props),
  notifications: (props) => ModalNotifications(props),
  tradeRouting: (props) => ModalTradeRouting(props),
  burgerMenu: (props) => ModalBurgerMenu(props),
  restrictedCountry: (props) => ModalRestrictedCountry(props),
  genericInfo: (props) => ModalGenericInfo(props),
  duplicateStrategy: (props) => ModalDuplicateStrategy(props),
  confirmPauseStrategy: (props) => ModalConfirmPause(props),
  confirmWithdrawStrategy: (props) => ModalConfirmWithdraw(props),
  confirmDeleteStrategy: (props) => ModalConfirmDelete(props),
  withdrawOrDelete: (props) => ModalWithdrawOrDelete(props),
};
