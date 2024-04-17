import { StrategyInputOrder } from 'hooks/useStrategyInput';
import { OrderCreate } from 'components/strategies/create/useOrder';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { SafeDecimal } from 'libs/safedecimal';

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
  buy: OrderCreate | StrategyInputOrder,
  sell: OrderCreate | StrategyInputOrder
): boolean => {
  const isSellMinInBuyRange =
    +sell.min < +buy.max &&
    +sell.min >= +buy.min &&
    +sell.min !== 0 &&
    +buy.min !== 0;
  const isSellMaxAboveBuyMax = +sell.max >= +buy.max;

  return isSellMinInBuyRange && isSellMaxAboveBuyMax;
};

export const checkIfOrdersReversed = (
  buyRaw: OrderCreate | StrategyInputOrder,
  sellRaw: OrderCreate | StrategyInputOrder
): boolean => {
  const translateOrder = (order: OrderCreate | StrategyInputOrder) => {
    let orderPrice;
    if ((order as OrderCreate).price !== undefined) {
      orderPrice = +(order as OrderCreate).price;
    } else {
      orderPrice = !order.isRange ? +order.min : 0;
    }

    return {
      price: orderPrice,
      min: +order.min,
      max: +order.max,
    };
  };

  const buy = translateOrder(buyRaw);
  const sell = translateOrder(sellRaw);

  const isSellMinBelowBuyMin = sell.min < buy.min && sell.min !== 0;
  const isSellMaxBelowBuyMax = sell.max < buy.max && sell.max !== 0;
  const isSellRangeSameAsBuyRange =
    sell.min === buy.min &&
    sell.max === buy.max &&
    buy.min !== 0 &&
    buy.max !== 0;

  // 2 range orders
  if (isSellMinBelowBuyMin || isSellMaxBelowBuyMax || isSellRangeSameAsBuyRange)
    return true;

  // limit buy and range sell
  if (buy.price >= sell.min && sell.min !== 0) return true;

  // range buy and limit sell
  if (buy.max >= sell.price && sell.price !== 0) return true;

  // 2 limit orders
  if (buy.price >= sell.price && sell.price !== 0) return true;

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

export const checkHasArbOpportunity = (
  externalMarketPrice: number,
  oldMarketPrice?: SafeDecimal
): boolean => {
  if (!oldMarketPrice) return false;

  const hasArbOpportunity = new SafeDecimal(externalMarketPrice)
    .div(oldMarketPrice)
    .minus(1)
    .abs()
    .gte(0.05);

  return hasArbOpportunity;
};

interface HasWarningParams {
  order0: OrderCreate;
  order1: OrderCreate;
  buyOutsideMarket: boolean;
  sellOutsideMarket: boolean;
  isOverlapping: boolean;
  externalMarketPrice: number;
  oldMarketPrice?: SafeDecimal;
}

export const hasWarning = ({
  order0,
  order1,
  buyOutsideMarket,
  sellOutsideMarket,
  isOverlapping,
  externalMarketPrice,
  oldMarketPrice,
}: HasWarningParams) => {
  if (isOverlapping) {
    const minAboveMarket = isMinAboveMarket(order0);
    const maxBelowMarket = isMaxBelowMarket(order1);

    const hasArbOpportunity = checkHasArbOpportunity(
      externalMarketPrice,
      oldMarketPrice
    );

    return minAboveMarket || maxBelowMarket || hasArbOpportunity;
  } else {
    return (
      checkIfOrdersOverlap(order0, order1) ||
      buyOutsideMarket ||
      sellOutsideMarket
    );
  }
};
