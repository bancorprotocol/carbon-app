import { SafeDecimal } from 'libs/safedecimal';
import { OrderCreate } from '../create/useOrder';
import { Strategy } from 'libs/queries';
import { getSpread, isOverlappingStrategy } from '../overlapping/utils';
import { isDisposableStrategy } from '../common/utils';
import {
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';

export const getDeposit = (initialBudget?: string, newBudget?: string) => {
  const value = new SafeDecimal(newBudget || '0').sub(initialBudget || '0');
  if (value.lte(0)) return '';
  return value.toString();
};
export const getWithdraw = (initialBudget?: string, newBudget?: string) => {
  const value = new SafeDecimal(initialBudget || '0').sub(newBudget || '0');
  if (value.lte(0)) return '';
  return value.toString();
};

export const getTotalBudget = (
  action: 'deposit' | 'withdraw',
  initialBudget?: string,
  budget?: string
) => {
  if (action === 'deposit') {
    return new SafeDecimal(initialBudget || '0').add(budget || '0').toString();
  } else {
    return new SafeDecimal(initialBudget || '0').sub(budget || '0').toString();
  }
};

export const strategyBudgetChanges = (
  strategy: Strategy,
  order0: OrderCreate,
  order1: OrderCreate
) => {
  if (order0.budget !== strategy.order0.balance) return true;
  if (order1.budget !== strategy.order1.balance) return true;
  return false;
};

export const strategyHasChanged = (
  strategy: Strategy,
  order0: OrderCreate,
  order1: OrderCreate
) => {
  if (strategyBudgetChanges(strategy, order0, order1)) return true;
  if (order0.min !== strategy.order0.startRate) return true;
  if (order0.max !== strategy.order0.endRate) return true;
  if (order1.min !== strategy.order1.startRate) return true;
  if (order1.max !== strategy.order1.endRate) return true;
  if (isOverlappingStrategy({ order0, order1 })) {
    return !getSpread({ order0, order1 }).eq(getSpread(strategy));
  }
  return false;
};

export const getEditPricesPage = (
  strategy: Strategy,
  type: 'editPrices' | 'renew'
) => {
  const isOverlapping = isOverlappingStrategy(strategy);
  const isDisposable = isDisposableStrategy(strategy);
  if (isDisposable) {
    return {
      to: '/strategies/edit/$strategyId/prices/disposable',
      search: toDisposablePricesSearch(strategy, type),
    };
  } else if (isOverlapping) {
    return {
      to: '/strategies/edit/$strategyId/prices/overlapping',
      search: toOverlappingPricesSearch(strategy, type),
    };
  } else {
    return {
      to: '/strategies/edit/$strategyId/prices/recurring',
      search: toRecurringPricesSearch(strategy, type),
    };
  }
};
export const getEditBudgetPage = (
  strategy: Strategy,
  action: 'withdraw' | 'deposit'
) => {
  const isOverlapping = isOverlappingStrategy(strategy);
  const isDisposable = isDisposableStrategy(strategy);
  if (isDisposable) {
    return {
      to: '/strategies/edit/$strategyId/budget/disposable',
      search: { action },
    };
  } else if (isOverlapping) {
    return {
      to: '/strategies/edit/$strategyId/budget/overlapping',
      search: { action },
    };
  } else {
    return {
      to: '/strategies/edit/$strategyId/budget/recurring',
      search: { action },
    };
  }
};
