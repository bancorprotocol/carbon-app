import { useTradeCtx } from './TradeContext';
import { FC, ReactNode } from 'react';
import { TradingviewChart } from 'components/tradingviewChart';

interface Props {
  children?: ReactNode;
}

export const TradeOverlappingChart: FC<Props> = (props) => {
  const { base, quote } = useTradeCtx();
  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-background-900 flex flex-col gap-20 rounded p-20"
    >
      <header className="flex items-center justify-between">
        <h2 id="price-chart-title" className="text-18">
          Price Chart
        </h2>
        {props.children}
      </header>
      <TradingviewChart base={base} quote={quote} />
    </section>
  );
};
