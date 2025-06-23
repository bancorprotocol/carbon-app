import {
  D3ChartSettingsProps,
  useChartDimensions,
  useLinearScale,
} from 'libs/d3';
import { cn, prettifyNumber } from 'utils/helpers';
import { useBandScale } from 'libs/d3/useBandScale';
import style from '../d3Chart/D3PriceHistory.module.css';
import { useStrategyMarketPrice } from 'components/strategies/UserMarketPrice';
import { FC, ReactNode, useState } from 'react';
import { Token } from 'libs/tokens';
import { D3ChartProvider, Drawing } from '../d3Chart/D3ChartContext';
import { D3ChartMarketPrice } from '../d3Chart/D3ChartMarketPrice';
import { D3Pointer } from '../d3Chart/D3Pointer';
import { DrawingMode } from '../d3Chart/drawing/DrawingMenu';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { NotFound } from 'components/common/NotFound';
import { formatQuickTime } from './utils';
import { QuickGradientOrderBlock } from '../types';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 20,
  marginRight: 80,
};

const bandwidthOffset = 0;

interface Props {
  base: Token;
  quote: Token;
  orders: QuickGradientOrderBlock[];
  children: ReactNode;
}

const yDomain = (orders: QuickGradientOrderBlock[], marketPrice?: string) => {
  if (!marketPrice) return [0, 1000];
  const price = Number(marketPrice);
  const orderPrices = orders.map((o) => [+o._sP_, +o._eP_]).flat();
  return [
    Math.min(price / 1.5, ...orderPrices),
    Math.max(price * 1.5, ...orderPrices),
  ];
};

export const QuickGradientChart: FC<Props> = (props) => {
  const { base, quote, orders, children } = props;
  const { marketPrice, isPending } = useStrategyMarketPrice({ base, quote });

  if (isPending) {
    return (
      <section className="rounded-12 grid flex-1 items-center bg-black">
        <CarbonLogoLoading className="h-[80px]" />
      </section>
    );
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

  return (
    <QuickGradientChartContent marketPrice={marketPrice} orders={orders}>
      {children}
    </QuickGradientChartContent>
  );
};

interface ContentProps {
  marketPrice: string;
  orders: QuickGradientOrderBlock[];
  children: ReactNode;
}

const QuickGradientChartContent: FC<ContentProps> = (props) => {
  const { marketPrice, orders, children } = props;
  const [ref, dms] = useChartDimensions(chartSettings);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const x = useBandScale({
    domain: new Array(61).fill(null).map((_, i) => i.toString()),
    range: [0, dms.boundedWidth],
    paddingInner: 0.1,
    ticksModulo: 10,
  });
  const y = useLinearScale({
    domain: yDomain(orders, marketPrice),
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
      xScale={x.scale}
      yScale={y.scale}
      yTicks={y.ticks}
    >
      <svg
        ref={ref}
        id="interactive-chart"
        className={cn(style.historyChart, 'rounded-12 flex flex-1 bg-black')}
        data-testid="price-chart"
      >
        <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
          <rect
            className="chart-area cursor-crosshair"
            x="0"
            y="0"
            width={dms.boundedWidth}
            height={dms.boundedHeight}
            fillOpacity="0"
          />
          <g className="y-axis" transform={`translate(${dms.boundedWidth},0)`}>
            <rect
              x="0"
              y="0"
              width={dms.marginRight}
              height={dms.height}
              className="fill-background-black"
            />
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={dms.boundedHeight}
              className="stroke-background-800"
            />
            {y.ticks.map(({ value, offset }) => (
              <g key={`y-${value}`} transform={`translate(0,${offset})`}>
                <text
                  style={{
                    fontSize: '10px',
                    textAnchor: 'start',
                    transform: 'translate(12px, 3px)',
                  }}
                  fill="currentColor"
                  opacity={0.6}
                >
                  {prettifyNumber(value, { abbreviate: true })}
                </text>
              </g>
            ))}
          </g>
          <g className="x-axis">
            <rect
              x={-bandwidthOffset}
              y={dms.boundedHeight}
              width={dms.width}
              height={dms.marginBottom}
              className="fill-background-black"
            />
            <line
              y1={dms.boundedHeight}
              y2={dms.boundedHeight}
              x1={-bandwidthOffset}
              x2={dms.width}
              className="stroke-background-800"
            />
            {x.ticks.map(({ value, offset }) => (
              <g key={`x-${value}`} transform={`translate(${offset}, 0)`}>
                <line
                  className="tick stroke-background-800"
                  y1={dms.boundedHeight}
                  y2={dms.boundedHeight - 10}
                />
                <text
                  style={{
                    fontSize: '10px',
                    textAnchor: 'middle',
                  }}
                  dy=".71em"
                  y={dms.boundedHeight + 10}
                  fill="currentColor"
                  opacity={0.6}
                >
                  {value}min
                </text>
              </g>
            ))}
          </g>
          <D3ChartMarketPrice marketPrice={Number(marketPrice)} />
          {children}
          <D3Pointer formatX={(x) => formatQuickTime(x)} />
        </g>
      </svg>
    </D3ChartProvider>
  );
};
