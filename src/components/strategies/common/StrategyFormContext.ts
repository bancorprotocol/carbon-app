import { createContext, useContext } from 'react';
import { Token } from 'libs/tokens';

const defaultToken = () => ({
  address: '',
  decimals: 0,
  symbol: '',
});

interface TradeProps {
  base: Token;
  quote: Token;
  marketPrice?: number;
}

export const StrategyFormContext = createContext<TradeProps>({
  base: defaultToken(),
  quote: defaultToken(),
});

export const useStrategyFormCtx = () => {
  const ctx = useContext(StrategyFormContext);
  if (!ctx) {
    throw new Error('useTradeCtx must be used within a TradeProvider');
  }
  return ctx;
};
