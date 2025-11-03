import { createContext, useContext } from 'react';
import {
  defaultTradeSettingsStore,
  TradeSettingsStore,
} from 'store/useTradeSettingsStore';
import {
  defaultNotificationsStore,
  NotificationsStore,
} from 'store/useNotificationsStore';
import { defaultModalStore, ModalStore } from 'store/useModalStore';
import { defaultTokensStore, TokensStore } from 'store/useTokensStore';
import {
  defaultFiatCurrencyStore,
  FiatCurrencyStore,
} from 'store/useFiatCurrencyStore';
import {
  defaultOrderBookSettingsStore,
  OrderBookSettingsStore,
} from 'store/useOrderBookSettingsStore';
import { defaultToastStore, ToastStore } from 'store/useToasterStore';

// ********************************** //
// STORE CONTEXT
// ********************************** //

export interface StoreContext {
  isCountryBlocked: boolean | null;
  setCountryBlocked: (value: boolean | null) => void;
  tokens: TokensStore;
  notifications: NotificationsStore;
  modals: ModalStore;
  trade: {
    settings: TradeSettingsStore;
  };
  orderBook: {
    settings: OrderBookSettingsStore;
  };
  fiatCurrency: FiatCurrencyStore;
  innerHeight: number;
  setInnerHeight: (value: number) => void;
  toaster: ToastStore;
}

export const defaultValue: StoreContext = {
  isCountryBlocked: null,
  setCountryBlocked: () => {},
  tokens: defaultTokensStore,
  notifications: defaultNotificationsStore,
  modals: defaultModalStore,
  trade: {
    settings: defaultTradeSettingsStore,
  },
  orderBook: {
    settings: defaultOrderBookSettingsStore,
  },
  fiatCurrency: defaultFiatCurrencyStore,
  innerHeight: 0,
  setInnerHeight: () => {},
  toaster: defaultToastStore,
};

export const StoreCTX = createContext(defaultValue);

export const useStore = () => {
  return useContext(StoreCTX);
};
