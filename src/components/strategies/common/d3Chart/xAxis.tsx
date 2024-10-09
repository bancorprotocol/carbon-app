import { ScaleBand } from 'd3';
import { D3ChartSettings } from 'libs/d3';
import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';

type Props = {
  dms: D3ChartSettings;
  xScale: ScaleBand<string>;
  xTicks: string[];
};

export const XAxis = ({ xScale, dms, xTicks }: Props) => {
  const ticks = xTicks.map((tickValue) => {
    const x = (xScale(tickValue) ?? 0) + xScale.bandwidth() / 2;
    return (
      <g className="axis" key={tickValue} transform={`translate(${x},0)`}>
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
          {xAxisFormatter.format(fromUnixUTC(tickValue))}
        </text>
      </g>
    );
  });

  const bandwidthOffset = xScale.bandwidth() / 2;

  return (
    <>
      <rect
        x={-bandwidthOffset}
        y={dms.boundedHeight}
        width={dms.width}
        height="40"
        className="fill-background-black"
      />
      <line
        y1={dms.boundedHeight}
        y2={dms.boundedHeight}
        x1={-bandwidthOffset}
        x2={dms.width}
        className="stroke-background-800"
      />
      {ticks}
    </>
  );
};
