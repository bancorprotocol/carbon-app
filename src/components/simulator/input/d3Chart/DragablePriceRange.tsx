import { D3ChartHandle } from 'components/simulator/input/d3Chart/D3ChartHandle';
import { D3ChartPriceOutOfScale } from 'components/simulator/input/d3Chart/D3ChartPriceOutOfScale';
import { D3ChartRect } from 'components/simulator/input/d3Chart/D3ChartRect';
import {
  getHandleSelector,
  getRectSelector,
  handleStateChange,
  onDragHandler,
  onDragRectHandler,
} from 'components/simulator/input/d3Chart/utils';
import { D3ChartSettings } from 'libs/d3/types';
import { useCallback, useEffect, useRef } from 'react';

type OrderRangeProps = {
  type: 'buy' | 'sell';
  onMinMaxChange: (type: 'buy' | 'sell', min: number, max: number) => void;
  onDragEnd?: (type: 'buy' | 'sell', y?: number, y2?: number) => void;
  labels: { min: string; max: string };
  yPos: { min: number; max: number };
  dms: D3ChartSettings;
  isLimit: boolean;
};

export const DragablePriceRange = ({
  type,
  onMinMaxChange,
  onDragEnd,
  labels,
  yPos,
  dms,
  isLimit,
}: OrderRangeProps) => {
  const isDragging = useRef(false);
  const color = type === 'buy' ? '#00B578' : '#D86371';
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
    [onMinMaxChange, type]
  );

  const onDragEndHandler = useCallback(
    (yH1?: number, yH2?: number) => {
      onDragEnd?.(type, yH1, yH2);
      isH1Max.current = true;
      isH2Max.current = false;
      isDragging.current = false;
    },
    [onDragEnd, type]
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
    [isLimit, onMinMaxChange, type]
  );

  const onDragH2 = useCallback(
    (y: number) => {
      const isFlipped = onDragHandler({ type, id: 'line2', y, onMinMaxChange });
      isH2Max.current = !!isFlipped;
      isH1Max.current = !isFlipped;
    },
    [onMinMaxChange, type]
  );

  useEffect(() => {
    if (isDragging.current) {
      return;
    }

    handleStateChange({ type, id: 'line1', y: yPos.max, isLimit });
    !isLimit && handleStateChange({ type, id: 'line2', y: yPos.min });
  }, [isLimit, type, yPos.max, yPos.min]);

  return (
    <>
      {!isLimit && (
        <D3ChartRect
          selector={selectorRect}
          dms={dms}
          onDragStart={onDragStartHandler}
          onDrag={onDragRect}
          onDragEnd={onDragEndHandler}
          color={color}
        />
      )}
      <D3ChartHandle
        selector={selectorH1}
        selectorOpposite={selectorH2}
        label={isH1Max.current ? labels.max : labels.min}
        dms={dms}
        onDragStart={onDragStartHandler}
        onDrag={onDragH1}
        onDragEnd={onDragEndHandler}
        color={color}
        isLimit={isLimit}
      />
      {!isLimit && (
        <D3ChartHandle
          selector={selectorH2}
          selectorOpposite={selectorH1}
          label={isH2Max.current ? labels.max : labels.min}
          dms={dms}
          onDragStart={onDragStartHandler}
          onDrag={onDragH2}
          onDragEnd={onDragEndHandler}
          color={color}
          isLimit={isLimit}
        />
      )}
      <D3ChartPriceOutOfScale
        type={type}
        minOutOfScale={minIsOutOfScale}
        maxOutOfScale={maxIsOutOfScale}
        color={color}
        dms={dms}
      />
    </>
  );
};
