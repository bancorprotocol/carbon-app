import { Token } from 'libs/tokens';
import { FC, ReactNode } from 'react';
import { TradeContext } from './context';

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
