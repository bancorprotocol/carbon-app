import { D3ChartHandleLine } from 'components/simulator/input/d3Chart/D3ChartHandleLine';
import { D3ChartRecurring } from 'components/simulator/input/d3Chart/recurring/D3ChartRecurring';
import { D3ChartOverlapping } from 'components/simulator/input/d3Chart/overlapping/D3ChartOverlapping';
import { getDomain } from 'components/simulator/input/d3Chart/utils';
import { XAxis } from 'components/simulator/input/d3Chart/xAxis';
import {
  D3YAxisRight,
  useLinearScale,
  CandlestickData,
  scaleBand,
  D3ChartSettings,
} from 'libs/d3';
import { SimulatorType } from 'libs/routing/routes/sim';
import { useMemo } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { Candlesticks } from 'components/simulator/input/d3Chart/Candlesticks';

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
  type: SimulatorType;
  overlappingSpread?: string;
}

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
  } = props;

  const xScale = useMemo(
    () =>
      scaleBand()
        .domain(data.map((d) => d.date.toString()))
        .range([0, dms.boundedWidth])
        .paddingInner(0.5),
    [data, dms.boundedWidth]
  );

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
        formatter={(value) => prettifyNumber(value)}
      />
      <XAxis xScale={xScale} dms={dms} />
      {marketPrice && (
        <D3ChartHandleLine
          dms={dms}
          color="white"
          y={y.scale(marketPrice)}
          lineProps={{ strokeDasharray: 2 }}
          label={prettifyNumber(marketPrice ?? '')}
        />
      )}
      {type === 'recurring' && isLimit && (
        <D3ChartRecurring
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
          yScale={y.scale}
          dms={dms}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
          marketPrice={data[0].open ?? 0}
          spread={Number(overlappingSpread)}
        />
      )}
    </>
  );
};
