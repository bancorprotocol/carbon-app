import { D3XAxis } from 'libs/d3/charts/simulatorPrice/D3XAxis';
import { D3YAxisLeft } from 'libs/d3/charts/simulatorPrice/D3YAxisLeft';
import { useLinearScale } from 'libs/d3/charts/simulatorPrice/useLinearScale';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { D3ChartSettings } from 'libs/d3/types';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { extent } from 'd3';

interface Props {
  dms: D3ChartSettings;
  data: SimulatorReturn['data'];
}

export const D3ChartSimulatorPerformance = ({ dms, data }: Props) => {
  const x = useLinearScale({
    domain: extent(data, (d) => d.date) as [number, number],
    range: [0, dms.boundedWidth],
  });

  const y = useLinearScale({
    domain: extent(data, (d) => d.portfolioOverHodl) as [number, number],
    range: [dms.boundedHeight, 0],
  });
  return (
    <>
      <D3XAxis ticks={x.ticks} dms={dms} />
      <D3YAxisLeft ticks={y.ticks} dms={dms} />

      <D3LinePath
        data={data}
        xAcc={x.accessor('date')}
        yAcc={y.accessor('portfolioOverHodl')}
      />
    </>
  );
};
