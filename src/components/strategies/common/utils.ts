import { Order } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { formatNumber } from 'utils/helpers';
import { BaseOrder } from './types';

export const emptyOrder = (): BaseOrder => ({
  min: '0',
  max: '0',
  budget: '0',
  marginalPrice: '',
});

export const isEmptyOrder = (order: Order) => {
  return !Number(order.startRate) && !Number(order.endRate);
};
export const isLimitOrder = (order: Order) => {
  return order.startRate === order.endRate;
};

/** Check if a string value is zero-like value, null or undefined */
export const isZero = (value?: string): value is '' | '0' | '.' | undefined => {
  if (!value) return true;
  return !+formatNumber(value);
};

/** Check if a string value is zero-like value, but not empty string */
export const isTouchedZero = (value: string): value is '0' | '.' => {
  if (!value) return false;
  return !+formatNumber(value);
};

interface OutsideMarketParams {
  base?: Token;
  min?: string;
  max?: string;
  marketPrice?: number;
  buy?: boolean;
}
export const outSideMarketWarning = (params: OutsideMarketParams) => {
  const { base, min, max, marketPrice, buy } = params;
  if (!marketPrice) return;
  if (buy) {
    const price = isZero(max) ? min : max;
    if (isZero(price)) return;
    if (new SafeDecimal(price).gt(marketPrice)) {
      return `Notice: you offer to buy ${base?.symbol} above current market price`;
    }
  } else {
    const price = isZero(min) ? max : min;
    if (isZero(price)) return;
    if (new SafeDecimal(price).lt(marketPrice)) {
      return `Notice: you offer to sell ${base?.symbol} below current market price`;
    }
  }
};
