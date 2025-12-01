import { FC, ReactNode, useState } from 'react';
import { useTradeSettingsStore } from 'store/useTradeSettingsStore';
import { useNotificationsStore } from 'store/useNotificationsStore';
import { useModalStore } from 'store/useModalStore';
import { useTokensStore } from 'store/useTokensStore';
import { useOrderBookSettingsStore } from 'store/useOrderBookSettingsStore';
import { useToastStore } from 'store/useToasterStore';
import { StoreContext, StoreCTX } from './useStore';

// ********************************** //
// STORE PROVIDER
// ********************************** //

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [countryBlocked, setCountryBlocked] = useState<boolean | null>(null);
  const tradeSettings = useTradeSettingsStore();
  const orderBookSettings = useOrderBookSettingsStore();
  const notifications = useNotificationsStore();
  const modals = useModalStore();
  const tokens = useTokensStore();
  const toaster = useToastStore();

  const value: StoreContext = {
    isCountryBlocked: countryBlocked,
    setCountryBlocked,
    tokens,
    notifications,
    modals,
    trade: {
      settings: tradeSettings,
    },
    orderBook: {
      settings: orderBookSettings,
    },
    toaster,
  };

  return <StoreCTX.Provider value={value}>{children}</StoreCTX.Provider>;
};
