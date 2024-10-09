import { CandlestickData, ScaleBand, ScaleLinear } from 'libs/d3';

type CandlesticksProps = {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  data: CandlestickData[];
};

export function Candlesticks({ xScale, yScale, data }: CandlesticksProps) {
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
              // eslint-disable-next-line prettier/prettier
              height={yScale(d.low) - yScale(d.high) ?? height}
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
