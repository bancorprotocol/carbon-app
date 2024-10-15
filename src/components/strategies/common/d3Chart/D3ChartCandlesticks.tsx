import { D3ChartHandleLine } from 'components/strategies/common/d3Chart/D3ChartHandleLine';
import { D3ChartRecurring } from 'components/strategies/common/d3Chart/recurring/D3ChartRecurring';
import { D3ChartOverlapping } from 'components/strategies/common/d3Chart/overlapping/D3ChartOverlapping';
import { getDomain } from 'components/strategies/common/d3Chart/utils';
import { XAxis } from 'components/strategies/common/d3Chart/xAxis';
import {
  D3YAxisRight,
  useLinearScale,
  CandlestickData,
  scaleBand,
  D3ChartSettings,
} from 'libs/d3';
import { useMemo, useState } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { Candlesticks } from 'components/strategies/common/d3Chart/Candlesticks';
import { D3ChartDisposable } from './disposable/D3ChartDisposable';
import { TradeTypes } from 'libs/routing/routes/trade';
import { Activity } from 'libs/queries/extApi/activity';
import { D3ChartIndicators } from './D3ChartIndicators';
import { D3ZoomEvent, ZoomTransform, select, zoom } from 'd3';
import { D3Pointer } from './D3Pointer';

export type ChartPrices<T = string> = {
  buy: { min: T; max: T };
  sell: { min: T; max: T };
};

export type OnPriceUpdates = (props: ChartPrices) => void;

export interface D3ChartCandlesticksProps {
  className?: string;
  data: CandlestickData[];
  prices: ChartPrices;
  onPriceUpdates: OnPriceUpdates;
  marketPrice?: number;
  bounds: ChartPrices;
  onDragEnd?: OnPriceUpdates;
  isLimit?: { buy: boolean; sell: boolean };
  dms: D3ChartSettings;
  type: TradeTypes;
  overlappingSpread?: string;
  overlappingMarketPrice?: number;
  readonly?: boolean;
  activities?: Activity[];
}

const useZoom = (dms: D3ChartSettings, data: CandlestickData[]) => {
  const [transform, setTransform] = useState<ZoomTransform>();
  let k = 0;
  const selection = select<SVGSVGElement, unknown>('#interactive-chart');
  const chartArea = select<SVGSVGElement, unknown>('.chart-area');
  const zoomHandler = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, Math.ceil(data.length / 10)])
    .translateExtent([
      [-0.5 * dms.width, 0],
      [1.5 * dms.width, 0],
    ])
    .on('start', (e: D3ZoomEvent<Element, any>) => (k = e.transform.k))
    .on('zoom', (e: D3ZoomEvent<Element, any>) => {
      if (e.transform.k === k) chartArea.style('cursor', 'grab');
      setTransform(e.transform);
    })
    .on('end', () => chartArea.style('cursor', ''));
  selection.call(zoomHandler);
  return transform;
};

const getDateRange = (range: number[]) => {
  if (!range.length) return [];
  const points: string[] = [];
  const first = range[0];
  const step = range[1] - first;
  const start = Math.floor(-0.5 * range.length);
  const end = Math.ceil(range.length * 1.5);
  for (let i = start; i < end; i++) {
    points.push((first + i * step).toString());
  }
  return points;
};

export const D3ChartCandlesticks = (props: D3ChartCandlesticksProps) => {
  const {
    data,
    prices,
    onPriceUpdates,
    marketPrice,
    bounds,
    onDragEnd,
    isLimit,
    dms,
    type,
    overlappingSpread,
    overlappingMarketPrice,
    readonly,
    activities,
  } = props;

  const zoomTransform = useZoom(dms, data);

  const xScale = useMemo(() => {
    const zoomX = (d: number) => (zoomTransform ? zoomTransform.applyX(d) : d);
    return scaleBand()
      .domain(getDateRange(data.map((d) => d.date)))
      .range([dms.boundedWidth * -0.5, dms.boundedWidth * 1.5].map(zoomX))
      .paddingInner(0.5);
  }, [data, dms.boundedWidth, zoomTransform]);

  const xTicks = useMemo(() => {
    const length = xScale.domain().length;
    const ratio = Math.ceil(zoomTransform?.k ?? 1);
    const target = Math.floor((dms.boundedWidth * ratio) / 80);
    const numberOfTicks = Math.max(1, target);
    const m = Math.ceil(length / numberOfTicks);
    return xScale.domain().filter((_, i) => i % m === m - 1);
  }, [dms.boundedWidth, xScale, zoomTransform]);

  const yDomain = useMemo(() => {
    const candles = data.filter((point) => xScale(point.date.toString())! > 0);
    return getDomain(candles, bounds, marketPrice);
  }, [bounds, data, marketPrice, xScale]);

  const y = useLinearScale({
    domain: yDomain,
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.1,
  });

  if (!dms.width || !dms.height) return null;
  return (
    <>
      <Candlesticks xScale={xScale} yScale={y.scale} data={data} />
      <D3Pointer xScale={xScale} yScale={y.scale} dms={dms} />
      <rect
        className="chart-area cursor-crosshair"
        x="0"
        y="0"
        width={dms.boundedWidth}
        height={dms.boundedHeight}
        fillOpacity="0"
      />
      {activities?.length && (
        <D3ChartIndicators
          xScale={xScale}
          yScale={y.scale}
          boundHeight={dms.boundedHeight}
          activities={activities}
        />
      )}
      <XAxis xScale={xScale} dms={dms} xTicks={xTicks} />
      <D3YAxisRight
        ticks={y.ticks}
        dms={dms}
        formatter={(value) => {
          return prettifyNumber(value, { decimals: 100, abbreviate: true });
        }}
      />
      {marketPrice && (
        <D3ChartHandleLine
          dms={dms}
          color="white"
          y={y.scale(marketPrice)}
          lineProps={{ strokeDasharray: 2 }}
          label={prettifyNumber(marketPrice ?? '', { decimals: 4 })}
        />
      )}
      {type === 'disposable' && isLimit && (
        <D3ChartDisposable
          readonly={readonly}
          yScale={y.scale}
          isLimit={isLimit}
          dms={dms}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
        />
      )}
      {type === 'recurring' && isLimit && (
        <D3ChartRecurring
          readonly={readonly}
          yScale={y.scale}
          isLimit={isLimit}
          dms={dms}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
        />
      )}
      {type === 'overlapping' && overlappingSpread !== undefined && (
        <D3ChartOverlapping
          readonly={readonly}
          yScale={y.scale}
          dms={dms}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
          marketPrice={overlappingMarketPrice ?? data[0].open ?? 0}
          spread={Number(overlappingSpread)}
        />
      )}
    </>
  );
};
