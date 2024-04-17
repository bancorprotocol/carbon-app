import { D3SimLegend } from 'components/simulator/result/d3Charts/D3SimLegend';
import { D3SimPriceRange } from 'components/simulator/result/d3Charts/D3SimPriceRange';
import { defaultLegend } from 'components/simulator/result/d3Charts/utils';
import { D3XAxis } from 'libs/d3/primitives/D3XAxis';
import { D3YAxisLeft } from 'libs/d3/primitives/D3YAxisLeft';
import { D3YAxisRight } from 'libs/d3/primitives/D3YAxisRight';
import { useLinearScale } from 'libs/d3/useLinearScale';
import { getPriceDomain, yRightDomain } from 'libs/d3/utils';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { D3AxisTick, D3ChartSettings, D3SimLegendEntry } from 'libs/d3/types';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { extent } from 'd3';
import { useState } from 'react';
import { prettifyNumber } from 'utils/helpers';

interface Props extends SimulatorReturn {
  dms: D3ChartSettings;
}

export const D3ChartSimulatorSummary = ({ dms, data, bounds }: Props) => {
  const x = useLinearScale({
    domain: extent(data, (d) => d.date) as [number, number],
    range: [0, dms.boundedWidth],
    pixelsPerTick: 100,
  });

  const yLeft = useLinearScale({
    domain: getPriceDomain({ data, bounds }),
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.05,
  });

  const yRight = useLinearScale({
    domain: yRightDomain(data),
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.05,
  });
  const yRightTicks: D3AxisTick[] = yLeft.ticks.map(({ offset }) => ({
    value: yRight.scale.invert(offset),
    offset,
  }));

  const xAcc = x.accessor('date');
  const rangeProps = { x, y: yLeft, data, bounds };

  const [legend, setLegend] = useState(defaultLegend);

  const toggleLegend = (key: D3SimLegendEntry) => {
    setLegend((prev) => {
      return {
        ...prev,
        [key]: {
          ...prev[key],
          isDisabled: !prev[key].isDisabled,
        },
      };
    });
  };

  if (!dms.width || !dms.height) return null;

  return (
    <>
      <D3XAxis ticks={x.ticks} dms={dms} />
      <D3YAxisLeft
        ticks={yLeft.ticks}
        dms={dms}
        formatter={(value) => prettifyNumber(value)}
      />
      <D3YAxisRight
        ticks={yRightTicks}
        dms={dms}
        formatter={(value) => prettifyNumber(value)}
      />
      {!legend.bid.isDisabled && <D3SimPriceRange type="bid" {...rangeProps} />}
      {!legend.ask.isDisabled && <D3SimPriceRange type="ask" {...rangeProps} />}
      {!legend.price.isDisabled && (
        <D3LinePath data={data} xAcc={xAcc} yAcc={yLeft.accessor('price')} />
      )}
      {!legend.portfolio.isDisabled && (
        <D3LinePath
          data={data}
          xAcc={xAcc}
          yAcc={yRight.accessor('portfolioValue')}
          stroke={legend.portfolio.color}
        />
      )}
      {!legend.portion.isDisabled && (
        <D3LinePath
          data={data}
          xAcc={xAcc}
          yAcc={yRight.accessor('portionCASH')}
          stroke={legend.portion.color}
          strokeDasharray={2}
        />
      )}
      {!legend.hodl.isDisabled && (
        <D3LinePath
          data={data}
          xAcc={xAcc}
          yAcc={yRight.accessor('hodlValue')}
          stroke={legend.hodl.color}
        />
      )}
      <D3SimLegend legend={legend} toggleLegend={toggleLegend} />
    </>
  );
};
