import { hourFormatter, toUnixUTC } from 'components/simulator/utils';
import { GradientOrderBlock, QuickGradientOrderBlock } from '../types';
import { addMinutes } from 'date-fns';

export const defaultQuickGradientOrder = (
  baseOrder: Partial<QuickGradientOrderBlock>,
  marketPrice: number = 0,
): QuickGradientOrderBlock => {
  const direction = baseOrder.direction ?? 'sell';
  const startMultiplier = direction === 'buy' ? 0.95 : 1.05;
  const endMultiplier = direction === 'buy' ? 0.99 : 1.01;
  const order: QuickGradientOrderBlock = {
    _sP_: baseOrder._sP_ ?? (marketPrice * startMultiplier).toString(),
    _eP_: baseOrder._eP_ ?? (marketPrice * endMultiplier).toString(),
    deltaTime: baseOrder.deltaTime ?? '30',
    budget: baseOrder.budget ?? '',
    direction: direction,
  };
  return {
    ...order,
    marginalPrice: order._sP_,
  };
};

export const quickToGradientOrder = (
  order: QuickGradientOrderBlock,
): GradientOrderBlock => {
  const { deltaTime, ...baseOrder } = order;
  const today = new Date();
  return {
    ...baseOrder,
    _sD_: toUnixUTC(today),
    _eD_: toUnixUTC(addMinutes(today, Number(deltaTime))),
  };
};

export const formatQuickTime = (deltaTime: string) => {
  return hourFormatter.format(addMinutes(new Date(), Number(deltaTime)));
};
