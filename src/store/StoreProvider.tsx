import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { lsService } from 'services/localeStorage';
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
  defaultOrderBookSettingsStore,
  OrderBookSettingsStore,
  useOrderBookSettingsStore,
} from 'store/useOrderBookSettingsStore';
import {
  defaultToastStore,
  ToastStore,
  useToastStore,
} from 'store/useToasterStore';

// ********************************** //
// STORE CONTEXT
// ********************************** //

interface StoreContext {
  isCountryBlocked: boolean | null;
  setCountryBlocked: (value: boolean | null) => void;
  sdk: SDKStore;
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
  simDisclaimerLastSeen?: number;
  setSimDisclaimerLastSeen: (value?: number) => void;
}

const defaultValue: StoreContext = {
  isCountryBlocked: null,
  setCountryBlocked: () => {},
  sdk: defaultSDKStore,
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
  simDisclaimerLastSeen: undefined,
  setSimDisclaimerLastSeen: () => {},
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
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);
  const sdk = useSDKStore();
  const tradeSettings = useTradeSettingsStore();
  const orderBookSettings = useOrderBookSettingsStore();
  const notifications = useNotificationsStore();
  const modals = useModalStore();
  const tokens = useTokensStore();
  const fiatCurrency = useFiatCurrencyStore();
  const toaster = useToastStore();

  const [simDisclaimerLastSeen, _setSimDisclaimerLastSeen] = useState<
    number | undefined
  >(lsService.getItem('simDisclaimerLastSeen'));

  const setSimDisclaimerLastSeen = useCallback((value?: number) => {
    _setSimDisclaimerLastSeen(value);
    if (value) {
      lsService.setItem('simDisclaimerLastSeen', value);
    } else {
      lsService.removeItem('simDisclaimerLastSeen');
    }
  }, []);

  const value: StoreContext = {
    isCountryBlocked: countryBlocked,
    setCountryBlocked,
    sdk,
    tokens,
    notifications,
    modals,
    trade: {
      settings: tradeSettings,
    },
    orderBook: {
      settings: orderBookSettings,
    },
    fiatCurrency,
    innerHeight,
    setInnerHeight,
    toaster,
    simDisclaimerLastSeen,
    setSimDisclaimerLastSeen,
  };

  return <StoreCTX.Provider value={value}>{children}</StoreCTX.Provider>;
};
