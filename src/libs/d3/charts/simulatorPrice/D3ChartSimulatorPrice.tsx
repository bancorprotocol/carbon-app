import { D3SimPriceRange } from 'libs/d3/charts/simulatorPrice/D3SimPriceRange';
import { D3XAxis } from 'libs/d3/charts/simulatorPrice/D3XAxis';
import { D3YAxisLeft } from 'libs/d3/charts/simulatorPrice/D3YAxisLeft';
import { useLinearScale } from 'libs/d3/charts/simulatorPrice/useLinearScale';
import { getPriceDomain } from 'libs/d3/charts/simulatorPrice/utils';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { D3ChartSettings } from 'libs/d3/types';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { extent } from 'd3';

interface Props extends SimulatorReturn {
  dms: D3ChartSettings;
}

export const D3ChartSimulatorPrice = ({ dms, data, bounds }: Props) => {
  const x = useLinearScale({
    domain: extent(data, (d) => d.date) as [number, number],
    range: [0, dms.boundedWidth],
  });

  const y = useLinearScale({
    domain: getPriceDomain({ data, bounds }),
    range: [dms.boundedHeight, 0],
  });

  const rangeProps = { x, y, data, bounds };

  return (
    <>
      <D3XAxis ticks={x.ticks} dms={dms} />
      <D3YAxisLeft ticks={y.ticks} dms={dms} />

      <D3SimPriceRange type={'bid'} {...rangeProps} />
      <D3SimPriceRange type={'ask'} {...rangeProps} />

      <D3LinePath
        data={data}
        xAcc={x.accessor('date')}
        yAcc={y.accessor('price')}
      />
    </>
  );
};
