import { FC } from 'react';
import { D3DrawLine, D3EditLine } from './D3DrawLine';
import { ChartPoint, Drawing, useD3ChartCtx } from '../D3ChartContext';

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
    </>
  );
};

interface D3ShapeProps {
  drawing: Drawing;
  onChange: (points: ChartPoint[]) => any;
}

const D3Shape: FC<D3ShapeProps> = ({ drawing, onChange }) => {
  if (drawing.mode === 'line') {
    return <D3EditLine drawing={drawing} onChange={onChange} />;
  }
};
