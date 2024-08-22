import { FC, ReactNode, createContext, useContext } from 'react';
import { Token } from 'libs/tokens';

const defaultToken = () => ({
  address: '',
  decimals: 0,
  symbol: '',
});

const TradeContext = createContext<{ base: Token; quote: Token }>({
  base: defaultToken(),
  quote: defaultToken(),
});

interface Props {
  base: Token;
  quote: Token;
  children: ReactNode;
}
export const TradeProvider: FC<Props> = ({ base, quote, children }) => {
  return (
    <TradeContext.Provider value={{ base, quote }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTradeCtx = () => {
  const ctx = useContext(TradeContext);
  if (!ctx) {
    throw new Error('useTradeCtx must be used within a TradeProvider');
  }
  return ctx;
};
