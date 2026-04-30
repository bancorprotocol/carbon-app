import { SafeDecimal } from 'libs/safedecimal';
import { GradientOrderBlock } from '../types';
import {
  defaultGradientEndDate,
  defaultGradientStartDate,
  gradientMarginalPrice,
} from '../gradient/utils';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChartPoint, Drawing } from '../d3Chart/D3ChartContext';

export const deltaTypes = ['percent', 'token'] as const;
export type DeltaType = (typeof deltaTypes)[number];

export const toDelta = (
  type: DeltaType,
  order: GradientOrderBlock,
  otherOrder: GradientOrderBlock,
) => {
  const start = new SafeDecimal(order.startPrice);
  const otherStart = new SafeDecimal(otherOrder.startPrice);
  if (type === 'percent') {
    return start.minus(otherStart).toString();
  } else {
    return start.div(otherStart).minus(1).mul(100).toString();
  }
};
export const fromDelta = (
  type: DeltaType,
  delta: string,
  otherPrice: string,
) => {
  const price = new SafeDecimal(otherPrice);
  if (type === 'percent') {
    return price.add(delta).toString();
  } else {
    const percent = new SafeDecimal(delta).div(100).add(1);
    return price.mul(percent).toString();
  }
};

export const defaultChannelOrder = (
  baseOrder: Partial<GradientOrderBlock>,
  marketPrice: number = 0,
) => {
  const direction = baseOrder.direction ?? 'sell';
  const multiplier = direction === 'buy' ? 0.99 : 1.01;
  const price = new SafeDecimal(marketPrice ?? 0);
  const order: GradientOrderBlock = {
    startPrice: baseOrder.startPrice ?? price.mul(multiplier).toString(),
    endPrice: baseOrder.endPrice ?? price.mul(multiplier).toString(),
    startDate: baseOrder.startDate ?? defaultGradientStartDate,
    endDate: baseOrder.endDate ?? defaultGradientEndDate,
    budget: baseOrder.budget ?? '',
    direction: direction,
  };
  return {
    ...order,
    marginalPrice: gradientMarginalPrice(order),
  };
};

export const useGradientChannelOrder = (
  buyOrder: GradientOrderBlock,
  sellOrder: GradientOrderBlock,
  saveBuyOrder: (order: Partial<GradientOrderBlock>) => any,
  saveSellOrder: (order: Partial<GradientOrderBlock>) => any,
) => {
  const id = useId();
  const sellTimeout = useRef<number>(null);
  const buyTimeout = useRef<number>(null);
  const [localSell, setLocalSell] = useState(sellOrder);
  const [localBuy, setLocalBuy] = useState(buyOrder);

  const setSell = useCallback(
    (next: Partial<GradientOrderBlock>) => {
      setLocalSell((current) => {
        return defaultChannelOrder({ ...current, ...next });
      });
      if (sellTimeout.current) clearTimeout(sellTimeout.current);
      sellTimeout.current = setTimeout(() => saveSellOrder(next), 200);
    },
    [saveSellOrder],
  );
  const setBuy = useCallback(
    (next: Partial<GradientOrderBlock>) => {
      setLocalBuy((current) => {
        return defaultChannelOrder({ ...current, ...next });
      });
      if (buyTimeout.current) clearTimeout(buyTimeout.current);
      buyTimeout.current = setTimeout(() => saveBuyOrder(next), 200);
    },
    [saveBuyOrder],
  );

  useEffect(() => setLocalBuy(buyOrder), [buyOrder]);
  useEffect(() => setLocalSell(sellOrder), [sellOrder]);

  const drawing = useMemo<Drawing>(
    () => ({
      id: id,
      mode: 'channel',
      points: [
        {
          x: localSell.startDate,
          y: Number(localSell.startPrice),
        },
        {
          x: localSell.endDate,
          y: Number(localSell.endPrice),
        },
        {
          x: localBuy.startDate,
          y: Number(localBuy.startPrice),
        },
        {
          x: localBuy.endDate,
          y: Number(localBuy.endPrice),
        },
      ],
    }),
    [
      id,
      localBuy.endDate,
      localBuy.endPrice,
      localBuy.startDate,
      localBuy.startPrice,
      localSell.endDate,
      localSell.endPrice,
      localSell.startDate,
      localSell.startPrice,
    ],
  );

  const onDrawingUpdate = useCallback(
    (points: ChartPoint[]) => {
      if (!points.length) return; // Prevent delete
      const copy = structuredClone(points);
      const [buyStart, sellStart, buyEnd, sellEnd] = copy.sort((a, b) => {
        return a.x === b.x
          ? Number(a.y) - Number(b.y)
          : Number(a.x) - Number(b.x);
      });
      setSell({
        startPrice: sellStart.y.toString(),
        endPrice: sellEnd.y.toString(),
        startDate: sellStart.x,
        endDate: sellEnd.x,
      });
      setBuy({
        startPrice: buyStart.y.toString(),
        endPrice: buyEnd.y.toString(),
        startDate: buyStart.x,
        endDate: buyEnd.x,
      });
    },
    [setBuy, setSell],
  );

  return {
    drawing,
    onDrawingUpdate,
    buy: localBuy,
    sell: localSell,
    setBuy,
    setSell,
  };
};
