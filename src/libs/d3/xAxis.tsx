import { ScaleBand } from 'd3';
import { useD3Chart } from 'libs/d3/D3ChartProvider';

type Props = {
  xScale: ScaleBand<string>;
};

export const XAxis = ({ xScale }: Props) => {
  const { dms } = useD3Chart();

  const ticks = xScale
    .domain()
    .filter((_, i) => !(i % 12))
    .map((tickValue) => (
      <g
        className="axis"
        key={tickValue}
        transform={`translate(${xScale(tickValue)},0)`}
      >
        <line
          y2={dms.boundedHeight}
          stroke={'currentColor'}
          strokeOpacity={0.2}
        />
        <line
          className="tick"
          y1={dms.boundedHeight}
          y2={dms.boundedHeight + 6}
          stroke={'currentColor'}
        />
        <text
          style={{ textAnchor: 'middle' }}
          dy=".71em"
          y={dms.boundedHeight + 14}
        >
          {new Date(Number(tickValue)).getDate()}/
          {new Date(Number(tickValue)).getMonth() + 1}
        </text>
      </g>
    ));

  const bandwidthOffset = xScale.bandwidth() / 2;

  return (
    <>
      {ticks}
      <line
        stroke={'currentColor'}
        y1={dms.boundedHeight}
        y2={dms.boundedHeight}
        x1={-bandwidthOffset}
        x2={dms.boundedWidth + bandwidthOffset}
      />
    </>
  );
};
