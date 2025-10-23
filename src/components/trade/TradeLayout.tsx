import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const TradeLayout: FC<Props> = ({ children }) => {
  return (
    <section className="grid content-start grid-area-[form] animate-scale-up">
      {/* @todo(gradient) */}
      {/* <TradeType /> */}
      {children}
    </section>
  );
};
