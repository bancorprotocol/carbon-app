import { SafeDecimal } from 'libs/safedecimal';
import {
  AnyStrategy,
  AnyStrategyWithFiat,
} from 'components/strategies/common/types';

export const strategyFilter = {
  status: {
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
  },
  // @todo(gradient)
  // type: {
  //   all: 'All',
  //   static: 'Static',
  //   gradient: 'Gradient',
  // },
};
export type FilterStatus = keyof (typeof strategyFilter)['status'];
// export type FilterType = keyof (typeof strategyFilter)['type'];
export type AllFilter = FilterStatus; // | FilterType;
export type StrategyFilter = {
  status: FilterStatus;
  // type: FilterType;
};

export const strategySort = {
  recent: 'Recently Created',
  old: 'Oldest Created',
  pairAsc: 'Pair (A->Z)',
  pairDesc: 'Pair (Z->A)',
  totalBudgetDesc: 'Total Budget',
  trades: 'Trades',
};

export type StrategySort = keyof typeof strategySort;

/** There are multiple inactive status, so we cannot just do a.status !== b.status */
const differentStatus = (a: AnyStrategy, b: AnyStrategy) => {
  if (a.status === 'active' && b.status !== 'active') return true;
  if (b.status === 'active' && a.status !== 'active') return true;
  return false;
};

type SortFn = (a: AnyStrategyWithFiat, b: AnyStrategyWithFiat) => number;
export const sortStrategyFn: Record<StrategySort, SortFn> = {
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
