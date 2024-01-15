import { D3SimLegend } from 'libs/d3/charts/simulatorPrice/D3SimLegend';
import { D3SimPriceRange } from 'libs/d3/charts/simulatorPrice/D3SimPriceRange';
import { D3XAxis } from 'libs/d3/charts/simulatorPrice/D3XAxis';
import { D3YAxis } from 'libs/d3/charts/simulatorPrice/D3YAxis';
import {
  getAccessor,
  getPriceDomain,
} from 'libs/d3/charts/simulatorPrice/utils';
import { useD3Chart } from 'libs/d3/D3ChartProvider';
import { D3LinePath } from 'libs/d3/primitives/D3LinePath';
import { SimulatorReturn } from 'libs/queries/extApi/simulator';
import { useState } from 'react';
import { scaleLinear, max } from 'd3';

export type D3SimLegendEntry =
  | 'ask'
  | 'bid'
  | 'price'
  | 'portfolio'
  | 'portion'
  | 'hodl';

export type D3LegendItem = {
  index: number;
  label: string;
  labelSecondary?: string;
  color: string;
  isDisabled: boolean;
};

export type D3SimLegendType = Record<D3SimLegendEntry, D3LegendItem>;

const defaultLegend: D3SimLegendType = {
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
  },
  hodl: {
    index: 5,
    label: 'HODL Value',
    labelSecondary: 'RHS',
    color: '#F5AC37',
    isDisabled: false,
  },
};

export const D3ChartSimulatorPrice = () => {
  const {
    xScale,
    dms,
    data: { data, bounds },
  } = useD3Chart<SimulatorReturn>();

  const yDomain = getPriceDomain({ data, bounds });

  const yLeftScale = scaleLinear()
    .domain(yDomain)
    .range([dms.boundedHeight, 0]);
  const yRightScale = scaleLinear()
    // TODO check hodle value as well
    .domain([0, max(data, (d) => d.portfolioValue) as number])
    .range([dms.boundedHeight, 0]);

  const xAcc = getAccessor('date', xScale);
  const priceAcc = getAccessor('price', yLeftScale);
  const portfolioAcc = getAccessor('portfolioValue', yRightScale);
  const hodlAcc = getAccessor('hodlValue', yRightScale);
  const portionAcc = getAccessor('portionCASH', yRightScale);

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
      <D3YAxis yScaleLeft={yLeftScale} yScaleRight={yRightScale} />
      <D3XAxis />
      {!legend.bid.isDisabled && (
        <D3SimPriceRange type={'bid'} yScale={yLeftScale} />
      )}
      {!legend.ask.isDisabled && (
        <D3SimPriceRange type={'ask'} yScale={yLeftScale} />
      )}
      {!legend.price.isDisabled && (
        <D3LinePath data={data} xAcc={xAcc} yAcc={priceAcc} />
      )}
      {!legend.portfolio.isDisabled && (
        <D3LinePath
          data={data}
          xAcc={xAcc}
          yAcc={portfolioAcc}
          stroke={legend.portfolio.color}
        />
      )}
      {!legend.portion.isDisabled && (
        <D3LinePath
          data={data}
          xAcc={xAcc}
          yAcc={portionAcc}
          stroke={legend.portion.color}
          strokeDasharray={2}
        />
      )}
      {!legend.hodl.isDisabled && (
        <D3LinePath
          data={data}
          xAcc={xAcc}
          yAcc={hodlAcc}
          stroke={legend.hodl.color}
        />
      )}
      <D3SimLegend legend={legend} toggleLegend={toggleLegend} />
    </>
  );
};
