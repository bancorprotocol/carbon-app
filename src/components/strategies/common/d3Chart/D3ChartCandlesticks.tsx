import { CandlestickData } from 'libs/d3';
import { Candlesticks } from 'components/strategies/common/d3Chart/Candlesticks';
import { D3Pointer } from './D3Pointer';
import { useD3ChartCtx } from './D3ChartContext';
import { D3AllDrawingRanges } from './drawing/D3DrawingRanges';
import { ReactNode } from 'react';

export type ChartPrices<T = string> = {
  buy: { min: T; max: T };
  sell: { min: T; max: T };
};

export type OnPriceUpdates = (props: ChartPrices) => void;

export interface D3ChartCandlesticksProps {
  className?: string;
  data: CandlestickData[];
  children: ReactNode;
}

export const D3ChartCandlesticks = (props: D3ChartCandlesticksProps) => {
  const { data, children } = props;

  const { dms } = useD3ChartCtx();

  if (!dms.width || !dms.height) return null;
  return (
    <>
      <Candlesticks data={data} />
      <rect
        className="chart-area cursor-crosshair"
        x="0"
        y="0"
        width={dms.boundedWidth}
        height={dms.boundedHeight}
        fillOpacity="0"
      />
      {children}
      <D3AllDrawingRanges />
      <D3Pointer />
    </>
  );
};
