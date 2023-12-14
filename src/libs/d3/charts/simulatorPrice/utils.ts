import { extent, ScaleLinear } from 'd3';
import { SimulatorData, SimulatorReturn } from 'libs/queries';

export const getAccessor =
  (key: keyof SimulatorData, scale: ScaleLinear<number, number>) =>
  (d: SimulatorData) =>
    scale(d[key]);

export const getPriceDomain = ({ data, bounds }: SimulatorReturn) => {
  const domain = extent(data, (d) => d.price);
  let min = domain[0] || 0;
  let max = domain[1] || 0;

  if (min > bounds.bidMin) {
    min = bounds.bidMin - (max - min) * 0.05;
  }
  if (min < 0) {
    min = 0;
  }
  if (max < bounds.askMax) {
    max = bounds.askMax + (max - min) * 0.05;
  }
  return [min, max];
};
