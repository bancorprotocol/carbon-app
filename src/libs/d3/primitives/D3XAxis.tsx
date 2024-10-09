import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';
import { D3AxisTick, D3ChartSettings } from 'libs/d3/types';
import { uuid } from 'utils/helpers';

interface Props {
  ticks: D3AxisTick[];
  dms: D3ChartSettings;
}

export const D3XAxis = ({ ticks, dms }: Props) => {
  return (
    <g className="x-axis" transform={`translate(0,${dms.boundedHeight})`}>
      {/*<path*/}
      {/*  d={['M', 0, 6, 'v', -6, 'H', dms.boundedWidth, 'v', 6].join(' ')}*/}
      {/*  fill="none"*/}
      {/*  className='stroke-background-800'*/}
      {/*/>*/}
      <line
        x1={-dms.marginLeft}
        x2={dms.width}
        className="stroke-background-800"
      />
      {ticks.map(({ value, offset }) => (
        <g key={`${uuid()}${value}`} transform={`translate(${offset}, 0)`}>
          <line
            y1={dms.boundedHeight * -1}
            y2="0"
            className="stroke-background-800"
          />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(19px)',
            }}
            fill="currentColor"
            opacity={0.6}
          >
            {xAxisFormatter.format(fromUnixUTC(value))}
          </text>
        </g>
      ))}
    </g>
  );
};
