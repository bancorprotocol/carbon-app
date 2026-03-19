import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { GradientOrderBlock, QuickGradientOrderBlock } from '../types';
import { defaultGradientOrder } from './utils';
import {
  defaultQuickGradientOrder,
  quickToGradientOrder,
} from '../quick/utils';
import { ChartPoint, Drawing } from '../d3Chart/D3ChartContext';

export const useGradientOrder = (
  initOrder: GradientOrderBlock,
  saveOrder: (order: Partial<GradientOrderBlock>) => any,
) => {
  const id = useId();
  const timeout = useRef<number>(null);
  const [order, setOrder] = useState(initOrder);

  const set = useCallback(
    (next: Partial<GradientOrderBlock>) => {
      setOrder((current) => defaultGradientOrder({ ...current, ...next }));
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => saveOrder(next), 200);
    },
    [saveOrder],
  );

  useEffect(() => {
    setOrder(initOrder);
  }, [initOrder]);

  const drawing = useMemo<Drawing>(
    () => ({
      id: id,
      mode: 'line',
      points: [
        {
          x: order.startDate,
          y: Number(order.startPrice),
        },
        {
          x: order.endDate,
          y: Number(order.endPrice),
        },
      ],
    }),
    [id, order.endDate, order.endPrice, order.startDate, order.startPrice],
  );

  const onDrawingUpdate = useCallback(
    (points: ChartPoint[]) => {
      if (!points.length) return; // Prevent delete
      const copy = structuredClone(points);
      const [start, end] = copy.sort((a, b) => Number(a.x) - Number(b.x));
      set({
        startPrice: start.y.toString(),
        endPrice: end.y.toString(),
        startDate: start.x,
        endDate: end.x,
      });
    },
    [set],
  );

  return {
    drawing,
    onDrawingUpdate,
    order,
    setOrder: set,
  };
};

export const useQuickGradientOrder = (
  initOrder: QuickGradientOrderBlock,
  saveOrder: (order: Partial<GradientOrderBlock>) => any,
) => {
  const id = useId();
  const timeout = useRef<number>(null);
  const [order, setOrder] = useState(initOrder);

  const set = useCallback(
    (next: Partial<QuickGradientOrderBlock>) => {
      setOrder((current) => defaultQuickGradientOrder({ ...current, ...next }));
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => saveOrder(next), 200);
    },
    [saveOrder],
  );

  useEffect(() => {
    setOrder(initOrder);
  }, [initOrder]);

  const drawing = useMemo<Drawing>(
    () => ({
      id: id,
      mode: 'line',
      points: [
        {
          x: '0',
          y: Number(order.startPrice),
        },
        {
          x: order.deltaTime,
          y: Number(order.endPrice),
        },
      ],
    }),
    [id, order.startPrice, order.deltaTime, order.endPrice],
  );

  const onDrawingUpdate = useCallback(
    (points: ChartPoint[]) => {
      if (!points.length) return; // Prevent delete
      const copy = structuredClone(points);
      const [start, end] = copy.sort((a, b) => Number(a.x) - Number(b.x));
      set({
        startPrice: start.y.toString(),
        endPrice: end.y.toString(),
        deltaTime: end.x,
      });
    },
    [set],
  );

  return {
    drawing,
    onDrawingUpdate,
    order,
    setOrder: set,
    gradientOrder: quickToGradientOrder(order),
  };
};
