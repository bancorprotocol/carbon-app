import { createContext, FC, ReactNode, useContext, useState } from 'react';
import {
  defaultTradeSettingsStore,
  TradeSettingsStore,
  useTradeSettingsStore,
} from 'store/useTradeSettingsStore';
import {
  defaultNotificationsStore,
  NotificationsStore,
  useNotificationsStore,
} from 'store/useNotificationsStore';
import {
  defaultModalStore,
  ModalStore,
  useModalStore,
} from 'store/useModalStore';
import {
  defaultTokensStore,
  TokensStore,
  useTokensStore,
} from 'store/useTokensStore';
import { defaultSDKStore, SDKStore, useSDKStore } from 'store/useSDKStore';
import {
  defaultFiatCurrencyStore,
  FiatCurrencyStore,
  useFiatCurrencyStore,
} from 'store/useFiatCurrencyStore';
import {
  defaultStrategiesStore,
  StrategiesStore,
  useStrategiesStore,
} from './useStrategiesStore';
import {
  defaultOrderBookSettingsStore,
  OrderBookSettingsStore,
  useOrderBookSettingsStore,
} from 'store/useOrderBookSettingsStore';

// ********************************** //
// STORE CONTEXT
// ********************************** //

interface StoreContext {
  isCountryBlocked: boolean | null;
  setCountryBlocked: (value: boolean | null) => void;
  sdk: SDKStore;
  tokens: TokensStore;
  strategies: StrategiesStore;
  notifications: NotificationsStore;
  modals: ModalStore;
  trade: {
    settings: TradeSettingsStore;
  };
  orderBook: {
    settings: OrderBookSettingsStore;
  };
  fiatCurrency: FiatCurrencyStore;
}

const defaultValue: StoreContext = {
  isCountryBlocked: null,
  setCountryBlocked: () => {},
  sdk: defaultSDKStore,
  tokens: defaultTokensStore,
  strategies: defaultStrategiesStore,
  notifications: defaultNotificationsStore,
  modals: defaultModalStore,
  trade: {
    settings: defaultTradeSettingsStore,
  },
  orderBook: {
    settings: defaultOrderBookSettingsStore,
  },
  fiatCurrency: defaultFiatCurrencyStore,
};

const StoreCTX = createContext(defaultValue);

export const useStore = () => {
  return useContext(StoreCTX);
};

// ********************************** //
// STORE PROVIDER
// ********************************** //

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [countryBlocked, setCountryBlocked] = useState<boolean | null>(null);
  const sdk = useSDKStore();
  const tradeSettings = useTradeSettingsStore();
  const orderBookSettings = useOrderBookSettingsStore();
  const notifications = useNotificationsStore();
  const modals = useModalStore();
  const tokens = useTokensStore();
  const fiatCurrency = useFiatCurrencyStore();
  const strategies = useStrategiesStore();

  const value: StoreContext = {
    isCountryBlocked: countryBlocked,
    setCountryBlocked,
    sdk,
    tokens,
    strategies,
    notifications,
    modals,
    trade: {
      settings: tradeSettings,
    },
    orderBook: {
      settings: orderBookSettings,
    },
    fiatCurrency,
  };

  return <StoreCTX.Provider value={value}>{children}</StoreCTX.Provider>;
};
