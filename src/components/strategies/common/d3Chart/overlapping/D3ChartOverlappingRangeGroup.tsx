import { D3ChartRect } from 'components/strategies/common/d3Chart/D3ChartRect';
import { drag, Selection } from 'd3';
import {
  getRectSelector,
  getSelector,
  useSelectable,
} from 'components/strategies/common/d3Chart/utils';
import { useEffect, useState } from 'react';
import { useD3ChartCtx } from '../D3ChartContext';

interface Props {
  readonly?: boolean;
  onDragStart?: (y: number, y2: number) => void;
  onDrag?: (y: number, y2: number) => void;
  onDragEnd?: (y: number, y2: number) => void;
}

export const D3ChartOverlappingRangeGroup = ({
  readonly,
  onDragStart,
  onDrag,
  onDragEnd,
}: Props) => {
  const { dms } = useD3ChartCtx();
  const selector = 'overlapping-range-group';
  const selection = getSelector(selector);
  const selectorRectBuy = getRectSelector('buy');
  const selectorRectSell = getRectSelector('sell');
  const [isDragging, setIsDragging] = useState(false);
  const isSelectable = useSelectable(selector);

  useEffect(() => {
    if (readonly || !isSelectable || !onDrag) return;
    const handleDrag = drag()
      .subject(() => {
        const y = Number(getSelector(selectorRectSell).attr('y'));
        const heightSell = Number(getSelector(selectorRectSell).attr('height'));
        const heightBuy = Number(getSelector(selectorRectBuy).attr('height'));
        const height = heightSell + heightBuy;
        return { y, height };
      })
      .on('start', ({ y, subject: { height } }) => {
        setIsDragging(true);
        onDragStart?.(y, y + height);
      })
      .on('drag', ({ y, subject: { height } }) => {
        onDrag?.(y, y + height);
      })
      .on('end', ({ y, subject: { height } }) => {
        setIsDragging(false);
        onDragEnd?.(y, y + height);
      });
    handleDrag(selection as Selection<Element, unknown, any, any>);
  }, [
    isSelectable,
    onDrag,
    selection,
    readonly,
    selectorRectSell,
    selectorRectBuy,
    onDragStart,
    onDragEnd,
  ]);

  return (
    <g className={selector}>
      <D3ChartRect
        readonly={readonly}
        selector={selectorRectBuy}
        isDragging={isDragging}
        width={dms.boundedWidth}
        fill="var(--buy)"
      />
      <D3ChartRect
        readonly={readonly}
        selector={selectorRectSell}
        isDragging={isDragging}
        width={dms.boundedWidth}
        fill="var(--sell)"
      />
    </g>
  );
};
