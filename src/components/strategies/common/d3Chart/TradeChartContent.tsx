import { useTradeCtx } from 'components/trade/TradeContext';
import { D3Drawings } from './drawing/D3Drawings';
import { D3XAxis } from './D3XAxis';
import { D3YAxis } from './D3YAxis';
import { D3ChartMarketPrice } from './D3ChartMarketPrice';
import { useStrategyMarketPrice } from 'components/strategies/UserMarketPrice';

export const TradeChartContent = () => {
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useStrategyMarketPrice({ base, quote });
  return (
    <>
      <D3Drawings />
      <D3XAxis />
      <D3YAxis />
      <D3ChartMarketPrice marketPrice={Number(marketPrice)} />
    </>
  );
};
