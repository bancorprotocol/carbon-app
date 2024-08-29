import { TradingviewChart } from 'components/tradingviewChart';
import { useTradeCtx } from './TradeContext';
import { FC, ReactNode } from 'react';
import config from 'config';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';

interface Props {
  children: ReactNode;
}

export const TradeChartSection: FC<Props> = ({ children }) => {
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
      <ChartContent>{children}</ChartContent>
    </section>
  );
};

const ChartContent: FC<Props> = ({ children }) => {
  const { base, quote } = useTradeCtx();
  const priceChartType = config.ui?.priceChart ?? 'tradingView';
  const { marketPrice, isPending } = useMarketPrice({ base, quote });
  if (isPending) {
    return <CarbonLogoLoading className="h-[80px]" />;
  }
  if (!marketPrice) {
    return (
      <NotFound
        variant="info"
        title="Market Price Unavailable"
        text="Please provide a price."
      />
    );
  }
  if (priceChartType === 'tradingView') {
    return <TradingviewChart base={base} quote={quote} />;
  }
  return children;
};
