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
  const { strategy: templateStrategy } = useSearch<MyLocationGenerics>();
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

  const _isValid = (strategy: Strategy) => {
    return (
      strategy.hasOwnProperty('token0') &&
      strategy.hasOwnProperty('token1') &&
      strategy.hasOwnProperty('order0') &&
      strategy.hasOwnProperty('order1')
    );
  };

  const populateStrategy = ({
    setToken0,
    setToken1,
    order0,
    order1,
  }: Props) => {
    try {
      const decodedStrategy = JSON.parse(
        Buffer.from(templateStrategy || '', 'base64').toString('utf8')
      );

      const isValid = _isValid(decodedStrategy);

      if (decodedStrategy && isValid) {
        setToken0(decodedStrategy.token0);
        setToken1(decodedStrategy.token1);
        _updateOrder(order0, decodedStrategy.order0);
        _updateOrder(order1, decodedStrategy.order1);
      }
      location.history.replace(PathNames.createStrategy);
    } catch (error) {}
  };

  const duplicate = (strategy: Strategy) => {
    const encodedStrategy = Buffer.from(JSON.stringify(strategy)).toString(
      'base64'
    );

    navigate({
      to: `${PathNames.createStrategy}/?strategy=${encodedStrategy}`,
    });
  };

  return {
    duplicate,
    populateStrategy,
    templateStrategy,
  };
};
