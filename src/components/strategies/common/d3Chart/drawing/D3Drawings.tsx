import { FC } from 'react';
import { D3DrawLine, D3EditLine } from './D3DrawLine';
import { ChartPoint, Drawing, useD3ChartCtx } from '../D3ChartContext';
import { D3DrawExtendedLine, D3EditExtendedLine } from './D3DrawExtendedLine';
import { D3DrawTriangle, D3EditTriangle } from './D3DrawTriangle';
import { D3DrawRect, D3EditRect } from './D3DrawRect';
import { D3DrawChannel, D3EditChannel } from './D3DrawChannel';

export const D3Drawings = () => {
  const { drawings, setDrawings, drawingMode, setDrawingMode, xScale, yScale } =
    useD3ChartCtx();
  const onChange = (points: ChartPoint[]) => {
    setDrawings((list) => [
      ...list,
      { id: Date.now(), mode: drawingMode, points },
    ]);
    setDrawingMode(undefined);
  };
  const drawProps = { drawingMode, xScale, yScale, onChange };

  const editShape = (index: number, points: ChartPoint[]) => {
    setDrawings((list) => {
      const copy = structuredClone(list);
      if (!points.length) copy.splice(index, 1);
      else copy[index].points = points;
      return copy;
    });
  };

  return (
    <>
      {drawings.map((drawing, i) => (
        <D3Shape key={i} drawing={drawing} onChange={(p) => editShape(i, p)} />
      ))}
      {drawingMode === 'line' && <D3DrawLine {...drawProps} />}
      {drawingMode === 'channel' && <D3DrawChannel {...drawProps} />}
      {drawingMode === 'triangle' && <D3DrawTriangle {...drawProps} />}
      {drawingMode === 'rectangle' && <D3DrawRect {...drawProps} />}
      {drawingMode === 'extended-line' && <D3DrawExtendedLine {...drawProps} />}
    </>
  );
};

interface D3ShapeProps {
  drawing: Drawing;
  onChange: (points: ChartPoint[]) => any;
}

const D3Shape: FC<D3ShapeProps> = (props) => {
  const mode = props.drawing.mode;
  if (mode === 'line') return <D3EditLine {...props} />;
  if (mode === 'channel') return <D3EditChannel {...props} />;
  if (mode === 'triangle') return <D3EditTriangle {...props} />;
  if (mode === 'rectangle') return <D3EditRect {...props} />;
  if (mode === 'extended-line') return <D3EditExtendedLine {...props} />;
};
