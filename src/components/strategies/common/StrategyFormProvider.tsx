import { Token } from 'libs/tokens';
import { FC, ReactNode } from 'react';
import { StrategyFormContext } from './StrategyFormContext';

interface Props {
  base: Token;
  quote: Token;
  marketPrice?: number;
  children: ReactNode;
}
export const StrategyFormProvider: FC<Props> = ({ children, ...value }) => {
  return (
    <StrategyFormContext.Provider value={value}>
      {children}
    </StrategyFormContext.Provider>
  );
};
