import { ScaleLinear } from 'd3';
import { getAccessor } from 'libs/d3/charts/simulatorPrice/utils';
import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { D3AreaPath } from 'libs/d3/primitives/D3AreaPath';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { SimulatorData, SimulatorReturn } from 'libs/queries';

type OrderRangeProps = {
  type: keyof Pick<SimulatorData, 'bid' | 'ask'>;
  yScale: ScaleLinear<number, number>;
};

export const D3SimPriceRange = ({ type, yScale }: OrderRangeProps) => {
  const {
    xScale,
    data: { data, bounds },
  } = useD3Chart<SimulatorReturn>();

  const color = type === 'bid' ? '#00B578' : '#D86371';
  const strokeWidth = 1;

  const min = type === 'bid' ? yScale(bounds.bidMin) : yScale(bounds.askMin);
  const max = type === 'bid' ? yScale(bounds.bidMax) : yScale(bounds.askMax);

  const solidLine = type === 'bid' ? min : max;
  const dashedLine = type === 'bid' ? max : min;

  const xAcc = getAccessor('date', xScale);
  const yAcc = getAccessor(type, yScale);

  return (
    <>
      <D3AreaPath
        xAcc={xAcc}
        y0Acc={yAcc}
        y1Acc={() => dashedLine}
        data={data}
        fill={'grey'}
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
