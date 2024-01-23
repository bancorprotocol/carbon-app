import { D3AxisTick, D3ChartSettings } from 'libs/d3/types';
import { dayjs } from 'libs/dayjs';
import { uuid } from 'utils/helpers';

interface Props {
  ticks: D3AxisTick[];
  dms: D3ChartSettings;
}

export const D3XAxis = ({ ticks, dms }: Props) => {
  return (
    <g transform={`translate(0,${dms.boundedHeight})`}>
      <path
        d={['M', 0, 6, 'v', -6, 'H', dms.boundedWidth, 'v', 6].join(' ')}
        fill="none"
        className={'stroke-emphasis'}
      />
      {ticks.map(({ value, offset }) => (
        <g key={`${uuid()}${value}`} transform={`translate(${offset}, 0)`}>
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
