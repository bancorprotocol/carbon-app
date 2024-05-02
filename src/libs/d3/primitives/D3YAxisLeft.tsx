import { D3AxisProps } from 'libs/d3';
import { uuid } from 'utils/helpers';

export const D3YAxisLeft = ({ ticks, dms, formatter }: D3AxisProps) => {
  return (
    <g>
      <path
        d={['M', -6, dms.boundedHeight, 'h', 6, 'V', 0, 'h', -6].join(' ')}
        fill="none"
        className="stroke-background-800"
      />
      {ticks.map(({ value, offset }) => (
        <g key={`${uuid()}${value}`} transform={`translate(0,${offset})`}>
          <line
            x1={0}
            x2={dms.boundedWidth}
            className="stroke-background-800"
          />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'end',
              transform: 'translate(-12px, 3px)',
            }}
            fill="currentColor"
            opacity={0.6}
          >
            {formatter ? formatter(value) : value}
          </text>
        </g>
      ))}
    </g>
  );
};
