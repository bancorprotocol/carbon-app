import { OrderCreate } from './create/useOrder';

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
