import { ScaleBand } from 'd3';
import { D3ChartSettings } from 'libs/d3';
import { dayjs } from 'libs/dayjs';

type Props = {
  dms: D3ChartSettings;
  xScale: ScaleBand<string>;
};

export const XAxis = ({ xScale, dms }: Props) => {
  const length = xScale.domain().length;
  const numberOfTicksTarget = Math.max(1, Math.floor(dms.boundedWidth / 80));
  const m = Math.floor(length / numberOfTicksTarget);

  const ticks = xScale
    .domain()
    .filter((_, i) => i % m === m - 1 || i === 0 || i === length - 1)
    .filter((_, i, arr) => i !== arr.length - 1 && i !== 0)
    .map((tickValue) => (
      <g
        className="axis"
        key={tickValue}
        transform={`translate(${xScale(tickValue)},0)`}
      >
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
          fill={'currentColor'}
          opacity={0.6}
          className={'font-mono'}
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
        x2={dms.width}
        className={'stroke-background-800'}
      />
    </>
  );
};
