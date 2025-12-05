import { ModalProps } from 'libs/modals/modals.types';
import { lazy } from 'react';

export const MODAL_COMPONENTS = {
  wallet: lazy(() => import('libs/modals/modals/WalletModal/ModalWallet')),
  tokenLists: lazy(
    () => import('libs/modals/modals/ModalTokenList/ModalTokenList'),
  ),
  txConfirm: lazy(() => import('libs/modals/modals/ModalConfirm/ModalConfirm')),
  importToken: lazy(() => import('libs/modals/modals/ModalImportToken')),
  notifications: lazy(() => import('libs/modals/modals/ModalNotifications')),
  tradeRouting: lazy(
    () => import('libs/modals/modals/ModalTradeRouting/ModalTradeRouting'),
  ),
  burgerMenu: lazy(() => import('libs/modals/modals/ModalBurgerMenu')),
  restrictedCountry: lazy(
    () => import('libs/modals/modals/ModalRestrictedCountry'),
  ),
  genericInfo: lazy(() => import('libs/modals/modals/ModalGenericInfo')),
  duplicateStrategy: lazy(
    () =>
      import(
        'libs/modals/modals/ModalDuplicateStrategy/ModalDuplicateStrategy'
      ),
  ),
  confirmPauseStrategy: lazy(
    () => import('libs/modals/modals/ModalConfirmStrategy/ModalConfirmPause'),
  ),
  confirmWithdrawStrategy: lazy(
    () =>
      import('libs/modals/modals/ModalConfirmStrategy/ModalConfirmWithdraw'),
  ),
  confirmDeleteStrategy: lazy(
    () => import('libs/modals/modals/ModalConfirmStrategy/ModalConfirmDelete'),
  ),
  withdrawOrDelete: lazy(
    () => import('libs/modals/modals/ModalWithdrawOrDelete'),
  ),
};

type Modals = typeof MODAL_COMPONENTS;
type ExtractProps<T> =
  T extends React.LazyExoticComponent<(args: infer I) => any> ? I : never;
type ExtractModalProps<T> =
  ExtractProps<T> extends ModalProps<infer J> ? J : undefined;
export type ModalSchema = {
  [key in keyof Modals]: ExtractModalProps<Modals[key]>;
};
