import { D3YAxisRight } from 'libs/d3';
import { useD3ChartCtx } from './D3ChartContext';
import { prettifyNumber } from 'utils/helpers';

export const D3YAxis = () => {
  const { dms, yTicks } = useD3ChartCtx();
  return (
    <D3YAxisRight
      ticks={yTicks}
      dms={dms}
      formatter={(value) => prettifyNumber(value, { abbreviate: true })}
    />
  );
};
