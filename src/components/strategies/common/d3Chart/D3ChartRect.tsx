import { SVGProps } from 'react';
import { cn } from 'utils/helpers';

interface RectProps extends SVGProps<SVGRectElement> {
  selector: string;
  isDragging: boolean;
  readonly?: boolean;
}
export const D3ChartRect = (props: RectProps) => {
  const { selector, isDragging, readonly, ...attr } = props;
  return (
    <rect
      className={cn(selector, {
        'cursor-grab': !isDragging,
        'cursor-grabbing': isDragging,
        'pointer-events-none cursor-auto': readonly,
      })}
      fillOpacity={0.15}
      {...attr}
    />
  );
};
