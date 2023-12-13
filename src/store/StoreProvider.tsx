import { ConnectionType } from 'libs/web3';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
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
  defaultStrategyToEdit,
  StrategyToEditStore,
  useStrategyToEdit,
} from 'store/useStrategyToEdit';
import {
  defaultToastStore,
  ToastStore,
  useToastStore,
} from 'store/useToasterStore';
import { DebugStore, defaultDebugStore, useDebugStore } from './useDebugStore';

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
  selectedWallet: ConnectionType | null;
  setSelectedWallet: Dispatch<SetStateAction<ConnectionType | null>>;
  strategies: StrategyToEditStore;
  toaster: ToastStore;
  debug: DebugStore;
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
  selectedWallet: null,
  setSelectedWallet: () => {},
  strategies: defaultStrategyToEdit,
  toaster: defaultToastStore,
  debug: defaultDebugStore,
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
  const [selectedWallet, setSelectedWallet] = useState<ConnectionType | null>(
    null
  );
  const sdk = useSDKStore();
  const tradeSettings = useTradeSettingsStore();
  const orderBookSettings = useOrderBookSettingsStore();
  const notifications = useNotificationsStore();
  const modals = useModalStore();
  const tokens = useTokensStore();
  const fiatCurrency = useFiatCurrencyStore();
  const strategies = useStrategyToEdit();
  const toaster = useToastStore();
  const debug = useDebugStore();

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
    selectedWallet,
    setSelectedWallet,
    strategies,
    toaster,
    debug,
  };

  return <StoreCTX.Provider value={value}>{children}</StoreCTX.Provider>;
};
