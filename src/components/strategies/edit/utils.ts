import { SafeDecimal } from 'libs/safedecimal';
import { OrderCreate } from '../create/useOrder';
import { Strategy } from 'libs/queries';
import { getSpread, isOverlappingStrategy } from '../overlapping/utils';

export const getDeposit = (initialBudget: string, newBudget: string) => {
  const value = new SafeDecimal(newBudget || '0').sub(initialBudget || '0');
  if (value.lte(0)) return '';
  return value.toString();
};
export const getWithdraw = (initialBudget: string, newBudget: string) => {
  const value = new SafeDecimal(initialBudget || '0').sub(newBudget || '0');
  if (value.lte(0)) return '';
  return value.toString();
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
