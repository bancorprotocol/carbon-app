import { hourFormatter, toUnixUTC } from 'components/simulator/utils';
import { GradientOrderBlock, QuickGradientOrderBlock } from '../types';
import { addMinutes } from 'date-fns';
import { GradientMultipliers } from '../gradient/utils';

export const defaultQuickGradientOrder = (
  baseOrder: Partial<QuickGradientOrderBlock>,
  multiplier: GradientMultipliers,
  marketPrice: number = 0,
): QuickGradientOrderBlock => {
  const direction = baseOrder.direction ?? 'sell';
  const startMultiplier = multiplier.start;
  const endMultiplier = multiplier.end;
  const defaultStartPrice = (marketPrice * startMultiplier).toString();
  const defaultEndPrice = (marketPrice * endMultiplier).toString();
  const order: QuickGradientOrderBlock = {
    startPrice: baseOrder.startPrice ?? defaultStartPrice,
    endPrice: baseOrder.endPrice ?? defaultEndPrice,
    deltaTime: baseOrder.deltaTime ?? '30',
    budget: baseOrder.budget ?? '',
    direction: direction,
  };
  return {
    ...order,
    marginalPrice: order.startPrice,
  };
};

export const quickToGradientOrder = (
  order: QuickGradientOrderBlock,
): GradientOrderBlock => {
  const { deltaTime, ...baseOrder } = order;
  const today = new Date();
  return {
    ...baseOrder,
    startDate: toUnixUTC(today),
    endDate: toUnixUTC(addMinutes(today, Number(deltaTime))),
  };
};

export const formatQuickTime = (deltaTime: string) => {
  return hourFormatter.format(addMinutes(new Date(), Number(deltaTime)));
};
