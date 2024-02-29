import { extent, max, ScaleLinear } from 'd3';
import { SimulatorData, SimulatorReturn } from 'libs/queries';

export const getAccessor =
  (key: keyof SimulatorData, scale: ScaleLinear<number, number>) =>
  (d: SimulatorData) =>
    scale(d[key]);

// TODO cleanup and use max min
export const getPriceDomain = ({ data, bounds }: SimulatorReturn) => {
  const domain = extent(data, (d) => d.price);
  let min = domain[0] || 0;
  let max = domain[1] || 0;

  if (min > bounds.bidMin) {
    min = bounds.bidMin;
  }
  if (min < 0) {
    min = 0;
  }
  if (max < bounds.askMax) {
    max = bounds.askMax;
  }

  return [min, max];
};

export const yRightDomain = (data: SimulatorData[]) => {
  const values: number[] = [];
  data.forEach((d) => {
    values.push(d.portfolioValue);
    values.push(d.hodlValue);
    values.push(d.portionCASH);
  });
  return [0, max(values) as number];
};
