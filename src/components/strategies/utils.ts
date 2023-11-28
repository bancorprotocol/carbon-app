import { Strategy } from 'libs/queries';
import { OrderCreate } from './create/useOrder';
import { SafeDecimal } from 'libs/safedecimal';

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

export const isOverlappingStrategy = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  const buyStart = new SafeDecimal(order1.startRate);
  const buyEnd = new SafeDecimal(order1.endRate);
  const sellStart = new SafeDecimal(order0.startRate);
  const sellEnd = new SafeDecimal(order0.endRate);
  const deltaStart = sellStart.minus(buyStart);
  const deltaSEnd = sellEnd.minus(buyEnd);
  return deltaStart.minus(deltaSEnd).abs().lt(0.0001);
};

export const getSpreadPPM = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  const min = new SafeDecimal(order0.startRate);
  const buyMax = new SafeDecimal(order0.endRate);
  const max = new SafeDecimal(order1.endRate);
  const sellDelta = max.minus(buyMax);
  const totalDelta = max.minus(min);
  return sellDelta.div(totalDelta).times(100);
};

export const getRoundedSpreadPPM = (strategy: Strategy) => {
  const spreadPPRM = getSpreadPPM(strategy);
  return Number(spreadPPRM.toFixed(2));
};
