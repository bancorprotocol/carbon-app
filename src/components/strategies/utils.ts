import { TFunction } from 'libs/translations';
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
  isProcessing: boolean,
  t: TFunction<string, undefined, string>
): string | undefined => {
  if (isAwaiting) {
    return t('common.statuses.status1');
  }
  if (isProcessing) {
    return t('common.statuses.status2');
  }

  return undefined;
};
