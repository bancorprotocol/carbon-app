import { drag, Selection } from 'd3';
import { getSelector } from 'libs/d3/charts/candlestick/utils';
import { D3ChartSettings } from 'libs/d3/types';
import { useEffect } from 'react';

interface Props {
  selector: string;
  dms: D3ChartSettings;
  onDrag: (y: number, y2: number) => void;
  onDragEnd: (y: number, y2: number) => void;
  onDragStart: () => void;
  initialY?: number;
  color: string;
}

export const D3ChartRect = ({
  selector,
  dms,
  color,
  onDrag,
  onDragEnd,
  onDragStart,
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
    .on('start', () => {
      onDragStart();
    })
    .on('drag', ({ y, subject: { height } }) => {
      const y2 = y + height;
      onDrag(y, y2);
    })
    .on('end', ({ y, subject: { height } }) => {
      const y2 = y + height;
      onDragEnd(y, y2);
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
