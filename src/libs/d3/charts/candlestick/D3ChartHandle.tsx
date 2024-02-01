import { drag, Selection } from 'd3';
import { D3ChartSettings } from 'libs/d3';
import { D3ChartHandleLine } from 'libs/d3/charts/candlestick/D3ChartHandleLine';
import { getSelector } from 'libs/d3/charts/candlestick/utils';
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
}

export const D3ChartHandle = ({
  onDragStart,
  onDrag,
  onDragEnd,
  ...props
}: Props) => {
  const selection = getSelector(props.selector);

  const handleDrag = drag()
    .subject(() => {
      const line = selection.select('line');
      return {
        y: Number(line.attr('y1')),
      };
    })
    .on('start', ({ y }) => onDragStart?.(y))
    .on('drag', ({ y }) => onDrag(y))
    .on('end', ({ y }) => {
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
    handleDrag(selection as Selection<Element, unknown, any, any>);
  });

  return <D3ChartHandleLine {...props} isDraggable />;
};
