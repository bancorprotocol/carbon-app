import { D3AxisProps } from 'libs/d3';
import { uuid } from 'utils/helpers';

export const D3YAxisRight = ({ ticks, dms, formatter }: D3AxisProps) => {
  return (
    <g
      transform={`translate(${dms.boundedWidth},0)`}
      // click should target underlying price handler
      className="y-axis pointer-events-none"
    >
      <rect
        x="0"
        y="0"
        width={dms.marginRight}
        height={dms.height}
        className="fill-background-black"
      />
      <line
        x1={0}
        x2={0}
        y1={0}
        y2={dms.boundedHeight}
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
