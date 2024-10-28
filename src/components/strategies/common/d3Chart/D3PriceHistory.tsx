import {
  CandlestickData,
  D3ChartSettings,
  D3ChartSettingsProps,
  useChartDimensions,
  useLinearScale,
} from 'libs/d3';
import { D3ChartProvider } from './D3ChartContext';
import { DrawingMenu, DrawingMode } from './drawing/DrawingMenu';
import {
  ChartPrices,
  D3ChartCandlesticks,
  OnPriceUpdates,
} from './D3ChartCandlesticks';
import { FC, useMemo, useState } from 'react';
import {
  D3ZoomEvent,
  scaleBand,
  select,
  zoom,
  zoomIdentity,
  ZoomTransform,
} from 'd3';
import { TradeTypes } from 'libs/routing/routes/trade';
import { Activity } from 'libs/queries/extApi/activity';
import { getDomain } from './utils';
import { cn } from 'utils/helpers';
import style from './D3PriceHistory.module.css';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 80,
};

const useZoom = (dms: D3ChartSettings, data: CandlestickData[]) => {
  const [transform, setTransform] = useState<ZoomTransform>();
  const baseXScale = scaleBand()
    .domain(getDateRange(data.map((d) => d.date)))
    .range([dms.boundedWidth * -0.5, dms.boundedWidth * 1.5])
    .paddingInner(0.5);

  let k = 0;
  const selection = select<SVGSVGElement, unknown>('#interactive-chart');
  const chartArea = select<SVGSVGElement, unknown>('.chart-area');
  const zoomHandler = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, Math.ceil(data.length / 7)])
    .translateExtent([
      [-0.5 * dms.width, 0],
      [1.5 * dms.width, 0],
    ])
    .filter((e: Event) => {
      return !(e.target as Element).classList.contains('draggable');
    })
    .on('start', (e: D3ZoomEvent<Element, any>) => (k = e.transform.k))
    .on('zoom', (e: D3ZoomEvent<Element, any>) => {
      if (e.transform.k === k) chartArea.style('cursor', 'grab');
      setTransform(e.transform);
    })
    .on('end', () => chartArea.style('cursor', ''));
  selection.call(zoomHandler);

  const zoomIn = (days: number) => {
    const scale = data.length / days;
    const date = data.at(days * -1)!.date.toString();
    const translateX = baseXScale(date)!;
    const transition = selection.transition().duration(500);
    const transform = zoomIdentity.scale(scale).translate(-1 * translateX, 0);
    zoomHandler.transform(transition, transform);
  };
  return { transform, zoomIn };
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

interface Props {
  className?: string;
  data: CandlestickData[];
  prices: ChartPrices;
  onPriceUpdates: OnPriceUpdates;
  onDragEnd: OnPriceUpdates;
  marketPrice?: number;
  bounds: ChartPrices;
  isLimit?: { buy: boolean; sell: boolean };
  type: TradeTypes;
  overlappingSpread?: string;
  readonly?: boolean;
  activities?: Activity[];
}

const presetDays = [
  { days: 7, label: '7D' },
  { days: 30, label: '1M' },
  { days: 90, label: '3M' },
  { days: 365, label: '1Y' },
];

export const D3PriceHistory: FC<Props> = (props) => {
  const { className, data, marketPrice, bounds } = props;
  const [drawingMode, setDrawingMode] = useState<DrawingMode>();
  const [drawings, setDrawings] = useState<any[]>([]);
  const [ref, dms] = useChartDimensions(chartSettings);
  const { transform: zoomTransform, zoomIn } = useZoom(dms, data);

  const xScale = useMemo(() => {
    const zoomX = (d: number) => (zoomTransform ? zoomTransform.applyX(d) : d);
    return scaleBand()
      .domain(getDateRange(data.map((d) => d.date)))
      .range([dms.boundedWidth * -0.5, dms.boundedWidth * 1.5].map(zoomX))
      .paddingInner(0.5);
  }, [data, dms.boundedWidth, zoomTransform]);

  const yDomain = useMemo(() => {
    const candles = data.filter((point) => xScale(point.date.toString())! > 0);
    return getDomain(candles, bounds, marketPrice);
  }, [bounds, data, marketPrice, xScale]);

  const y = useLinearScale({
    domain: yDomain,
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.1,
  });

  return (
    <D3ChartProvider
      dms={dms}
      drawingMode={drawingMode}
      setDrawingMode={setDrawingMode}
      drawings={drawings}
      setDrawings={setDrawings}
      xScale={xScale}
      yScale={y.scale}
      zoom={zoomTransform}
    >
      <div className={cn('rounded-12 flex flex-1 bg-black', className)}>
        <DrawingMenu clearDrawings={() => setDrawings([])} />
        <div className="flex flex-1 flex-col">
          <svg
            ref={ref}
            id="interactive-chart"
            className={cn(style.historyChart, 'rounded-tr-12 flex-1')}
            data-testid="price-chart"
          >
            <defs>
              <linearGradient
                id="svg-brand-gradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--gradient-first)" />
                <stop offset="50%" stopColor="var(--gradient-middle)" />
                <stop offset="100%" stopColor="var(--gradient-last)" />
              </linearGradient>
            </defs>
            <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
              <D3ChartCandlesticks
                readonly={props.readonly}
                prices={props.prices}
                onPriceUpdates={props.onPriceUpdates}
                data={data}
                marketPrice={marketPrice}
                onDragEnd={props.onPriceUpdates}
                isLimit={props.isLimit}
                type={props.type}
                overlappingSpread={props.overlappingSpread}
                overlappingMarketPrice={marketPrice}
                activities={props.activities}
                yTicks={y.ticks}
              />
            </g>
          </svg>
          <div
            role="menubar"
            className="col-span-2 flex border-t border-white/10"
          >
            {presetDays.map(({ days, label }) => (
              <button
                key={days}
                role="menuitem"
                className="duration-preset hover:bg-background-700 rounded-8 p-8"
                onClick={() => zoomIn(days)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </D3ChartProvider>
  );
};
