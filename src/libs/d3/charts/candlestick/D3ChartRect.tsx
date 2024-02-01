import { drag, Selection } from 'd3';
import { getSelector } from 'libs/d3/charts/candlestick/utils';
import { D3ChartSettings } from 'libs/d3/types';
import { useEffect } from 'react';

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

  const handleDrag = drag()
    .subject(() => {
      return {
        y: Number(selection.attr('y')),
        height: Number(selection.attr('height')),
      };
    })
    .on('start', ({ y, subject: { height } }) => {
      const y2 = y + height;
      onDragStart?.(y2, y);
    })
    .on('drag', ({ y, subject: { height } }) => {
      const y2 = y + height;
      onDrag(y, y2);
    })
    .on('end', ({ y, subject: { height } }) => {
      const y2 = y + height;
      onDragEnd?.(y2, y);
    });

  useEffect(() => {
    handleDrag(selection as Selection<Element, unknown, any, any>);
  });

  return (
    <rect
      className={selector}
      height={initialY}
      width={dms.boundedWidth}
      fill={color}
      fillOpacity={0.15}
    />
  );
};
