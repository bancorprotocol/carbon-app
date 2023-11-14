import { SafeDecimal } from 'libs/safedecimal';
import { OrderCreate } from '../useOrder';

interface SymmetricStrategy {
  order0: OrderCreate;
  order1: OrderCreate;
  spreadPPM: number;
}
// TODO: Remove budget if minAboveMarket or maxBelowMarket
export const prepareSymmetricOrders = (props: SymmetricStrategy) => {
  const { order0, order1, spreadPPM } = props;
  const min = new SafeDecimal(order0.min);
  const max = new SafeDecimal(order0.max);
  const spread = max.minus(min).times(spreadPPM).div(100);
  order0.min = min.toString();
  order0.max = max.minus(spread).toString();
  order1.min = min.plus(spread).toString();
  order1.max = max.toString();
  return { order0, order1 };
};
