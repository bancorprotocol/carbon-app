import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const StrategyChartSection: FC<Props> = ({ children }) => {
  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-background-900 sticky top-[80px] flex h-[600px] flex-col gap-20 rounded p-20"
    >
      <header className="flex items-center justify-between gap-20">
        <h2 id="price-chart-title" className="text-18">
          Price Chart
        </h2>
      </header>
      {children}
    </section>
  );
};
