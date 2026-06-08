import { GradientType } from '@bancor/carbon-sdk';
import { SafeDecimal } from 'libs/safedecimal';
import { FormGradientOrder } from '../types';
import { StrategyDirection } from 'libs/routing';
import { Token } from 'libs/tokens';
import { isZero } from '../utils';

export const STRATEGY_TYPE_SHIFT = 248n;
export const GRADIENT_STRATEGY_TYPE_MASK = 1n << 255n;
export const STRATEGY_TYPE_VALUE_MASK = (1n << STRATEGY_TYPE_SHIFT) - 1n;

export function isGradientStrategyId(id: bigint) {
  return (id & GRADIENT_STRATEGY_TYPE_MASK) !== 0n;
}

export const getGradientType = (
  order: FormGradientOrder,
  direction: StrategyDirection,
) => {
  const goUp = new SafeDecimal(order.startPrice).lt(order.endPrice);
  const increase = direction === 'buy' ? goUp : !goUp;
  return increase ? GradientType.LINEAR_INCREASE : GradientType.LINEAR_DECREASE;
};

interface GradientStrategyEdit {
  base: Token;
  quote: Token;
  buy: FormGradientOrder;
  sell: FormGradientOrder;
}

export const createGradientStrategyParams = (strategy: GradientStrategyEdit) =>
  [
    strategy.base.address,
    strategy.quote.address,
    ...createGradientOrderParams(strategy.buy, 'buy'),
    ...createGradientOrderParams(strategy.sell, 'sell'),
  ] as const;

const createGradientOrderParams = (
  order: FormGradientOrder,
  direction: StrategyDirection,
) => {
  const empty = isZero(order.startPrice) && isZero(order.endPrice);
  if (empty)
    return [
      '0',
      '0',
      order.budget,
      0,
      0,
      GradientType.LINEAR_INCREASE,
    ] as const;
  return [
    order.startPrice || '0',
    order.endPrice || '0',
    order.budget || '0',
    Number(order.startDate),
    Number(order.endDate),
    getGradientType(order, direction),
  ] as const;
};
