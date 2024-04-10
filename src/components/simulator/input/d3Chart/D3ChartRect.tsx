import { SVGProps } from 'react';
import { cn } from 'utils/helpers';

interface RectProps extends SVGProps<SVGRectElement> {
  selector: string;
  isDragging: boolean;
}
export const D3ChartRect = ({ selector, isDragging, ...props }: RectProps) => {
  return (
    <rect
      className={cn(selector, {
        'cursor-grab': !isDragging,
        'cursor-grabbing': isDragging,
      })}
      fillOpacity={0.15}
      {...props}
    />
  );
};
