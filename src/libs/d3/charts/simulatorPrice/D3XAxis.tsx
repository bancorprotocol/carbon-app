import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { dayjs } from 'libs/dayjs';
import { uuid } from 'utils/helpers';

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
        className={'stroke-emphasis'}
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={`${uuid()}${value}`} transform={`translate(${xOffset}, 0)`}>
          <line
            y1={dms.boundedHeight * -1}
            y2="6"
            className={'stroke-emphasis'}
          />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(20px)',
            }}
            fill={'currentColor'}
            opacity={0.6}
          >
            {dayjs(value * 1000).format('DD/MM')}
          </text>
          <text
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(33px)',
            }}
            fill={'currentColor'}
            opacity={0.6}
          >
            {dayjs(value * 1000).format('YYYY')}
          </text>
        </g>
      ))}
    </g>
  );
};
