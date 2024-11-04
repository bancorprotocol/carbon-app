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
import { FC, useEffect, useMemo, useState } from 'react';
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
import { getDomain, scaleBandInvert } from './utils';
import { cn } from 'utils/helpers';
import { DateRangePicker } from 'components/common/datePicker/DateRangePicker';
import { defaultEndDate, defaultStartDate } from '../utils';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { toUnixUTC } from 'components/simulator/utils';
import style from './D3PriceHistory.module.css';

export interface RangeUpdate {
  start?: Date;
  end?: Date;
}

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 80,
};

type TranslateExtent = [[number, number], [number, number]];
type ZoomBehavior = 'normal' | 'extended';
const getExtentConfig = (
  behavior: ZoomBehavior,
  datasize: number,
  width: number
) => {
  if (behavior === 'normal') {
    return {
      // eslint-disable-next-line prettier/prettier
      translate: [
        [0, 0],
        [width, 0],
      ] as TranslateExtent,
      zoom: [1, Math.ceil(datasize / 7)] as [number, number],
    };
  } else {
    return {
      // eslint-disable-next-line prettier/prettier
      translate: [
        [-0.5 * width, 0],
        [1.5 * width, 0],
      ] as TranslateExtent,
      zoom: [0.5, Math.ceil(datasize / 7)] as [number, number],
    };
  }
};

const useZoom = (
  dms: D3ChartSettings,
  data: CandlestickData[],
  behavior: ZoomBehavior = 'normal'
) => {
  const [transform, setTransform] = useState<ZoomTransform>();
  const baseXScale = scaleBand()
    .domain(getDateRange(data.map((d) => d.date)))
    .range([dms.boundedWidth * -0.5, dms.boundedWidth * 1.5])
    .paddingInner(0.5);

  let k = 0;
  const selection = select<SVGSVGElement, unknown>('#interactive-chart');
  const chartArea = select<SVGSVGElement, unknown>('.chart-area');
  const extent = getExtentConfig(behavior, data.length, dms.width);
  const zoomHandler = zoom<SVGSVGElement, unknown>()
    .scaleExtent(extent.zoom)
    .translateExtent(extent.translate)
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

  const zoomRange = (from: string, days: number) => {
    const scale = data.length / days;
    const translateX = baseXScale(from)!;
    const transition = selection.transition().duration(500);
    const transform = zoomIdentity.scale(scale).translate(-1 * translateX, 0);
    zoomHandler.transform(transition, transform);
  };

  return { transform, zoomRange };
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
  onRangeUpdates?: (params: RangeUpdate) => void;
  marketPrice?: number;
  bounds: ChartPrices;
  isLimit?: { buy: boolean; sell: boolean };
  type: TradeTypes;
  overlappingSpread?: string;
  readonly?: boolean;
  activities?: Activity[];
  zoomBehavior?: ZoomBehavior;
}

const presetDays = [
  { days: 7, label: '7D' },
  { days: 30, label: '1M' },
  { days: 90, label: '3M' },
  { days: 365, label: '1Y' },
];

export const D3PriceHistory: FC<Props> = (props) => {
  const { className, data, marketPrice, bounds, onRangeUpdates } = props;
  const [drawingMode, setDrawingMode] = useState<DrawingMode>();
  const [drawings, setDrawings] = useState<any[]>([]);
  const [ref, dms] = useChartDimensions(chartSettings);
  const { transform: zoomTransform, zoomRange } = useZoom(
    dms,
    data,
    props.zoomBehavior
  );

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
  const invertX = scaleBandInvert(xScale);
  const start = useMemo(() => {
    return new Date(Number(invertX(0) ?? xScale.domain()[0]) * 1000);
  }, [invertX, xScale]);
  const end = useMemo(() => {
    return addDays(start, data.length / (zoomTransform?.k ?? 1));
  }, [data.length, start, zoomTransform?.k]);

  const disabledDates = [
    {
      before: new Date(Number(xScale.domain()[0]) * 1000),
      after: new Date(Number(xScale.domain().at(-1)) * 1000),
    },
  ];

  useEffect(() => {
    if (onRangeUpdates) {
      onRangeUpdates({ start, end });
    }
  }, [onRangeUpdates, start, end]);

  const zoomFromTo = ({ start, end }: { start?: Date; end?: Date }) => {
    if (!start || !end) return;
    zoomRange(toUnixUTC(startOfDay(start)), differenceInDays(end, start));
  };

  const zoomIn = (days: number) => {
    zoomRange(data.at(days * -1)!.date.toString(), days);
  };

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
          <div className="col-span-2 flex border-t border-white/10">
            {presetDays.map(({ days, label }) => (
              <button
                key={days}
                role="menuitem"
                className="text-12 duration-preset hover:bg-background-700 rounded-8 p-8 disabled:pointer-events-none disabled:text-white/50"
                onClick={() => zoomIn(days)}
                disabled={days > data.length}
              >
                {label}
              </button>
            ))}
            <hr className="h-full border-e border-white/10" />
            <DateRangePicker
              className="rounded-8 border-0"
              defaultStart={defaultStartDate()}
              defaultEnd={defaultEndDate()}
              start={start}
              end={end}
              onConfirm={zoomFromTo}
              options={{
                disabled: disabledDates,
              }}
            />
          </div>
        </div>
      </div>
    </D3ChartProvider>
  );
};
