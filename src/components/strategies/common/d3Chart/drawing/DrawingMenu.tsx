import { Dispatch, FC, SetStateAction } from 'react';
import { ReactComponent as IconIndicator } from 'assets/icons/draw-indicator.svg';
import { ReactComponent as IconLine } from 'assets/icons/draw-line.svg';
import { ReactComponent as IconExtendedLine } from 'assets/icons/draw-extended-line.svg';
import { ReactComponent as IconParallelLine } from 'assets/icons/draw-parallel-line.svg';
import { ReactComponent as IconTriangle } from 'assets/icons/draw-triangle.svg';
import { ReactComponent as IconRectangle } from 'assets/icons/draw-rectangle.svg';
import { ReactComponent as IconTrash } from 'assets/icons/trash.svg';

export type DrawingMode = 'line' | undefined;

interface Props {
  drawingMode: DrawingMode;
  setDrawingMode: Dispatch<SetStateAction<DrawingMode>>;
  clearDrawings: () => void;
}

export const DrawingMenu: FC<Props> = ({
  drawingMode,
  setDrawingMode,
  clearDrawings,
}) => {
  return (
    <div className="flex flex-col" role="menubar">
      <button
        role="menuitemradio"
        aria-checked={!drawingMode}
        aria-label="selection mode"
        className="hover:bg-background-700 rounded-8 p-8"
        onClick={() => setDrawingMode(undefined)}
      >
        <IconIndicator className="size-24" />
      </button>
      <button
        role="menuitemradio"
        aria-checked={drawingMode === 'line'}
        aria-label="draw line"
        className="hover:bg-background-700 rounded-8 p-8"
        onClick={() => setDrawingMode('line')}
      >
        <IconLine className="size-24" />
      </button>
      <button
        role="menuitemradio"
        aria-checked={drawingMode === 'line'}
        aria-label="draw extended line"
        className="hover:bg-background-700 rounded-8 p-8"
        onClick={() => setDrawingMode('line')}
      >
        <IconExtendedLine className="size-24" />
      </button>
      <button
        role="menuitemradio"
        aria-checked={drawingMode === 'line'}
        aria-label="draw parallel line"
        className="hover:bg-background-700 rounded-8 p-8"
        onClick={() => setDrawingMode('line')}
      >
        <IconParallelLine className="size-24" />
      </button>
      <button
        role="menuitemradio"
        aria-checked={drawingMode === 'line'}
        aria-label="draw triangle"
        className="hover:bg-background-700 rounded-8 p-8"
        onClick={() => setDrawingMode('line')}
      >
        <IconTriangle className="size-24" />
      </button>
      <button
        role="menuitemradio"
        aria-checked={drawingMode === 'line'}
        aria-label="draw triangle"
        className="hover:bg-background-700 rounded-8 p-8"
        onClick={() => setDrawingMode('line')}
      >
        <IconRectangle className="size-24" />
      </button>
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
