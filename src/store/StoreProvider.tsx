import { createContext, FC, ReactNode, useContext } from 'react';
import {
  defaultTradeSettingsStore,
  TradeSettingsStore,
  useTradeSettingsStore,
} from 'store/useTradeSettingsStore';

// ********************************** //
// STORE CONTEXT
// ********************************** //

interface StoreContext {
  trade: {
    settings: TradeSettingsStore;
  };
}

const defaultValue: StoreContext = {
  trade: {
    settings: defaultTradeSettingsStore,
  },
};

const StoreCTX = createContext(defaultValue);

export const useStore = () => {
  return useContext(StoreCTX);
};

// ********************************** //
// STORE PROVIDER
// ********************************** //

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const tradeSettings = useTradeSettingsStore();

  const value: StoreContext = {
    trade: {
      settings: tradeSettings,
    },
  };

  return <StoreCTX.Provider value={value}>{children}</StoreCTX.Provider>;
};
