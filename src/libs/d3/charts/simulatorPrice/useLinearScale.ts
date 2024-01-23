import { scaleLinear } from 'd3';
import { getAccessor } from 'libs/d3/charts/simulatorPrice/utils';
import { D3AxisTick } from 'libs/d3/types';
import { SimulatorData } from 'libs/queries';
import { useCallback } from 'react';

interface Props {
  domain: Iterable<number>;
  range: Iterable<number>;
}

export type LinearScaleReturn = ReturnType<typeof useLinearScale>;

export const useLinearScale = ({ domain, range }: Props) => {
  const scale = scaleLinear().domain(domain).range(range);

  // const width = scale.range()[1] - scale.range()[0];
  // const pixelsPerTick = 70;
  // const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
  // const ticks: D3AxisTick[] = scale.ticks(numberOfTicksTarget).map((value) => ({
  //   value,
  //   offset: scale(value),
  // }));

  const ticks: D3AxisTick[] = scale.ticks().map((value) => ({
    value,
    offset: scale(value),
  }));

  const accessor = useCallback(
    (key: keyof SimulatorData) => getAccessor(key, scale),
    [scale]
  );

  return { scale, ticks, accessor };
};
