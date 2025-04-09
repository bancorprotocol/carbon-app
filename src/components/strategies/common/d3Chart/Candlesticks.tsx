import { CandlestickData } from 'libs/d3';
import { useD3ChartCtx } from './D3ChartContext';
import { isEmptyHistory } from './utils';

type CandlesticksProps = {
  data: CandlestickData[];
};

export function Candlesticks({ data }: CandlesticksProps) {
  const { xScale, yScale } = useD3ChartCtx();
  if (isEmptyHistory(data)) return;
  return (
    <>
      {data.map((d) => {
        const isUp = d.open > d.close;
        const isDown = d.open < d.close;
        const color = isUp ? '#AD4F5A' : isDown ? '#009160' : 'white';

        let height = 5;
        let y = yScale(d.open);

        if (isDown) {
          height = yScale(d.open) - yScale(d.close);
          y = yScale(d.close);
        }

        if (isUp) {
          height = yScale(d.close) - yScale(d.open);
          y = yScale(d.open);
        }

        return (
          <g
            key={d.date}
            transform={`translate(${xScale(d.date.toString()) || 0},0)`}
          >
            <rect
              fill={color}
              y={yScale(d.high)}
              x={xScale.bandwidth() / 2 - 0.5}
              height={yScale(d.low) - yScale(d.high)}
              width={1}
            />
            <rect
              fill={color}
              y={y}
              height={height}
              width={xScale.bandwidth()}
              rx={2}
            />
          </g>
        );
      })}
    </>
  );
}
