import { createContext, useContext } from 'react';
import { Token } from 'libs/tokens';

const defaultToken = () => ({
  address: '',
  decimals: 0,
  symbol: '',
});

export const TradeContext = createContext<{ base: Token; quote: Token }>({
  base: defaultToken(),
  quote: defaultToken(),
});

export const useTradeCtx = () => {
  const ctx = useContext(TradeContext);
  if (!ctx) {
    throw new Error('useTradeCtx must be used within a TradeProvider');
  }
  return ctx;
};
