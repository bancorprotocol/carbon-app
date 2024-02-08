import { StrategyInputOrder } from 'hooks/useStrategyInput';
import { OrderCreate } from './create/useOrder';

interface ValidOrderParams {
  isRange: boolean;
  min: string;
  max: string;
  price: string;
}

export const isValidOrder = (order: ValidOrderParams) => {
  return order.isRange
    ? isValidRange(order.min, order.max)
    : isValidLimit(order.price);
};

export const isEmptyOrder = (order: ValidOrderParams) => {
  return order.price === '0' && !order.min && !order.max;
};

export const isValidLimit = (value: string) => {
  const price = Number(value);
  return !isNaN(price) && price > 0;
};

export const isValidRange = (minStr: string, maxStr: string) => {
  const min = Number(minStr);
  const max = Number(maxStr);
  return !isNaN(min) && !isNaN(max) && min > 0 && min < max;
};

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

export const checkIfOrdersOverlap = (
  buy: StrategyInputOrder,
  sell: StrategyInputOrder
): boolean => {
  if (+sell.min <= +buy.max && +sell.min !== 0) {
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
