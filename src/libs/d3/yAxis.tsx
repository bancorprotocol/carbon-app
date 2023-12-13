import { ScaleLinear } from 'd3';
import { useMemo } from 'react';

type Props = {
  yScale: ScaleLinear<number, number>;
};

export const YAxis = ({ yScale }: Props) => {
  const range = useMemo(() => yScale.range(), [yScale]);
  const ticks = useMemo(() => {
    const width = range[0] - range[1];
    const pixelsPerTick = 40;
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      timestamp: value,
      xOffset: yScale(value),
    }));
  }, [range, yScale]);

  return (
    <g>
      <path
        d={['M', -6, range[0], 'h', 6, 'V', range[1], 'h', -6].join(' ')}
        fill="none"
        className={'overflow-visible'}
        stroke="currentColor"
      />
      {ticks.map(({ timestamp, xOffset }) => (
        <g key={timestamp} transform={`translate(0, ${xOffset})`}>
          <line x2="-6" stroke="currentColor" />
          <text
            key={timestamp}
            fill="currentColor"
            className={'translate-x-[-12px] translate-y-[3px]'}
            style={{
              fontSize: '10px',
              textAnchor: 'end',
            }}
          >
            {timestamp}
          </text>
        </g>
      ))}
    </g>
  );
};
