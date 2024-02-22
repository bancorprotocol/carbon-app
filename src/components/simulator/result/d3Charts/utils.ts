import { D3SimLegendType } from 'libs/d3';

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
  hodl: {
    index: 4,
    label: 'HODL Value',
    labelSecondary: 'RHS',
    color: '#F5AC37',
    isDisabled: false,
  },
  portion: {
    index: 5,
    label: 'Quote Portion',
    labelSecondary: 'RHS',
    color: '#FF8A00',
    isDisabled: true,
    isDashed: true,
  },
};
