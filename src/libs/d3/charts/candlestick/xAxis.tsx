import { ScaleBand } from 'd3';
import { D3ChartSettings } from 'libs/d3';
import { dayjs } from 'libs/dayjs';

type Props = {
  dms: D3ChartSettings;
  xScale: ScaleBand<string>;
};

export const XAxis = ({ xScale, dms }: Props) => {
  const ticks = xScale
    .domain()
    .filter((_, i) => !(i % 30))
    .filter((_, i, arr) => i !== arr.length - 1 && i !== 0)
    .map((tickValue) => (
      <g
        className="axis"
        key={tickValue}
        transform={`translate(${xScale(tickValue)},0)`}
      >
        <line
          className="tick stroke-emphasis"
          y1={dms.boundedHeight}
          y2={dms.boundedHeight + 6}
        />
        <text
          style={{
            fontSize: '10px',
            textAnchor: 'middle',
          }}
          dy=".71em"
          y={dms.boundedHeight + 10}
          fill={'currentColor'}
          opacity={0.6}
        >
          {dayjs(Number(tickValue) * 1000).format('DD.MM.YY')}
        </text>
      </g>
    ));

  const bandwidthOffset = xScale.bandwidth() / 2;

  return (
    <>
      {ticks}
      <line
        y1={dms.boundedHeight}
        y2={dms.boundedHeight}
        x1={-bandwidthOffset}
        x2={dms.boundedWidth + bandwidthOffset}
        className={'stroke-emphasis'}
      />
    </>
  );
};
