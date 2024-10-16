import { Dispatch, FC, SetStateAction, useState } from 'react';
import { DrawingMode } from './DrawingMenu';
import { D3DrawLine } from './D3DrawLine';
import { D3ChartSettings, ScaleBand, ScaleLinear } from 'libs/d3';

export interface ChartPoint {
  x: string;
  y: number;
}

interface Drawing {
  mode: DrawingMode;
  points: ChartPoint[];
}

interface Props {
  dms: D3ChartSettings;
  drawingMode?: DrawingMode;
  setDrawingMode: Dispatch<SetStateAction<DrawingMode>>;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
}
export const D3Drawings: FC<Props> = (props) => {
  const { dms, drawingMode, setDrawingMode, xScale, yScale } = props;
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const onChange = (points: ChartPoint[]) => {
    setDrawings((list) => [...list, { mode: props.drawingMode, points }]);
    setDrawingMode(undefined);
  };
  const drawProps = { dms, drawingMode, xScale, yScale, onChange };
  return (
    <>
      {drawings.map((drawing, i) => (
        <D3Shape key={i} drawing={drawing} xScale={xScale} yScale={yScale} />
      ))}
      {drawingMode === 'line' && <D3DrawLine {...drawProps} />}
    </>
  );
};

interface D3ShapeProps {
  drawing: Drawing;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
}

const D3Shape: FC<D3ShapeProps> = ({ drawing, xScale, yScale }) => {
  const circles = drawing.points.map(({ x, y }) => (
    <circle
      key={x + '-' + y}
      cx={xScale(x)}
      cy={yScale(y)}
      r="5"
      fill="white"
    />
  ));
  if (drawing.mode === 'line') {
    return (
      <>
        <line
          x1={xScale(drawing.points[0].x)}
          x2={xScale(drawing.points[1].x)}
          y1={yScale(drawing.points[0].y)}
          y2={yScale(drawing.points[1].y)}
          stroke="white"
        />
        {circles}
      </>
    );
  }
};
