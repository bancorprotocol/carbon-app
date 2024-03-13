import { StrategyInputOrder } from 'hooks/useStrategyInput';
import { OrderCreate } from 'components/strategies/create/useOrder';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';

interface ValidOrderParams {
  isRange: boolean;
  min: string;
  max: string;
  price: string;
}

export const isValidOrder = (order: ValidOrderParams) => {
  return order.isRange
    ? isValidRange(order.min, order.max)
    : isValidLimit(order.price);
};

export const isEmptyOrder = (order: ValidOrderParams) => {
  return !Number(order.price) && !Number(order.min) && !Number(order.max);
};

export const isValidLimit = (value: string) => {
  const price = Number(value);
  return !isNaN(price) && price > 0;
};

export const isValidRange = (minStr: string, maxStr: string) => {
  const min = Number(minStr);
  const max = Number(maxStr);
  return !isNaN(min) && !isNaN(max) && min > 0 && min < max;
};

export const checkIfOrdersOverlap = (
  orderA: OrderCreate,
  orderB: OrderCreate
): boolean => {
  if (
    +orderB.min < +orderA.max &&
    orderB.max > orderA.max &&
    +orderB.min > +orderA.min &&
    +orderB.min !== 0 &&
    +orderA.min !== 0
  ) {
    return true;
  }
  return false;
};

export const checkIfOrdersReversed = (
  orderA: OrderCreate, // buy
  orderB: OrderCreate // sell
): boolean => {
  if (
    // 2 range orders
    (+orderB.min < +orderA.min && +orderB.min !== 0) ||
    (+orderB.max < +orderA.max && +orderB.max !== 0) ||
    (+orderB.min === +orderA.min &&
      +orderB.max === +orderA.max &&
      +orderA.min !== 0 &&
      +orderA.min !== 0 &&
      +orderB.max !== 0 &&
      +orderB.min !== 0) ||
    // limit buy and range sell
    (+orderA.price >= +orderB.min && +orderB.min !== 0) ||
    // range buy and limit sell
    (+orderA.max >= +orderB.price && +orderB.price !== 0) ||
    // 2 limit orders
    (+orderA.price >= +orderB.price && +orderB.price !== 0)
  ) {
    return true;
  }
  return false;
};

export const checkOrdersOverlap = (
  buy: StrategyInputOrder,
  sell: StrategyInputOrder
): boolean => {
  if (
    +sell.min < +buy.max &&
    sell.max > buy.max &&
    +sell.min > +buy.min &&
    +sell.min !== 0 &&
    +buy.min !== 0
  ) {
    return true;
  }
  return false;
};

export const checkOrdersReversed = (
  buy: StrategyInputOrder,
  sell: StrategyInputOrder
): boolean => {
  if (
    // 2 range orders
    (buy.isRange &&
      sell.isRange &&
      ((+sell.min < +buy.min && +sell.min !== 0) ||
        (+sell.max < +buy.max && +sell.max !== 0) ||
        (+sell.max === +buy.max &&
          +sell.min === +buy.min &&
          +sell.min !== 0 &&
          +sell.max !== 0 &&
          +buy.min !== 0 &&
          +buy.max !== 0))) ||
    // limit buy and range sell
    (!buy.isRange &&
      sell.isRange &&
      +buy.min >= +sell.min &&
      +sell.min !== 0) ||
    // range buy and limit sell
    (buy.isRange &&
      !sell.isRange &&
      +buy.max >= +sell.min &&
      +sell.min !== 0) ||
    // 2 limit orders
    (!buy.isRange && !sell.isRange && +buy.min >= +sell.min && +sell.min !== 0)
  ) {
    return true;
  }
  return false;
};

export const getStatusTextByTxStatus = (
  isAwaiting: boolean,
  isProcessing: boolean
): string | undefined => {
  if (isAwaiting) return 'Waiting for Confirmation';
  if (isProcessing) return 'Processing';
  return;
};

interface HasWarningParams {
  order0: OrderCreate;
  order1: OrderCreate;
  buyOutsideMarket: boolean;
  sellOutsideMarket: boolean;
  isOverlapping: boolean;
}

export const hasWarning = ({
  order0,
  order1,
  buyOutsideMarket,
  sellOutsideMarket,
  isOverlapping,
}: HasWarningParams) => {
  if (isOverlapping) {
    const minAboveMarket = isMinAboveMarket(order0);
    const maxBelowMarket = isMaxBelowMarket(order1);
    return minAboveMarket || maxBelowMarket;
  } else {
    return (
      checkOrdersOverlap(order0, order1) ||
      buyOutsideMarket ||
      sellOutsideMarket
    );
  }
};
