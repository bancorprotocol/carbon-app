import BigNumber from 'bignumber.js';
import { Strategy } from 'libs/queries';
import {
  StrategyFilter,
  StrategySort,
  strategyFilter,
  strategySort,
} from './StrategyFilterSort';

const sortFn: Record<StrategySort, (a: Strategy, b: Strategy) => number> = {
  recent: (a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return new BigNumber(a.idDisplay).minus(b.idDisplay).times(-1).toNumber();
  },
  old: (a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return new BigNumber(a.idDisplay).minus(b.idDisplay).toNumber();
  },
  pairAsc: (a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return (
      a.base.symbol.localeCompare(b.base.symbol) ||
      a.quote.symbol.localeCompare(b.quote.symbol)
    );
  },
  pairDesc: (a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return (
      b.base.symbol.localeCompare(a.base.symbol) ||
      b.quote.symbol.localeCompare(a.quote.symbol)
    );
  },
  roiAsc: (a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return a.roi.minus(b.roi).toNumber();
  },
  roiDesc: (a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return a.roi.minus(b.roi).times(-1).toNumber();
  },
};

export const getCompareFunctionBySortType = (sortType: StrategySort) => {
  return sortFn[sortType] ?? sortFn['roiDesc'];
};
export const getSortAndFilterItems = () => {
  const sortItems = Object.entries(strategySort).map(([item, title]) => {
    return { item: item as StrategySort, title };
  });

  const filterItems = Object.entries(strategyFilter).map(([item, title]) => {
    return { item: item as StrategyFilter, title };
  });

  return { sortItems, filterItems };
};
