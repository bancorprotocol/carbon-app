import { D3ChartTitle } from 'libs/d3/primitives/D3ChartTitle';
import { D3XAxis } from 'libs/d3/primitives/D3XAxis';
import { D3YAxisLeft } from 'libs/d3/primitives/D3YAxisLeft';
import { useLinearScale } from 'libs/d3/useLinearScale';
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
    pixelsPerTick: 100,
  });

  const y = useLinearScale({
    domain: extent(data, (d) => d.portfolioOverHodl) as [number, number],
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.05,
  });

  if (!dms.width || !dms.height) return null;
  return (
    <>
      <D3XAxis ticks={x.ticks} dms={dms} />
      <D3YAxisLeft
        ticks={y.ticks}
        dms={dms}
        formatter={(value) => `${value}%`}
      />

      <D3LinePath
        data={data}
        xAcc={x.accessor('date')}
        yAcc={y.accessor('portfolioOverHodl')}
      />

      <D3ChartTitle dms={dms} title="Performance vs HODL" width={170} />
    </>
  );
};
