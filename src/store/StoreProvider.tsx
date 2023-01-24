import { createContext, FC, ReactNode, useContext } from 'react';
import {
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
    settings: {
      slippage: '',
      setSlippage: () => {},
      deadline: '',
      setDeadline: () => {},
      maxOrders: '',
      setMaxOrders: () => {},
    },
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
