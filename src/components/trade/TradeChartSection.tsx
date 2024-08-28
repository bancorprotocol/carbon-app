import { TradingviewChart } from 'components/tradingviewChart';
import { useTradeCtx } from './TradeContext';
import { FC, ReactNode } from 'react';
import config from 'config';

interface Props {
  children: ReactNode;
}

export const TradeChartSection: FC<Props> = ({ children }) => {
  const { base, quote } = useTradeCtx();
  const chartType = config.ui?.priceChart ?? 'tradingView';
  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-background-900 sticky top-[80px] flex max-h-[600px] min-h-[400px] flex-col gap-20 rounded p-20"
    >
      <header className="flex items-center justify-between">
        <h2 id="price-chart-title" className="text-18">
          Price Chart
        </h2>
      </header>
      {chartType === 'tradingView' && (
        <TradingviewChart base={base} quote={quote} />
      )}
      {chartType === 'native' && children}
    </section>
  );
};
