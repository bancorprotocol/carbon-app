import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';
import { useD3ChartCtx } from './D3ChartContext';
import { useMemo } from 'react';

export const XAxis = () => {
  const { dms, xScale, zoom } = useD3ChartCtx();
  const xTicks = useMemo(() => {
    const length = xScale.domain().length;
    const ratio = Math.ceil(zoom?.k ?? 1);
    const target = Math.floor((dms.boundedWidth * ratio) / 110);
    const numberOfTicks = Math.max(1, target);
    const m = Math.ceil(length / numberOfTicks);
    return xScale.domain().filter((_, i) => i % m === m - 1);
  }, [dms.boundedWidth, xScale, zoom]);

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
        height={dms.marginBottom}
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
