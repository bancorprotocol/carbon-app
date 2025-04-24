import { D3ChartHandleLine } from 'components/strategies/common/d3Chart/D3ChartHandleLine';
import { D3ChartRecurring } from 'components/strategies/common/d3Chart/recurring/D3ChartRecurring';
import { D3ChartOverlapping } from 'components/strategies/common/d3Chart/overlapping/D3ChartOverlapping';
import { XAxis } from 'components/strategies/common/d3Chart/xAxis';
import { D3YAxisRight, CandlestickData, D3AxisTick } from 'libs/d3';
import { prettifyNumber } from 'utils/helpers';
import { Candlesticks } from 'components/strategies/common/d3Chart/Candlesticks';
import { D3ChartDisposable } from './disposable/D3ChartDisposable';
import { TradeTypes } from 'libs/routing/routes/trade';
import { Activity } from 'libs/queries/extApi/activity';
import { D3ChartIndicators } from './D3ChartIndicators';
import { D3Pointer } from './D3Pointer';
import { D3Drawings } from './drawing/D3Drawings';
import { useD3ChartCtx } from './D3ChartContext';
import { D3AllDrawingRanges } from './drawing/D3DrawingRanges';
import { D3PricesAxis } from './D3PriceAxis';

export type ChartPrices<T = string> = {
  buy: { min: T; max: T };
  sell: { min: T; max: T };
};

export type OnPriceUpdates = (props: ChartPrices) => void;

export interface D3ChartCandlesticksProps {
  className?: string;
  data: CandlestickData[];
  prices: ChartPrices;
  onPriceUpdates?: OnPriceUpdates;
  marketPrice?: number;
  onDragEnd?: OnPriceUpdates;
  isLimit?: { buy: boolean; sell: boolean };
  type: TradeTypes;
  overlappingSpread?: string;
  overlappingMarketPrice?: number;
  readonly?: boolean;
  activities?: Activity[];
  yTicks: D3AxisTick[];
}

export const D3ChartCandlesticks = (props: D3ChartCandlesticksProps) => {
  const {
    data,
    prices,
    onPriceUpdates,
    marketPrice,
    onDragEnd,
    isLimit,
    type,
    overlappingSpread,
    overlappingMarketPrice,
    readonly,
    activities,
    yTicks,
  } = props;

  const { dms, yScale } = useD3ChartCtx();

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
      {activities?.length && <D3ChartIndicators activities={activities} />}

      {type === 'disposable' && isLimit && (
        <D3ChartDisposable
          readonly={readonly}
          isLimit={isLimit}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
        />
      )}
      {type === 'recurring' && isLimit && (
        <D3ChartRecurring
          readonly={readonly}
          isLimit={isLimit}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
        />
      )}
      {type === 'overlapping' && overlappingSpread !== undefined && (
        <D3ChartOverlapping
          readonly={readonly}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
          marketPrice={overlappingMarketPrice ?? data[0].open ?? 0}
          spread={Number(overlappingSpread)}
        />
      )}
      <D3Drawings />
      <XAxis />
      <D3YAxisRight
        ticks={yTicks}
        dms={dms}
        formatter={(value) => {
          return prettifyNumber(value, { abbreviate: true });
        }}
      />
      {marketPrice && (
        <D3ChartHandleLine
          color="white"
          y={yScale(marketPrice)}
          lineProps={{ strokeDasharray: 2 }}
          label={prettifyNumber(marketPrice ?? '', { abbreviate: true })}
          className="pointer-events-none"
        />
      )}
      <D3PricesAxis prices={prices} />
      <D3AllDrawingRanges />
      <D3Pointer />
    </>
  );
};
