import { Strategy } from 'libs/queries';
import { OrderCreate } from './create/useOrder';
import { StrategySettings } from './create/types';
import { isOverlappingStrategy } from './overlapping/utils';

export const checkIfOrdersOverlap = (
  orderA: OrderCreate,
  orderB: OrderCreate
): boolean => {
  if (
    (+orderB.price <= +orderA.max && +orderB.price !== 0) ||
    (+orderB.price <= +orderA.price && +orderB.price !== 0) ||
    (+orderB.min <= +orderA.price && +orderB.min !== 0) ||
    (+orderB.min <= +orderA.max && +orderB.min !== 0)
  ) {
    return true;
  }
  return false;
};

export const getStatusTextByTxStatus = (
  isAwaiting: boolean,
  isProcessing: boolean
): string | undefined => {
  if (isAwaiting) return 'Waiting for Confirmation';
  if (isProcessing) return 'Processing';
  return;
};

export const getStrategySettings = (strategy: Strategy): StrategySettings => {
  const { order0, order1 } = strategy;
  const buy = order0.startRate === order0.endRate ? 'limit' : 'range';
  const sell = order1.startRate === order1.endRate ? 'limit' : 'range';
  // Overlapping
  if (isOverlappingStrategy(strategy)) return 'overlapping';
  // Recurring
  return `${buy}_${sell}`;
};
