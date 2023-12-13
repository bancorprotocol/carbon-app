import { D3ChartProvider, useD3Chart } from 'libs/d3/D3ChartProvider';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { SimulatorData, SimulatorReturn } from 'libs/queries/extApi/simulator';
import { useEffect } from 'react';
import {
  scaleLinear,
  extent,
  axisBottom,
  axisLeft,
  select,
  line,
  area,
  ScaleLinear,
  max,
  axisRight,
} from 'd3';

const strokeWidth = 2;

type Props = {
  data: SimulatorReturn;
  settings: D3ChartSettingsProps;
};

export const D3ChartSimulatorPrice = ({ data, settings }: Props) => {
  return (
    <D3ChartProvider settings={settings} data={data}>
      <Chart />
    </D3ChartProvider>
  );
};

const Chart = () => {
  const {
    svgRef,
    data: { data, bounds },
    dms,
  } = useD3Chart<SimulatorReturn>();

  const getYDomain = () => {
    const domain = extent(data, (d) => d.price);
    let min = domain[0] || 0;
    let max = domain[1] || 0;

    if (min > bounds.bidMin) {
      min = bounds.bidMin - (max - min) * 0.05;
    }
    if (min < 0) {
      min = 0;
    }
    if (max < bounds.askMax) {
      max = bounds.askMax + (max - min) * 0.05;
    }
    return [min, max];
  };

  const yDomain = getYDomain();

  const xScale = scaleLinear()
    .domain(extent(data, (d) => d.date) as [number, number])
    .range([0, dms.boundedWidth]);

  const yScale = scaleLinear().domain(yDomain).range([dms.boundedHeight, 0]);
  const y2Scale = scaleLinear()
    // TODO check hodle value as well
    .domain([0, max(data, (d) => d.portfolioValue) as number])
    .range([dms.boundedHeight, 0]);

  const xScaleAccessor = (d: SimulatorData) => xScale(d.date);
  const yScaleAccessor = (d: SimulatorData) => yScale(d.price);
  const y2ScaleAccessor = (d: SimulatorData) => y2Scale(d.portfolioValue);
  const yHodleScaleAccessor = (d: SimulatorData) => y2Scale(d.hodlValue);
  const yCashPortionScaleAccessor = (d: SimulatorData) =>
    y2Scale(d.portionCASH);

  const lineGenerator = line<SimulatorData>()
    .x(xScaleAccessor)
    .y(yScaleAccessor);
  const linePrice = lineGenerator(data) ?? undefined;

  const linePortfolioGenerator = line<SimulatorData>()
    .x(xScaleAccessor)
    .y(y2ScaleAccessor);
  const linePortfolio = linePortfolioGenerator(data) ?? undefined;

  const lineHodleGenerator = line<SimulatorData>()
    .x(xScaleAccessor)
    .y(yHodleScaleAccessor);
  const lineHodle = lineHodleGenerator(data) ?? undefined;

  const lineCashPortionGenerator = line<SimulatorData>()
    .x(xScaleAccessor)
    .y(yCashPortionScaleAccessor);
  const lineCashPortion = lineCashPortionGenerator(data) ?? undefined;

  useEffect(() => {
    const svg = select(svgRef.current).select('g');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.x-axis').call(axisBottom(xScale));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.y-axis').call(axisLeft(yScale));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    svg.selectAll('.y2-axis').call(axisRight(y2Scale));
  }, [svgRef, xScale, y2Scale, yScale]);

  console.log('data', data);

  return (
    <>
      <g className="x-axis" transform={`translate(0,${dms.boundedHeight})`}></g>
      <g className="y-axis"></g>
      <g className="y2-axis"></g>

      <OrderRange type={'buy'} xScale={xScale} yScale={yScale} />

      <OrderRange type={'sell'} xScale={xScale} yScale={yScale} />

      <path
        className="price"
        fill={'none'}
        stroke={'currentColor'}
        strokeWidth={1}
        d={linePrice}
      ></path>
      <path
        className="portfolio"
        fill={'none'}
        stroke={'currentColor'}
        strokeWidth={1}
        d={linePortfolio}
      ></path>
      <path
        className="hodl"
        fill={'none'}
        stroke={'currentColor'}
        strokeWidth={1}
        d={lineHodle}
      ></path>

      <path
        className="cashPortion"
        fill={'none'}
        stroke={'currentColor'}
        strokeWidth={1}
        d={lineCashPortion}
      ></path>
    </>
  );
};

type OrderRangeProps = {
  type: 'buy' | 'sell';
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
};

const OrderRange = ({ type, xScale, yScale }: OrderRangeProps) => {
  const {
    data: { data, bounds },
    dms,
  } = useD3Chart<SimulatorReturn>();

  const min = type === 'buy' ? yScale(bounds.bidMin) : yScale(bounds.askMin);
  const max = type === 'buy' ? yScale(bounds.bidMax) : yScale(bounds.askMax);
  const solidLine = type === 'buy' ? min : max;
  const dashedLine = type === 'buy' ? max : min;
  const color = type === 'buy' ? 'green' : 'red';

  const xScaleAccessor = (d: SimulatorData) => xScale(d.date);
  const yScaleBidAccessor = (d: SimulatorData) => yScale(d.bid);
  const yScaleAskAccessor = (d: SimulatorData) => yScale(d.ask);
  const yScaleAccessor = type === 'buy' ? yScaleBidAccessor : yScaleAskAccessor;

  const lineGenerator = line<SimulatorData>()
    .x(xScaleAccessor)
    .y(yScaleAccessor);

  const areaGenerator = area<SimulatorData>()
    .x(xScaleAccessor)
    .y0(solidLine)
    .y1(yScaleAccessor);

  const areaInverseGenerator = area<SimulatorData>()
    .x(xScaleAccessor)
    .y0(yScaleAccessor)
    .y1(dashedLine);

  const lineD = lineGenerator(data) ?? undefined;
  const areaD = areaGenerator(data) ?? undefined;
  const areaInverseD = areaInverseGenerator(data) ?? undefined;

  return (
    <>
      <line
        className={`${type}LowLine`}
        stroke={color}
        strokeWidth={strokeWidth}
        y1={solidLine}
        y2={solidLine}
        x1={0}
        x2={dms.boundedWidth}
      ></line>
      <line
        className={`${type}HighLine`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeWidth}
        y1={dashedLine}
        y2={dashedLine}
        x1={0}
        x2={dms.boundedWidth}
      ></line>
      <path
        className={`${type}Line`}
        fill={'none'}
        stroke={color}
        strokeWidth={strokeWidth}
        d={lineD}
      ></path>
      <path
        className={`${type}Area`}
        fill={color}
        fillOpacity={0.5}
        d={areaD}
      ></path>
      <path
        className={`${type}AreaInverse`}
        fill={'grey'}
        fillOpacity={0.3}
        d={areaInverseD}
      ></path>
    </>
  );
};
