import { D3ChartSettings, drag, Selection } from 'libs/d3';
import { D3ChartHandleLine } from 'components/simulator/input/d3Chart/D3ChartHandleLine';
import {
  getSelector,
  useSelectable,
} from 'components/simulator/input/d3Chart/utils';
import { useEffect } from 'react';

interface Props {
  selector: string;
  selectorOpposite: string;
  dms: D3ChartSettings;
  onDragStart?: (y: number) => void;
  onDrag: (y: number) => void;
  onDragEnd?: (y?: number, y2?: number) => void;
  color: string;
  label?: string;
  isLimit: boolean;
}

export const D3ChartHandle = ({
  onDragStart,
  onDrag,
  onDragEnd,
  isLimit,
  ...props
}: Props) => {
  const selection = getSelector(props.selector);
  const isSelectable = useSelectable(props.selector);

  const handleDrag = drag()
    .subject(() => ({
      y: Number(selection.select('line').attr('y1')),
    }))
    .on('start', ({ y }) => onDragStart?.(y))
    .on('drag', ({ y }) => onDrag(y))
    .on('end', ({ y }) => {
      if (isLimit) {
        onDragEnd?.(y, y);
        return;
      }

      const oppositeY = Number(
        getSelector(props.selectorOpposite).select('line').attr('y1')
      );

      if (oppositeY < y) {
        onDragEnd?.(y, oppositeY);
      } else {
        onDragEnd?.(oppositeY, y);
      }
    });

  useEffect(() => {
    if (!isSelectable) return;
    handleDrag(selection as Selection<Element, unknown, any, any>);
  }, [isSelectable, handleDrag, selection]);

  return <D3ChartHandleLine {...props} isDraggable />;
};
