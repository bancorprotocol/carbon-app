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

const useZoom = (dms: D3ChartSettings) => {
  const [transform, setTransform] = useState<ZoomTransform>();
  const selection = select<SVGSVGElement, unknown>('#interactive-chart');
  const zoomHandler = zoom<SVGSVGElement, unknown>()
    .scaleExtent([1, 32])
    .translateExtent([
      [0, 0],
      [dms.width, 0],
    ])
    .on('zoom', (e: D3ZoomEvent<Element, any>) => setTransform(e.transform));
  selection.call(zoomHandler);
  return transform;
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

  const zoomTransform = useZoom(dms);

  const xScale = useMemo(() => {
    const zoomX = (d: number) => (zoomTransform ? zoomTransform.applyX(d) : d);
    return scaleBand()
      .domain(data.map((d) => d.date.toString()))
      .range([0, dms.boundedWidth].map(zoomX))
      .paddingInner(0.5);
  }, [data, dms.boundedWidth, zoomTransform]);

  const xTicks = useMemo(() => {
    const length = xScale.domain().length;
    // We need to keep even ratio to insert new ticks instead of switching them
    const ratio = (() => {
      if (!zoomTransform) return 1;
      const base = Math.floor(zoomTransform.k);
      if (base < 2) return 1;
      if (base % 2 === 0) return base;
      return base - (base % 2);
    })();
    const target = Math.floor((dms.boundedWidth * ratio) / 80);
    const numberOfTicks = Math.max(1, target);
    const m = Math.ceil(length / numberOfTicks);
    return xScale.domain().filter((_, i) => i % m === m - 1);
  }, [dms.boundedWidth, xScale, zoomTransform]);

  const y = useLinearScale({
    domain: getDomain(data, bounds, marketPrice),
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.1,
  });

  if (!dms.width || !dms.height) return null;
  return (
    <>
      <Candlesticks xScale={xScale} yScale={y.scale} data={data} />
      <D3YAxisRight
        ticks={y.ticks}
        dms={dms}
        formatter={(value) => {
          return prettifyNumber(value, { decimals: 100, abbreviate: true });
        }}
      />
      <XAxis xScale={xScale} dms={dms} xTicks={xTicks} />
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
      {activities?.length && (
        <D3ChartIndicators
          xScale={xScale}
          yScale={y.scale}
          boundHeight={dms.boundedHeight}
          activities={activities}
        />
      )}
    </>
  );
};
