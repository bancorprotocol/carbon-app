import { Token } from 'libs/tokens';
import { OrderCreate } from './useOrder';
import { PathNames, useNavigate } from 'libs/routing';
import { Strategy } from 'libs/queries';

type Props = {
  strategy: string;
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

export const useDuplicateStrategy = () => {
  const navigate = useNavigate();

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

  const populateStrategy = ({
    strategy,
    setToken0,
    setToken1,
    order0,
    order1,
  }: Props) => {
    const newStrategy = JSON.parse(
      Buffer.from(strategy, 'base64').toString('utf8')
    );

    if (strategy) {
      setToken0(newStrategy.token0);
      setToken1(newStrategy.token1);
      updateOrder(order0, newStrategy.order0);
      updateOrder(order1, newStrategy.order1);
    }
  };

  const duplicate = (strategy: Strategy) => {
    const parsedData = Buffer.from(JSON.stringify(strategy)).toString('base64');
    navigate({
      to: `${PathNames.createStrategy}/?strategy=${parsedData}`,
    });
  };

  return {
    duplicate,
    populateStrategy,
    updateOrder,
  };
};
