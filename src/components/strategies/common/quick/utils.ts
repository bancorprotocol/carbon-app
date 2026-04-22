import { hourFormatter, toUnixUTC } from 'components/simulator/utils';
import { GradientOrderBlock, QuickGradientOrderBlock } from '../types';
import { addMinutes } from 'date-fns';
import { StrategyDirection } from 'libs/routing';
import { DrawingMode } from '../d3Chart/drawing/DrawingMenu';

const getStartMultiplier = (
  mode: DrawingMode,
  direction: StrategyDirection,
) => {
  if (mode === 'line') {
    return direction === 'buy' ? 0.95 : 1.05;
  } else if (mode === 'channel') {
    return direction === 'buy' ? 0.95 : 1.05;
  } else {
    return direction === 'buy' ? 0.95 : 1.05;
  }
};

const getEndMultiplier = (mode: DrawingMode, direction: StrategyDirection) => {
  if (mode === 'line') {
    return direction === 'buy' ? 0.99 : 1.01;
  } else if (mode === 'channel') {
    return direction === 'buy' ? 0.95 : 1.05;
  } else {
    return direction === 'buy' ? 0.99 : 1.01;
  }
};

export const defaultQuickGradientOrder = (
  mode: DrawingMode,
  baseOrder: Partial<QuickGradientOrderBlock>,
  marketPrice: number = 0,
): QuickGradientOrderBlock => {
  const direction = baseOrder.direction ?? 'sell';
  const startMultiplier = getStartMultiplier(mode, direction);
  const endMultiplier = getEndMultiplier(mode, direction);
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
