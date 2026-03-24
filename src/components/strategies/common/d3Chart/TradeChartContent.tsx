import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { D3Drawings } from './drawing/D3Drawings';
import { D3XAxis } from './D3XAxis';
import { D3YAxis } from './D3YAxis';
import { D3ChartMarketPrice } from './D3ChartMarketPrice';

export const TradeChartContent = () => {
  const { marketPrice } = useStrategyFormCtx();
  return (
    <>
      <D3Drawings />
      <D3XAxis />
      <D3YAxis />
      <D3ChartMarketPrice marketPrice={marketPrice} />
    </>
  );
};
