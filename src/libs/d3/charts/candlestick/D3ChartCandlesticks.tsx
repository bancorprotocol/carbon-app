import { max, min, scaleBand, scaleLinear } from 'd3';
import { XAxis } from 'libs/d3/xAxis';
import { YAxis } from 'libs/d3/yAxis';
import { D3ChartCandlestickData } from './../../types';
import { useD3Chart } from './../../D3ChartProvider';
import { Candlesticks } from './Candlesticks';

export const D3ChartCandlesticks = () => {
  const { data, dms } = useD3Chart<D3ChartCandlestickData>();

  const xScale = scaleBand()
    .domain(data.map((d) => d.date.toString()))
    .range([0, dms.boundedWidth])
    .paddingInner(0.2);

  const yScale = scaleLinear()
    .domain([
      min(data, (d) => d.low) as number,
      max(data, (d) => d.high) as number,
    ])
    .rangeRound([dms.boundedHeight, 0])
    .nice();

  return (
    <>
      <Candlesticks xScale={xScale} yScale={yScale} />
      <YAxis yScale={yScale} />
      <XAxis xScale={xScale} />
    </>
  );
};
