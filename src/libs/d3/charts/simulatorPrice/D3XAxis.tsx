import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { dayjs } from 'libs/dayjs';

export const D3XAxis = () => {
  const { xScale, dms } = useD3Chart();
  const range = xScale.range();
  const width = range[1] - range[0];
  const pixelsPerTick = 70;
  const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
  const ticks = xScale.ticks(numberOfTicksTarget).map((value) => ({
    value,
    xOffset: xScale(value),
  }));

  return (
    <g transform={`translate(0,${dms.boundedHeight})`}>
      <path
        d={['M', range[0], 6, 'v', -6, 'H', range[1], 'v', 6].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(20px)',
            }}
          >
            {dayjs(value * 1000).format('DD/MM')}
          </text>
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(33px)',
            }}
          >
            {dayjs(value * 1000).format('YYYY')}
          </text>
        </g>
      ))}
    </g>
  );
};
