import { D3SimLegend } from 'libs/d3/charts/simulatorPrice/D3SimLegend';
import { D3SimPriceRange } from 'libs/d3/charts/simulatorPrice/D3SimPriceRange';
import { D3XAxis } from 'libs/d3/charts/simulatorPrice/D3XAxis';
import { D3YAxisLeft } from 'libs/d3/charts/simulatorPrice/D3YAxisLeft';
import { D3YAxiRight } from 'libs/d3/charts/simulatorPrice/D3YAxisRight';
import { useLinearScale } from 'libs/d3/charts/simulatorPrice/useLinearScale';
import {
  defaultLegend,
  getPriceDomain,
  yRightDomain,
} from 'libs/d3/charts/simulatorPrice/utils';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { D3AxisTick, D3ChartSettings, D3SimLegendEntry } from 'libs/d3/types';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { extent } from 'd3';
import { useState } from 'react';

interface Props extends SimulatorReturn {
  dms: D3ChartSettings;
}

export const D3ChartSimulatorSummary = ({ dms, data, bounds }: Props) => {
  const x = useLinearScale({
    domain: extent(data, (d) => d.date) as [number, number],
    range: [0, dms.boundedWidth],
  });

  const yLeft = useLinearScale({
    domain: getPriceDomain({ data, bounds }),
    range: [dms.boundedHeight, 0],
  });

  const yRight = useLinearScale({
    domain: yRightDomain(data),
    range: [dms.boundedHeight, 0],
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

  return (
    <>
      {' '}
      <D3XAxis ticks={x.ticks} dms={dms} />
      <D3YAxisLeft ticks={yLeft.ticks} dms={dms} />
      <D3YAxiRight ticks={yRightTicks} dms={dms} />
      {!legend.bid.isDisabled && (
        <D3SimPriceRange type={'bid'} {...rangeProps} />
      )}
      {!legend.ask.isDisabled && (
        <D3SimPriceRange type={'ask'} {...rangeProps} />
      )}
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
