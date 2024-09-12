import { D3ChartRect } from 'components/strategies/common/d3Chart/D3ChartRect';
import { drag, Selection } from 'd3';
import {
  getSelector,
  useSelectable,
} from 'components/strategies/common/d3Chart/utils';
import { D3ChartSettings } from 'libs/d3/types';
import { useEffect, useState } from 'react';

interface Props {
  selector: string;
  dms: D3ChartSettings;
  onDragStart?: (y: number, y2: number) => void;
  onDrag?: (y: number, y2: number) => void;
  onDragEnd?: (y: number, y2: number) => void;
  initialY?: number;
  color: string;
  readonly?: boolean;
}

export const D3ChartRectDraggable = ({
  selector,
  dms,
  color,
  readonly,
  onDragStart,
  onDrag,
  onDragEnd,
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const isSelectable = useSelectable(selector);

  useEffect(() => {
    if (readonly) return;
    const selection = getSelector(selector);
    const handleDrag = drag()
      .subject(() => ({
        y: Number(selection.attr('y')),
        height: Number(selection.attr('height')),
      }))
      .on('start', ({ y, subject: { height } }) => {
        setIsDragging(true);
        const y2 = y + height;
        onDragStart?.(y2, y);
      })
      .on('drag', ({ y, subject: { height } }) => {
        const y2 = y + height;
        onDrag?.(y, y2);
      })
      .on('end', ({ y, subject: { height } }) => {
        setIsDragging(false);
        const y2 = y + height;
        onDragEnd?.(y2, y);
      });
    if (!isSelectable || !onDrag) return;
    handleDrag(selection as Selection<Element, unknown, any, any>);
  }, [
    isSelectable,
    selector,
    setIsDragging,
    onDrag,
    onDragStart,
    onDragEnd,
    readonly,
  ]);

  return (
    <D3ChartRect
      selector={selector}
      isDragging={isDragging}
      width={dms.boundedWidth}
      fill={color}
      readonly={readonly}
    />
  );
};
