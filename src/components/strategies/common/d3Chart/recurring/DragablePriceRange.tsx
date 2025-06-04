import { D3ChartHandle } from 'components/strategies/common/d3Chart/recurring/D3ChartHandle';
import { D3ChartPriceOutOfScale } from 'components/strategies/common/d3Chart/D3ChartPriceOutOfScale';
import { D3ChartRectDraggable } from 'components/strategies/common/d3Chart/recurring/D3ChartRectDraggable';
import {
  handleStateChange,
  onDragHandler,
  onDragRectHandler,
} from 'components/strategies/common/d3Chart/recurring/utils';
import {
  getHandleSelector,
  getRectSelector,
} from 'components/strategies/common/d3Chart/utils';
import { useCallback, useEffect, useRef } from 'react';
import { useD3ChartCtx } from '../D3ChartContext';

type OrderRangeProps = {
  type: 'buy' | 'sell';
  onMinMaxChange: (type: 'buy' | 'sell', min: number, max: number) => void;
  onDragEnd?: (type: 'buy' | 'sell', y?: number, y2?: number) => void;
  labels: { min: string; max: string };
  yPos: { min: number; max: number };
  isLimit: boolean;
  readonly?: boolean;
};

export const DragablePriceRange = ({
  type,
  onMinMaxChange,
  onDragEnd,
  labels,
  yPos,
  isLimit,
  readonly,
}: OrderRangeProps) => {
  const { dms } = useD3ChartCtx();
  const isDragging = useRef(false);
  const color = type === 'buy' ? 'var(--buy)' : 'var(--sell)';
  const maxIsOutOfScale = yPos.max <= 0;
  const minIsOutOfScale = yPos.min >= dms.boundedHeight;

  const isH1Max = useRef(true);
  const isH2Max = useRef(false);

  const selectorRect = getRectSelector(type);
  const selectorH1 = getHandleSelector(type, 'line1');
  const selectorH2 = getHandleSelector(type, 'line2');

  const onDragRect = useCallback(
    (y: number, y2: number) => {
      isH1Max.current = true;
      isH2Max.current = false;
      onDragRectHandler({ type, y, y2, onMinMaxChange });
    },
    [onMinMaxChange, type],
  );

  const onDragEndHandler = useCallback(
    (yH1?: number, yH2?: number) => {
      onDragEnd?.(type, yH1, yH2);
      isH1Max.current = true;
      isH2Max.current = false;
      isDragging.current = false;
    },
    [onDragEnd, type],
  );

  const onDragStartHandler = useCallback(() => {
    isDragging.current = true;
  }, []);

  const onDragH1 = useCallback(
    (y: number) => {
      const isFlipped = onDragHandler({
        type,
        id: 'line1',
        y,
        onMinMaxChange,
        isLimit,
      });
      isH1Max.current = !!isFlipped;
      isH2Max.current = !isFlipped;
    },
    [isLimit, onMinMaxChange, type],
  );

  const onDragH2 = useCallback(
    (y: number) => {
      const isFlipped = onDragHandler({ type, id: 'line2', y, onMinMaxChange });
      isH2Max.current = !!isFlipped;
      isH1Max.current = !isFlipped;
    },
    [onMinMaxChange, type],
  );

  useEffect(() => {
    if (isDragging.current) return;
    handleStateChange({ type, id: 'line1', y: yPos.max, isLimit });
    if (!isLimit) handleStateChange({ type, id: 'line2', y: yPos.min });
  }, [isLimit, type, yPos.max, yPos.min]);

  return (
    <>
      {!isLimit && (
        <D3ChartRectDraggable
          selector={selectorRect}
          dms={dms}
          onDragStart={onDragStartHandler}
          onDrag={onDragRect}
          onDragEnd={onDragEndHandler}
          color={color}
          readonly={readonly}
        />
      )}
      <D3ChartHandle
        selector={selectorH1}
        selectorOpposite={selectorH2}
        label={isH1Max.current ? labels.max : labels.min}
        onDragStart={onDragStartHandler}
        onDrag={onDragH1}
        onDragEnd={onDragEndHandler}
        color={color}
        isLimit={isLimit}
        readonly={readonly}
      />
      {!isLimit && (
        <D3ChartHandle
          selector={selectorH2}
          selectorOpposite={selectorH1}
          label={isH2Max.current ? labels.max : labels.min}
          onDragStart={onDragStartHandler}
          onDrag={onDragH2}
          onDragEnd={onDragEndHandler}
          color={color}
          isLimit={isLimit}
          readonly={readonly}
        />
      )}
      <D3ChartPriceOutOfScale
        type={type}
        minOutOfScale={minIsOutOfScale}
        maxOutOfScale={maxIsOutOfScale}
        color={color}
      />
    </>
  );
};
