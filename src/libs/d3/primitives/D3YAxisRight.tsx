import { D3AxisProps } from 'libs/d3';
import { uuid } from 'utils/helpers';

export const D3YAxisRight = ({ ticks, dms, formatter }: D3AxisProps) => {
  return (
    <g className="y-axis" transform={`translate(${dms.boundedWidth},0)`}>
      <rect x="0" y="0" width={100} height={dms.boundedHeight} fill="black" />
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
          >
            {formatter ? formatter(value) : value}
          </text>
        </g>
      ))}
    </g>
  );
};
