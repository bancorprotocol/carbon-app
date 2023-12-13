import { ScaleBand, ScaleLinear } from 'd3';
import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { CandlestickData } from 'pages/simulator/useMockdata';

type CandlesticksProps = {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
};

export function Candlesticks({ xScale, yScale }: CandlesticksProps) {
  const { data } = useD3Chart<CandlestickData[]>();

  return (
    <>
      {data.map((d) => (
        <g key={d.date} transform={`translate(${xScale(d.date.toString())},0)`}>
          <line
            y1={yScale(d.low)}
            y2={yScale(d.high)}
            stroke={'currentColor'}
          />
          <line
            y1={yScale(d.open)}
            y2={yScale(d.close)}
            strokeWidth={xScale.bandwidth()}
            stroke={
              // TODO change colors
              d.open > d.close ? 'red' : d.close > d.open ? 'green' : 'grey'
            }
          />
        </g>
      ))}
    </>
  );
}
