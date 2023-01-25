import { useEffect } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from './useOrder';

type Props = {
  setToken0: (token: Token | undefined) => void;
  setToken1: (token: Token | undefined) => void;
  order0: OrderCreate;
  order1: OrderCreate;
};

type Order = {
  startRate: string;
  endRate: string;
  balance: string;
  price: number;
};

export const useDuplicateStrategy = ({
  setToken0,
  setToken1,
  order0,
  order1,
}: Props) => {
  const updateOrder = (order: OrderCreate, baseOrder: Order) => {
    order.setBudget(baseOrder.balance);
    const limit = baseOrder.startRate === baseOrder.endRate;
    if (limit) {
      order.setPrice(baseOrder.startRate);
    } else {
      order.setIsRange(true);
      order.setMin(baseOrder.startRate);
      order.setMax(baseOrder.endRate);
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const rawStrategy = urlParams?.get('strategy') || '';
    const strategy = JSON.parse(
      Buffer.from(rawStrategy, 'base64').toString('utf8')
    );

    if (strategy) {
      setToken0(strategy.token0);
      setToken1(strategy.token1);
      updateOrder(order0, strategy.order0);
      updateOrder(order1, strategy.order1);
    }
  }, []);
};
