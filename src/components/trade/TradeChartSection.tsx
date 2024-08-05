import { TradingviewChart } from 'components/tradingviewChart';
import { useTradeCtx } from './TradeContext';

export const TradeChartSection = () => {
  const { base, quote } = useTradeCtx();
  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-background-800 flex flex-col gap-20 rounded p-20"
    >
      <header className="flex items-center justify-between">
        <h2 id="price-chart-title" className="text-18">
          Price Chart
        </h2>
        <p>Date Picker</p>
      </header>
      <TradingviewChart base={base} quote={quote} />
    </section>
  );
};
