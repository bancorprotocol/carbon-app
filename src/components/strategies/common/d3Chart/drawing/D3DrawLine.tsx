import { ScaleBand, ScaleLinear } from 'libs/d3';
import { FC, MouseEvent, useState } from 'react';
import { scaleBandInvert } from '../utils';
import { ChartPoint } from './D3Drawings';
import { useD3ChartCtx } from '../D3ChartContext';

interface Props {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  onChange: (points: ChartPoint[]) => any;
}

export const D3DrawLine: FC<Props> = ({ xScale, yScale, onChange }) => {
  const { dms } = useD3ChartCtx();
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;
  const addPoint = (event: MouseEvent) => {
    const svg = document.getElementById('interactive-chart');
    const root = svg!.getBoundingClientRect();
    const x = invertX(event.clientX - root.x);
    const y = invertY(event.clientY - root.y);
    const line = [...points, { x, y }];
    if (line.length === 2) onChange(line);
    setPoints(line);
  };

  return (
    <>
      <rect
        className="chart-drawing-canvas"
        x="0"
        y="0"
        width={dms.boundedWidth}
        height={dms.boundedHeight}
        fillOpacity="0"
        onClick={addPoint}
      />
      {points.length === 2 && (
        <line
          x1={xScale(points[0].x)}
          x2={xScale(points[1].x)}
          y1={yScale(points[0].y)}
          y2={yScale(points[1].y)}
          stroke="white"
        />
      )}
      {points.map(({ x, y }) => (
        <circle
          key={x + '-' + y}
          cx={xScale(x)}
          cy={yScale(y)}
          r="5"
          fill="white"
        />
      ))}
    </>
  );
};
