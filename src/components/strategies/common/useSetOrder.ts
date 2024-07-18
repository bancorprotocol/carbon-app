import { StrategyDirection, useNavigate } from 'libs/routing';
import { OrderBlock } from './types';
import { useCallback } from 'react';
import { Order } from 'libs/queries';
import { resetPrice } from './utils';

export const useSetDisposableOrder = (url: string, otherOrder?: Order) => {
  const navigate = useNavigate({ from: url });
  const setOrder = useCallback(
    (order: Partial<OrderBlock>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...order }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );
  const setDirection = useCallback(
    (direction: StrategyDirection) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({
          ...previous,
          direction,
          budget: undefined,
          min: resetPrice(otherOrder?.startRate),
          max: resetPrice(otherOrder?.endRate),
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate, otherOrder]
  );
  return { setOrder, setDirection };
};

/** Transform an order into a search params */
export const toOrderSearch = <T>(
  order: Partial<OrderBlock>,
  direction: 'buy' | 'sell'
) => {
  const search: Partial<T> = {};
  for (const [key, value] of Object.entries(order)) {
    const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    const searchKey = `${direction}${camelCaseKey}` as keyof T;
    search[searchKey] = value as T[keyof T];
  }
  return search;
};

export const useSetRecurringOrder = <T>(url: string) => {
  const navigate = useNavigate({ from: url });
  const setOrder = useCallback(
    (order: Partial<OrderBlock>, direction: StrategyDirection) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({
          ...previous,
          ...toOrderSearch<T>(order, direction),
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const setSellOrder = useCallback(
    (order: Partial<OrderBlock>) => setOrder(order, 'sell'),
    [setOrder]
  );

  const setBuyOrder = useCallback(
    (order: Partial<OrderBlock>) => setOrder(order, 'buy'),
    [setOrder]
  );
  return { setSellOrder, setBuyOrder };
};
