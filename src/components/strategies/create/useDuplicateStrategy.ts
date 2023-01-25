import { Token } from 'libs/tokens';
import { OrderCreate } from './useOrder';
import {
  MakeGenerics,
  PathNames,
  useLocation,
  useNavigate,
  useSearch,
} from 'libs/routing';
import { Order, Strategy } from 'libs/queries';

type Props = {
  setToken0: (token: Token | undefined) => void;
  setToken1: (token: Token | undefined) => void;
  order0: OrderCreate;
  order1: OrderCreate;
};

type MyLocationGenerics = MakeGenerics<{
  Search: {
    strategy: string;
  };
}>;

export const useDuplicateStrategy = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const { strategy: strategyDuplicate } = useSearch<MyLocationGenerics>();
  const location = useLocation();

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

  const populateStrategy = ({
    setToken0,
    setToken1,
    order0,
    order1,
  }: Props) => {
    const parsedStrategy = JSON.parse(
      Buffer.from(strategyDuplicate || '', 'base64').toString('utf8')
    );
    if (parsedStrategy) {
      setToken0(parsedStrategy.token0);
      setToken1(parsedStrategy.token1);
      _updateOrder(order0, parsedStrategy.order0);
      _updateOrder(order1, parsedStrategy.order1);
    }
    location.history.replace(PathNames.createStrategy);
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
    strategyDuplicate,
  };
};
