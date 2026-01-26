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
          x: order._sD_,
          y: Number(order._sP_),
        },
        {
          x: order._eD_,
          y: Number(order._eP_),
        },
      ],
    }),
    [id, order._eD_, order._eP_, order._sD_, order._sP_],
  );

  const onDrawingUpdate = useCallback(
    (points: ChartPoint[]) => {
      if (!points.length) return; // Prevent delete
      const copy = structuredClone(points);
      const [start, end] = copy.sort((a, b) => Number(a.x) - Number(b.x));
      set({
        _sP_: start.y.toString(),
        _eP_: end.y.toString(),
        _sD_: start.x,
        _eD_: end.x,
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
          y: Number(order._sP_),
        },
        {
          x: order.deltaTime,
          y: Number(order._eP_),
        },
      ],
    }),
    [id, order._sP_, order.deltaTime, order._eP_],
  );

  const onDrawingUpdate = useCallback(
    (points: ChartPoint[]) => {
      if (!points.length) return; // Prevent delete
      const copy = structuredClone(points);
      const [start, end] = copy.sort((a, b) => Number(a.x) - Number(b.x));
      set({
        _sP_: start.y.toString(),
        _eP_: end.y.toString(),
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
