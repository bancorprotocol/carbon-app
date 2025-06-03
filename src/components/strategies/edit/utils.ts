import { SafeDecimal } from 'libs/safedecimal';
import { Strategy } from 'libs/queries';
import { getStrategyType, isZero } from 'components/strategies/common/utils';
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
  editType: 'deposit' | 'withdraw',
  initialBudget: string = '0',
  budget: string = '0',
) => {
  if (isZero(budget)) return initialBudget;
  if (editType === 'deposit') {
    return new SafeDecimal(initialBudget).add(budget).toString();
  } else {
    return new SafeDecimal(initialBudget).sub(budget).toString();
  }
};

export const getEditPricesPage = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew',
) => {
  const type = getStrategyType(strategy);
  if (type === 'disposable') {
    return {
      to: '/strategies/edit/$strategyId/prices/disposable',
      search: toDisposablePricesSearch(strategy, editType),
    };
  }
  if (type === 'overlapping') {
    return {
      to: '/strategies/edit/$strategyId/prices/overlapping',
      search: toOverlappingPricesSearch(strategy, editType),
    };
  }
  return {
    to: '/strategies/edit/$strategyId/prices/recurring',
    search: toRecurringPricesSearch(strategy, editType),
  };
};
export const getEditBudgetPage = (
  strategy: Strategy,
  editType: 'withdraw' | 'deposit',
) => {
  const type = getStrategyType(strategy);

  if (type === 'disposable') {
    return {
      to: '/strategies/edit/$strategyId/budget/disposable',
      search: { editType },
    };
  }
  if (type === 'overlapping') {
    return {
      to: '/strategies/edit/$strategyId/budget/overlapping',
      search: { editType },
    };
  }
  return {
    to: '/strategies/edit/$strategyId/budget/recurring',
    search: { editType },
  };
};
