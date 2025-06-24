import { SafeDecimal } from 'libs/safedecimal';
import {
  AnyStrategy,
  AnyStrategyWithFiat,
} from 'components/strategies/common/types';
import {
  StrategySort,
  strategyFilter,
  strategySort,
} from './StrategyFilterSort';

/** There are multiple inactive status, so we cannot just do a.status !== b.status */
const differentStatus = (a: AnyStrategy, b: AnyStrategy) => {
  if (a.status === 'active' && b.status !== 'active') return true;
  if (b.status === 'active' && a.status !== 'active') return true;
  return false;
};

type SortFn = (a: AnyStrategyWithFiat, b: AnyStrategyWithFiat) => number;
const sortFn: Record<StrategySort, SortFn> = {
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
  totalBudgetDesc: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
    return a.fiatBudget.total.minus(b.fiatBudget.total).times(-1).toNumber();
  },
  trades: (a, b) => {
    if (differentStatus(a, b)) return a.status === 'active' ? -1 : 1;
    return b.tradeCount - a.tradeCount;
  },
};

export const getCompareFunctionBySortType = (sortType: StrategySort) => {
  return sortFn[sortType] ?? sortFn['trades'];
};
export const getSortAndFilterItems = () => {
  const sortItems = Object.entries(strategySort)
    .filter(([, title]) => !!title)
    .map(([item, title]) => {
      return { item: item as StrategySort, title };
    });

  return { sortItems, filterItems: strategyFilter };
};
