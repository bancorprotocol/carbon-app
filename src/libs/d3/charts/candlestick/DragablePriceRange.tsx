import { ScaleLinear } from 'd3';
import { ChartY, UseStrategyInputReturn } from 'hooks/useStrategyInput';
import { D3ChartHandle } from 'libs/d3/charts/candlestick/D3ChartHandle';
import { D3ChartRect } from 'libs/d3/charts/candlestick/D3ChartRect';
import {
  getHandleSelector,
  getRectSelector,
  onDragHandler,
  onDragRectHandler,
} from 'libs/d3/charts/candlestick/utils';
import { D3ChartSettings } from 'libs/d3/types';
import { useRef } from 'react';
import { prettifyNumber } from 'utils/helpers';

type OrderRangeProps = {
  type: 'buy' | 'sell';
  yScale: ScaleLinear<number, number>;
  onDrag: (key: keyof ChartY, value: number) => void;
  state: Record<keyof ChartY, number>;
  dms: D3ChartSettings;
  ctx: UseStrategyInputReturn;
};

export const DragablePriceRange = ({
  type,
  yScale,
  onDrag,
  state,
  dms,
  ctx,
}: OrderRangeProps) => {
  const isHovering = useRef(false);
  const color = type === 'buy' ? '#00B578' : '#D86371';

  // const isLimit = !state[type].isRange;
  const isLimit = false;

  const max = state[`${type}Max`];
  const min = state[`${type}Min`];

  const yMax = yScale.invert(max);
  const yMin = yScale.invert(min);

  const selectorRect = getRectSelector(type);
  const selectorH1 = getHandleSelector(type, 'line1');
  const selectorH2 = getHandleSelector(type, 'line2');

  const onDragRect = (y: number, y2: number) =>
    onDragRectHandler({ type, y, y2, onDrag });

  const onDragEndRect = (y: number, y2: number) => {
    ctx.isDragging.current = false;
    // onDrag(`${type}Max`, y);
    // onDrag(`${type}Min`, y2);
  };

  const onDragStartRect = () => {
    ctx.isDragging.current = true;
  };

  const onDragH1 = (y: number) =>
    onDragHandler({ type, id: 'line1', y, onDrag, isLimit });

  const onDragH2 = (y: number) =>
    onDragHandler({ type, id: 'line2', y, onDrag });

  // useEffect(() => {
  //   if (isHovering.current) {
  //     return;
  //   }
  //
  //   handleStateChange({ type, id: 'line1', y: yMax, isLimit });
  //   !isLimit && handleStateChange({ type, id: 'line2', y: yMin });
  // }, [isLimit, type, yMax, yMin]);

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
          onDragEnd={onDragEndRect}
          onDragStart={onDragStartRect}
          color={color}
        />
      )}
      <D3ChartHandle
        selector={selectorH1}
        label={prettifyNumber(max, { currentCurrency: 'USD' })}
        dms={dms}
        onDrag={onDragH1}
        color={color}
      />
      {!isLimit && (
        <D3ChartHandle
          selector={selectorH2}
          label={prettifyNumber(min, { currentCurrency: 'USD' })}
          dms={dms}
          onDrag={onDragH2}
          color={color}
        />
      )}
    </g>
  );
};
