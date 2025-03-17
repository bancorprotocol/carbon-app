import { FC, ReactNode } from 'react';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { TradeNav } from './TradeNav';

interface Props {
  children: ReactNode;
}

export const TradeLayout: FC<Props> = ({ children }) => {
  return (
    <section className="grid content-start">
      <TokenSelection />
      <TradeNav />
      {children}
    </section>
  );
};
