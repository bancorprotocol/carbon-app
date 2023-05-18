import { useCallback, useEffect, useState } from 'react';
import { OrderCreate } from './useOrder';

export type UseCheckOverlapOrdersReturn = ReturnType<
  typeof useCheckOverlapOrders
>;

export const useCheckOverlapOrders = (
  order0: OrderCreate,
  order1: OrderCreate
) => {
  const [isOrdersOverlap, setIsOrdersOverlap] = useState<boolean>(false);

  const checkOverlap = useCallback(() => {
    if (
      (+order1.price <= +order0.max && +order1.price !== 0) ||
      (+order1.price <= +order0.price && +order1.price !== 0) ||
      (+order1.min <= +order0.price && +order1.min !== 0) ||
      (+order1.min <= +order0.max && +order1.min !== 0)
    ) {
      return true;
    }
    return false;
  }, [order0.max, order0.price, order1.min, order1.price]);

  useEffect(() => {
    if (checkOverlap()) {
      setIsOrdersOverlap(true);
    } else {
      setIsOrdersOverlap(false);
    }
  }, [checkOverlap, order0.max, order0.price, order1.min, order1.price]);

  return {
    isOrdersOverlap,
  };
};
