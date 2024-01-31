import { D3ChartHandle } from 'libs/d3/charts/candlestick/D3ChartHandle';
import { D3ChartRect } from 'libs/d3/charts/candlestick/D3ChartRect';
import {
  getHandleSelector,
  getRectSelector,
  handleStateChange,
  onDragHandler,
  onDragRectHandler,
} from 'libs/d3/charts/candlestick/utils';
import { D3ChartSettings } from 'libs/d3/types';
import { useEffect, useRef } from 'react';

type OrderRangeProps = {
  type: 'buy' | 'sell';
  onMinMaxChange: (type: 'buy' | 'sell', min: number, max: number) => void;
  labels: { min: string; max: string };
  yPos: { min: number; max: number };
  dms: D3ChartSettings;
  isLimit: boolean;
};

export const DragablePriceRange = ({
  type,
  onMinMaxChange,
  labels,
  yPos,
  dms,
  isLimit,
}: OrderRangeProps) => {
  const isHovering = useRef(false);
  const color = type === 'buy' ? '#00B578' : '#D86371';

  const selectorRect = getRectSelector(type);
  const selectorH1 = getHandleSelector(type, 'line1');
  const selectorH2 = getHandleSelector(type, 'line2');

  const onDragRect = (y: number, y2: number) =>
    onDragRectHandler({ type, y, y2, onMinMaxChange });

  const onDragH1 = (y: number) =>
    onDragHandler({ type, id: 'line1', y, onMinMaxChange, isLimit });

  const onDragH2 = (y: number) =>
    onDragHandler({ type, id: 'line2', y, onMinMaxChange });

  useEffect(() => {
    if (isHovering.current) {
      return;
    }

    handleStateChange({ type, id: 'line1', y: yPos.max, isLimit });
    !isLimit && handleStateChange({ type, id: 'line2', y: yPos.min });
  }, [isLimit, type, yPos.max, yPos.min]);

  return (
    <g
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      onMouseLeave={() => {
        isHovering.current = false;
      }}
    >
      {!isLimit && (
        <D3ChartRect
          selector={selectorRect}
          dms={dms}
          onDrag={onDragRect}
          color={color}
        />
      )}
      <D3ChartHandle
        selector={selectorH1}
        label={labels.max}
        dms={dms}
        onDrag={onDragH1}
        color={color}
      />
      {!isLimit && (
        <D3ChartHandle
          selector={selectorH2}
          label={labels.min}
          dms={dms}
          onDrag={onDragH2}
          color={color}
        />
      )}
    </g>
  );
};
