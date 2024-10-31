import { FC } from 'react';
import { ReactComponent as IconIndicator } from 'assets/icons/draw-indicator.svg';
import { ReactComponent as IconLine } from 'assets/icons/draw-line.svg';
import { ReactComponent as IconExtendedLine } from 'assets/icons/draw-extended-line.svg';
import { ReactComponent as IconChannel } from 'assets/icons/draw-channel.svg';
import { ReactComponent as IconTriangle } from 'assets/icons/draw-triangle.svg';
import { ReactComponent as IconRectangle } from 'assets/icons/draw-rectangle.svg';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
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
    icon: <IconIndicator className="size-24" />,
    label: 'Cross',
  },
  {
    mode: 'line' as const,
    icon: <IconLine className="size-24" />,
    label: 'Trending Line',
  },
  {
    mode: 'extended-line' as const,
    icon: <IconExtendedLine className="size-24" />,
    label: 'Extended Line',
  },
  {
    mode: 'channel' as const,
    icon: <IconChannel className="size-24" />,
    label: 'Parallel Channel',
  },
  {
    mode: 'triangle' as const,
    icon: <IconTriangle className="size-24" />,
    label: 'Triangle',
  },
  {
    mode: 'rectangle' as const,
    icon: <IconRectangle className="size-24" />,
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
      className="bg-background-black flex flex-col border-e border-white/10"
      role="menubar"
    >
      {drawings.map(({ mode, label, icon }) => (
        <FloatTooltip key={label} placement="right">
          <FloatTooltipTrigger>
            <button
              role="menuitemradio"
              aria-describedby={`${mode}-tooltip`}
              aria-checked={drawingMode === mode}
              className="hover:bg-background-700 rounded-8 aria-checked:text-primary p-8"
              onClick={() => setDrawingMode(mode as DrawingMode)}
            >
              {icon}
            </button>
          </FloatTooltipTrigger>
          <FloatTooltipContent id={`${mode}-tooltip`}>
            {label}
          </FloatTooltipContent>
        </FloatTooltip>
      ))}
      <hr className="mx-auto my-8 w-3/4 border-e border-white/40" />
      <FloatTooltip placement="right">
        <FloatTooltipTrigger>
          <button
            role="menuitem"
            aria-describedby="delete-all-tooltip"
            className="hover:bg-background-700 rounded-8 p-8"
            onClick={clearDrawings}
          >
            <IconTrash className="size-24" />
          </button>
        </FloatTooltipTrigger>
        <FloatTooltipContent id="delete-all-tooltip">
          Delete all
        </FloatTooltipContent>
      </FloatTooltip>
    </div>
  );
};
