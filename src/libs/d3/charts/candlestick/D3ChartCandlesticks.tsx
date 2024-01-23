import { max, min, scaleBand, scaleLinear } from 'd3';
import { XAxis } from 'libs/d3/charts/candlestick/xAxis';
import { YAxis } from 'libs/d3/charts/candlestick/yAxis';
import { Candlesticks } from './Candlesticks';
import { D3ChartCandlestickData, D3ChartSettings } from 'libs/d3';

interface Props {
  dms: D3ChartSettings;
  data: D3ChartCandlestickData[];
}

export const D3ChartCandlesticks = ({ dms, data }: Props) => {
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
      <Candlesticks xScale={xScale} yScale={yScale} data={data} />
      <YAxis yScale={yScale} />
      <XAxis xScale={xScale} dms={dms} />
    </>
  );
};
