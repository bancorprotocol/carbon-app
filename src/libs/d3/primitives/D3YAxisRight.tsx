import { D3AxisProps } from 'libs/d3';
import { uuid } from 'utils/helpers';

export const D3YAxisRight = ({ ticks, dms, formatter }: D3AxisProps) => {
  return (
    <g transform={`translate(${dms.boundedWidth},0)`}>
      <path
        d={['M', 6, dms.boundedHeight, 'h', -6, 'V', 0, 'h', 6].join(' ')}
        fill="none"
        className="stroke-background-800"
      />
      {ticks.map(({ value, offset }) => (
        <g key={`${uuid()}${value}`} transform={`translate(0,${offset})`}>
          <text
            style={{
              fontSize: '10px',
              textAnchor: 'start',
              transform: 'translate(12px, 3px)',
            }}
            fill="currentColor"
            opacity={0.6}
            className={'font-mono'}
          >
            {formatter ? formatter(value) : value}
          </text>
        </g>
      ))}
    </g>
  );
};
