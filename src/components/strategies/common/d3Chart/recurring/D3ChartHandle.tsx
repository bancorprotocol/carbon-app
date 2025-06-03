import { drag, Selection } from 'libs/d3';
import { D3ChartHandleLine } from 'components/strategies/common/d3Chart/D3ChartHandleLine';
import {
  getSelector,
  useSelectable,
} from 'components/strategies/common/d3Chart/utils';
import { useEffect } from 'react';

interface Props {
  selector: string;
  selectorOpposite: string;
  onDragStart?: (y: number) => void;
  onDrag: (y: number) => void;
  onDragEnd?: (y?: number, y2?: number) => void;
  color: string;
  label?: string;
  readonly?: boolean;
  isLimit: boolean;
}

export const D3ChartHandle = ({
  onDragStart,
  onDrag,
  onDragEnd,
  isLimit,
  ...props
}: Props) => {
  const isSelectable = useSelectable(props.selector);

  useEffect(() => {
    if (props.readonly) return;
    const selection = getSelector(props.selector);
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
          getSelector(props.selectorOpposite).select('line').attr('y1'),
        );

        if (oppositeY < y) {
          onDragEnd?.(y, oppositeY);
        } else {
          onDragEnd?.(oppositeY, y);
        }
      });
    if (!isSelectable) return;
    handleDrag(selection as Selection<Element, unknown, any, any>);
  }, [
    isSelectable,
    onDragStart,
    onDrag,
    onDragEnd,
    props.selector,
    props.readonly,
    props.selectorOpposite,
    isLimit,
  ]);

  return <D3ChartHandleLine {...props} isDraggable />;
};
