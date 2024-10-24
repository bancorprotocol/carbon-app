import { FC } from 'react';
import { ReactComponent as IconIndicator } from 'assets/icons/draw-indicator.svg';
import { ReactComponent as IconLine } from 'assets/icons/draw-line.svg';
import { ReactComponent as IconExtendedLine } from 'assets/icons/draw-extended-line.svg';
import { ReactComponent as IconChannel } from 'assets/icons/draw-channel.svg';
import { ReactComponent as IconTriangle } from 'assets/icons/draw-triangle.svg';
import { ReactComponent as IconRectangle } from 'assets/icons/draw-rectangle.svg';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';
import { useD3ChartCtx } from '../D3ChartContext';

export type DrawingMode = keyof typeof drawings | undefined;

const drawings = {
  line: {
    icon: <IconLine className="size-24" />,
    label: 'Draw Line',
  },
  'extended-line': {
    icon: <IconExtendedLine className="size-24" />,
    label: 'Draw Extended Line',
  },
  channel: {
    icon: <IconChannel className="size-24" />,
    label: 'Draw Parallel Line',
  },
  triangle: {
    icon: <IconTriangle className="size-24" />,
    label: 'Draw Triangle',
  },
  rectangle: {
    icon: <IconRectangle className="size-24" />,
    label: 'Draw Triangle',
  },
};

interface Props {
  clearDrawings: () => void;
}

export const DrawingMenu: FC<Props> = ({ clearDrawings }) => {
  const { drawingMode, setDrawingMode } = useD3ChartCtx();
  return (
    <div className="flex flex-col border-e border-white/10" role="menubar">
      <button
        role="menuitemradio"
        aria-checked={!drawingMode}
        aria-label="selection mode"
        className="hover:bg-background-700 rounded-8 aria-checked:text-primary p-8"
        onClick={() => setDrawingMode(undefined)}
      >
        <IconIndicator className="size-24" />
      </button>
      {Object.entries(drawings).map(([mode, content]) => (
        <button
          key={mode}
          role="menuitemradio"
          aria-checked={drawingMode === mode}
          aria-label={content.label}
          className="hover:bg-background-700 rounded-8 aria-checked:text-primary p-8"
          onClick={() => setDrawingMode(mode as DrawingMode)}
        >
          {content.icon}
        </button>
      ))}
      <hr className="mx-auto my-8 w-3/4 border-e border-white/40" />
      <button
        role="menuitem"
        className="hover:bg-background-700 rounded-8 p-8"
        onClick={clearDrawings}
      >
        <IconTrash className="size-24" />
      </button>
    </div>
  );
};
