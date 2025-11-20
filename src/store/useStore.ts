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
  toaster: ToastStore;
}

export const defaultValue: StoreContext = {
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
  toaster: defaultToastStore,
};

export const StoreCTX = createContext(defaultValue);

export const useStore = () => {
  return useContext(StoreCTX);
};
