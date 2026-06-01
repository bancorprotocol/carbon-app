import { GradientType } from '@bancor/carbon-sdk';
import { SafeDecimal } from 'libs/safedecimal';
import { FormGradientOrder } from '../types';
import { StrategyDirection } from 'libs/routing';
import { Token } from 'libs/tokens';

export const STRATEGY_TYPE_SHIFT = 248n;
export const GRADIENT_STRATEGY_TYPE_MASK = 1n << 255n;
export const STRATEGY_TYPE_VALUE_MASK = (1n << STRATEGY_TYPE_SHIFT) - 1n;

export function isGradientStrategyId(id: bigint) {
  return (id & GRADIENT_STRATEGY_TYPE_MASK) !== 0n;
}

const getGradientType = (
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
    strategy.buy.startPrice || '0',
    strategy.buy.endPrice || '0',
    strategy.buy.budget || '0',
    Number(strategy.buy.startDate),
    Number(strategy.buy.endDate),
    getGradientType(strategy.buy, 'buy') as any,
    strategy.sell.startPrice || '0',
    strategy.sell.endPrice || '0',
    strategy.sell.budget || '0',
    Number(strategy.sell.startDate),
    Number(strategy.sell.endDate),
    getGradientType(strategy.sell, 'sell') as any,
  ] as const;
