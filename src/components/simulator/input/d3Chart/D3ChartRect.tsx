import { drag, Selection } from 'd3';
import {
  getSelector,
  useSelectable,
} from 'components/simulator/input/d3Chart/utils';
import { D3ChartSettings } from 'libs/d3/types';
import { useEffect, useState } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  selector: string;
  dms: D3ChartSettings;
  onDragStart?: (y: number, y2: number) => void;
  onDrag: (y: number, y2: number) => void;
  onDragEnd?: (y: number, y2: number) => void;
  initialY?: number;
  color: string;
}

export const D3ChartRect = ({
  selector,
  dms,
  color,
  onDragStart,
  onDrag,
  onDragEnd,
  initialY,
}: Props) => {
  const selection = getSelector(selector);
  const [isDragging, setIsDragging] = useState(false);
  const isSelectable = useSelectable(selector);

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
      onDrag(y, y2);
    })
    .on('end', ({ y, subject: { height } }) => {
      setIsDragging(false);
      const y2 = y + height;
      onDragEnd?.(y2, y);
    });

  useEffect(() => {
    if (!isSelectable) return;
    handleDrag(selection as Selection<Element, unknown, any, any>);
  }, [isSelectable, handleDrag, selection]);

  return (
    <rect
      className={cn(selector, {
        'cursor-grab': !isDragging,
        'cursor-grabbing': isDragging,
      })}
      height={initialY}
      width={dms.boundedWidth}
      fill={color}
      fillOpacity={0.15}
    />
  );
};
