import { drag, Selection } from 'libs/d3';
import { D3ChartHandleLine } from 'components/strategies/common/d3Chart/D3ChartHandleLine';
import {
  getSelector,
  useSelectable,
} from 'components/strategies/common/d3Chart/utils';
import { useEffect } from 'react';

interface Props {
  selector: string;
  onDragStart?: (y: number) => void;
  onDrag?: (y: number) => void;
  onDragEnd?: (y: number) => void;
  color: string;
  label?: string;
  readonly?: boolean;
}

export const D3ChartOverlappingHandle = ({
  onDragStart,
  onDrag,
  onDragEnd,
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
      .on('drag', ({ y }) => onDrag?.(y))
      .on('end', ({ y }) => onDragEnd?.(y));

    if (!isSelectable) return;

    handleDrag(selection as Selection<Element, unknown, any, any>);
  }, [
    isSelectable,
    onDrag,
    onDragEnd,
    onDragStart,
    props.readonly,
    props.selector,
  ]);

  return <D3ChartHandleLine {...props} isDraggable={!props.readonly} />;
};
