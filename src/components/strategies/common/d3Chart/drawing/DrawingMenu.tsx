import { FC } from 'react';
import IconIndicator from 'assets/icons/draw-indicator.svg?react';
import IconLine from 'assets/icons/draw-line.svg?react';
import IconExtendedLine from 'assets/icons/draw-extended-line.svg?react';
import IconChannel from 'assets/icons/draw-channel.svg?react';
import IconTriangle from 'assets/icons/draw-triangle.svg?react';
import IconRectangle from 'assets/icons/draw-rectangle.svg?react';
import IconTrash from 'assets/icons/trash.svg?react';
import { useD3ChartCtx } from '../D3ChartContext';
import {
  FloatTooltip,
  FloatTooltipContent,
  FloatTooltipTrigger,
} from 'components/common/tooltip/FloatTooltip';

export type DrawingMode = (typeof drawings)[number]['mode'];

const drawings = [
  {
    mode: undefined,
    icon: <IconIndicator className="size-20" />,
    label: 'Cross',
  },
  {
    mode: 'line' as const,
    icon: <IconLine className="size-20" />,
    label: 'Trending Line',
  },
  {
    mode: 'extended-line' as const,
    icon: <IconExtendedLine className="size-20" />,
    label: 'Extended Line',
  },
  {
    mode: 'channel' as const,
    icon: <IconChannel className="size-20" />,
    label: 'Parallel Channel',
  },
  {
    mode: 'triangle' as const,
    icon: <IconTriangle className="size-20" />,
    label: 'Triangle',
  },
  {
    mode: 'rectangle' as const,
    icon: <IconRectangle className="size-20" />,
    label: 'Rectangle',
  },
];

interface Props {
  clearDrawings: () => void;
}

export const DrawingMenu: FC<Props> = ({ clearDrawings }) => {
  const { drawingMode, setDrawingMode } = useD3ChartCtx();
  return (
    <div
      className="flex flex-col border-e border-main-0/10 bg-main-800"
      role="menubar"
    >
      {drawings.map(({ mode, label, icon }) => (
        <FloatTooltip key={label} placement="right">
          <FloatTooltipTrigger>
            <button
              role="menuitemradio"
              aria-label={label}
              aria-checked={drawingMode === mode}
              className="hover:bg-main-700 rounded-md aria-checked:text-primary p-8"
              onClick={() => setDrawingMode(mode as DrawingMode)}
            >
              {icon}
            </button>
          </FloatTooltipTrigger>
          <FloatTooltipContent className="text-12 rounded-md py-8">
            {label}
          </FloatTooltipContent>
        </FloatTooltip>
      ))}
      <hr className="mx-auto my-8 w-3/4 border-e border-main-0/40" />
      <FloatTooltip placement="right">
        <FloatTooltipTrigger>
          <button
            role="menuitem"
            aria-label="Delete all"
            className="hover:bg-main-700 rounded-md p-8"
            onClick={clearDrawings}
          >
            <IconTrash className="size-20" />
          </button>
        </FloatTooltipTrigger>
        <FloatTooltipContent className="text-12 rounded-md py-8">
          Delete all
        </FloatTooltipContent>
      </FloatTooltip>
    </div>
  );
};
