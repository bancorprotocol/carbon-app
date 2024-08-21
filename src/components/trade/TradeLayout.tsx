import { FC, ReactNode } from 'react';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { TradeNav } from './TradeNav';

interface Props {
  children: ReactNode;
}

export const TradeLayout: FC<Props> = ({ children }) => {
  return (
    <section className="flex flex-col gap-20">
      <TokenSelection />
      <TradeNav />
      {children}
    </section>
  );
};
