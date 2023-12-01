import { OrderCreate } from '../useOrder';

interface OverlappingStrategy {
  order0: OrderCreate;
  order1: OrderCreate;
  spreadPPM: number;
}
// TODO: Remove budget if minAboveMarket or maxBelowMarket
export const prepareOverlappingOrders = (props: OverlappingStrategy) => {
  const { order0, order1, spreadPPM } = props;
  console.log({ order0, order1 });
  // order0.max = getBuyMax(Number(order1.max), spreadPPM).toString();
  // order1.min = getSellMin(Number(order0.min), spreadPPM).toString();
  return { order0, order1 };
};
