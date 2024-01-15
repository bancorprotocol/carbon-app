import { ScaleLinear } from 'd3';
import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { uuid } from 'utils/helpers';

export const D3YAxis = ({
  yScaleLeft,
  yScaleRight,
}: {
  yScaleLeft: ScaleLinear<number, number>;
  yScaleRight?: ScaleLinear<number, number>;
}) => {
  const { dms } = useD3Chart();
  const ticks = yScaleLeft.ticks().map((value) => ({
    value,
    yOffset: yScaleLeft(value),
  }));

  return (
    <>
      <g transform={`translate(0,0)`}>
        <path
          d={['M', -6, dms.boundedHeight, 'h', 6, 'V', 0, 'h', -6].join(' ')}
          fill="none"
          className={'stroke-emphasis'}
        />
        {ticks.map(({ value, yOffset }) => (
          <g key={`${uuid()}${value}`} transform={`translate(0,${yOffset})`}>
            <line x1={-6} x2={dms.boundedWidth} className={'stroke-emphasis'} />
            <text
              key={value}
              style={{
                fontSize: '10px',
                textAnchor: 'end',
                transform: 'translate(-12px, 3px)',
              }}
              fill={'currentColor'}
              opacity={0.6}
            >
              {value}
            </text>
          </g>
        ))}
      </g>
      {yScaleRight && (
        <g transform={`translate(${dms.boundedWidth},0)`}>
          <path
            d={['M', 6, dms.boundedHeight, 'h', -6, 'V', 0, 'h', 6].join(' ')}
            fill="none"
            className={'stroke-emphasis'}
          />
          {ticks.map(({ value, yOffset }) => (
            <g key={`${uuid()}${value}`} transform={`translate(0,${yOffset})`}>
              <line x1={0} x2={6} className={'stroke-emphasis'} />
              <text
                key={value}
                style={{
                  fontSize: '10px',
                  textAnchor: 'start',
                  transform: 'translate(12px, 3px)',
                }}
                fill={'currentColor'}
                opacity={0.6}
              >
                {yScaleRight.invert(yOffset).toFixed(2)}
              </text>
            </g>
          ))}
        </g>
      )}
    </>
  );
};
