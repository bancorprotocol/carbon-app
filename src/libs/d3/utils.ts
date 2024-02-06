import { extent, max, ScaleLinear } from 'd3';
import { D3SimLegendType } from 'libs/d3/types';
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

export const defaultLegend: D3SimLegendType = {
  ask: {
    index: 0,
    label: 'Ask',
    labelSecondary: 'LHS',
    color: '#D86371',
    isDisabled: false,
  },
  bid: {
    index: 1,
    label: 'Bid',
    labelSecondary: 'LHS',
    color: '#00B578',
    isDisabled: false,
  },
  price: {
    index: 2,
    label: 'Price',
    labelSecondary: 'LHS',
    color: 'white',
    isDisabled: false,
  },
  portfolio: {
    index: 3,
    label: 'Portfolio Value',
    labelSecondary: 'RHS',
    color: '#10BBD5',
    isDisabled: false,
  },
  portion: {
    index: 4,
    label: 'Quote Portion',
    labelSecondary: 'RHS',
    color: '#FF8A00',
    isDisabled: false,
    isDashed: true,
  },
  hodl: {
    index: 5,
    label: 'HODL Value',
    labelSecondary: 'RHS',
    color: '#F5AC37',
    isDisabled: false,
  },
};
