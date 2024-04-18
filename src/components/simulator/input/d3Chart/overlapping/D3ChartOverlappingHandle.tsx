import { D3ChartSettings, drag, Selection } from 'libs/d3';
import { D3ChartHandleLine } from 'components/simulator/input/d3Chart/D3ChartHandleLine';
import {
  getSelector,
  useSelectable,
} from 'components/simulator/input/d3Chart/utils';
import { useEffect } from 'react';

interface Props {
  selector: string;
  dms: D3ChartSettings;
  onDragStart?: (y: number) => void;
  onDrag?: (y: number) => void;
  onDragEnd?: (y: number) => void;
  color: string;
  label?: string;
}

export const D3ChartOverlappingHandle = ({
  onDragStart,
  onDrag,
  onDragEnd,
  ...props
}: Props) => {
  const selection = getSelector(props.selector);
  const isSelectable = useSelectable(props.selector);

  const handleDrag = drag()
    .subject(() => ({
      y: Number(selection.select('line').attr('y1')),
    }))
    .on('start', ({ y }) => onDragStart?.(y))
    .on('drag', ({ y }) => onDrag?.(y))
    .on('end', ({ y }) => onDragEnd?.(y));

  useEffect(() => {
    if (!isSelectable) return;
    handleDrag(selection as Selection<Element, unknown, any, any>);
  }, [isSelectable, handleDrag, selection]);

  return <D3ChartHandleLine {...props} isDraggable />;
};
