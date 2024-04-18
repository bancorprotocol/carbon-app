import { ScaleBand } from 'd3';
import { D3ChartSettings } from 'libs/d3';
import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';

type Props = {
  dms: D3ChartSettings;
  xScale: ScaleBand<string>;
};

export const XAxis = ({ xScale, dms }: Props) => {
  const length = xScale.domain().length;
  const numberOfTicksTarget = Math.max(1, Math.floor(dms.boundedWidth / 80));
  const m = Math.ceil(length / numberOfTicksTarget);
  const ticks = xScale
    .domain()
    .filter((_, i) => i % m === m - 1)
    .map((tickValue) => {
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
      {ticks}
      <line
        y1={dms.boundedHeight}
        y2={dms.boundedHeight}
        x1={-bandwidthOffset}
        x2={dms.width}
        className="stroke-background-800"
      />
    </>
  );
};
