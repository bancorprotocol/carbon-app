import { LinearScaleReturn } from 'libs/d3/useLinearScale';
import { D3AreaPath } from 'libs/d3/primitives/D3AreaPath';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { SimulatorData, SimulatorReturn } from 'libs/queries';

interface OrderRangeProps extends SimulatorReturn {
  type: keyof Pick<SimulatorData, 'bid' | 'ask'>;
  x: LinearScaleReturn;
  y: LinearScaleReturn;
}

export const D3SimPriceRange = ({
  type,
  x,
  y,
  data,
  bounds,
}: OrderRangeProps) => {
  const color = type === 'bid' ? 'var(--buy)' : 'var(--sell)';
  const strokeWidth = 1;

  const min = type === 'bid' ? y.scale(bounds.bidMin) : y.scale(bounds.askMin);
  const max = type === 'bid' ? y.scale(bounds.bidMax) : y.scale(bounds.askMax);

  const solidLine = type === 'bid' ? min : max;
  const dashedLine = type === 'bid' ? max : min;

  const xAcc = x.accessor('date');
  const yAcc = y.accessor(type);

  return (
    <>
      <D3AreaPath
        xAcc={xAcc}
        y0Acc={yAcc}
        y1Acc={() => dashedLine}
        data={data}
        fill="grey"
        fillOpacity={0.25}
      />
      <D3AreaPath
        xAcc={xAcc}
        y0Acc={() => solidLine}
        y1Acc={yAcc}
        data={data}
        fill={color}
        fillOpacity={0.15}
      />
      <D3LinePath
        stroke={color}
        strokeWidth={strokeWidth}
        xAcc={xAcc}
        yAcc={() => solidLine}
        data={data}
      />
      <D3LinePath
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeWidth * 4}
        xAcc={xAcc}
        yAcc={() => dashedLine}
        data={data}
      />
      <D3LinePath
        xAcc={xAcc}
        yAcc={yAcc}
        data={data}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </>
  );
};
