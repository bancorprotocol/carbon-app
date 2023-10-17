import { SafeDecimal } from 'libs/safedecimal';
import { Strategy } from 'libs/queries';
import {
  StrategyFilter,
  StrategySort,
  strategyFilter,
  strategySort,
} from './StrategyFilterSort';

/** There are multiple inactive status, so we cannot just do a.status !== b.status */
const differentStatus = (a: Strategy, b: Strategy) => {
  if (a.status === 'active' && b.status !== 'active') return true;
  if (b.status === 'active' && a.status !== 'active') return true;
  return false;
};

const sortFn: Record<StrategySort, (a: Strategy, b: Strategy) => number> = {
  recent: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
    return new SafeDecimal(a.idDisplay).minus(b.idDisplay).times(-1).toNumber();
  },
  old: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
    return new SafeDecimal(a.idDisplay).minus(b.idDisplay).toNumber();
  },
  pairAsc: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
    return (
      a.base.symbol.localeCompare(b.base.symbol) ||
      a.quote.symbol.localeCompare(b.quote.symbol)
    );
  },
  pairDesc: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
    return (
      b.base.symbol.localeCompare(a.base.symbol) ||
      b.quote.symbol.localeCompare(a.quote.symbol)
    );
  },
  roiAsc: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
    return a.roi.minus(b.roi).toNumber();
  },
  roiDesc: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
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
