import { D3AxisProps } from 'libs/d3/types';
import { uuid } from 'utils/helpers';

export const D3YAxiRight = ({ ticks, dms, formatter }: D3AxisProps) => {
  return (
    <g transform={`translate(${dms.boundedWidth},0)`}>
      <path
        d={['M', 6, dms.boundedHeight, 'h', -6, 'V', 0, 'h', 6].join(' ')}
        fill="none"
        className={'stroke-emphasis'}
      />
      {ticks.map(({ value, offset }) => (
        <g key={`${uuid()}${value}`} transform={`translate(0,${offset})`}>
          <line x1={0} x2={6} className={'stroke-emphasis'} />
          <text
            style={{
              fontSize: '10px',
              textAnchor: 'start',
              transform: 'translate(12px, 3px)',
            }}
            fill={'currentColor'}
            opacity={0.6}
          >
            {formatter ? formatter(value) : value}
          </text>
        </g>
      ))}
    </g>
  );
};
