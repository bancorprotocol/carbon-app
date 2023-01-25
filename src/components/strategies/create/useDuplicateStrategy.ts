import { Token } from 'libs/tokens';
import { OrderCreate } from './useOrder';
import { MakeGenerics, PathNames, useNavigate, useSearch } from 'libs/routing';
import { Order, Strategy } from 'libs/queries';

type Props = {
  setToken0: (token: Token | undefined) => void;
  setToken1: (token: Token | undefined) => void;
  order0: OrderCreate;
  order1: OrderCreate;
};

type MyLocationGenerics = MakeGenerics<{
  Search: {
    strategy: Strategy;
  };
}>;

export const useDuplicateStrategy = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const { strategy: strategyDuplicate } = useSearch<MyLocationGenerics>();

  const _updateOrder = (order: OrderCreate, baseOrder: Order) => {
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

  const populateStrategy = (
    newStrategy: Strategy,
    { setToken0, setToken1, order0, order1 }: Props
  ) => {
    if (strategyDuplicate) {
      setToken0(newStrategy.token0);
      setToken1(newStrategy.token1);
      _updateOrder(order0, newStrategy.order0);
      _updateOrder(order1, newStrategy.order1);
    }
  };

  const duplicate = (strategy: Strategy) => {
    navigate({
      to: PathNames.createStrategy,
      search: { strategy },
    });
  };

  return {
    duplicate,
    populateStrategy,
    strategyDuplicate,
  };
};
