import { ScaleBand, ScaleLinear } from 'libs/d3';
import {
  FC,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { scaleBandInvert } from '../utils';
import { ChartPoint, Drawing, useD3ChartCtx } from '../D3ChartContext';
import { D3DrawingRanges } from './D3DrawingRanges';

interface Props {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  onChange: (points: ChartPoint[]) => any;
}

export const D3DrawLine: FC<Props> = ({ xScale, yScale, onChange }) => {
  const lineRef = useRef<SVGLineElement>(null);
  const { dms } = useD3ChartCtx();
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  useEffect(() => {
    if (points.length !== 1) return;
    const area = document.querySelector<SVGElement>('.chart-drawing-canvas')!;
    const root = area!.getBoundingClientRect();
    const handler = (event: MouseEvent) => {
      if (!lineRef.current) return;
      lineRef.current.setAttribute('x2', `${event.clientX - root.x}`);
      lineRef.current.setAttribute('y2', `${event.clientY - root.y}`);
    };
    area.addEventListener('mousemove', handler as any);
    return () => area.removeEventListener('mousemove', handler as any);
  }, [points]);

  const addPoint = (event: ReactMouseEvent) => {
    const svg = document.getElementById('interactive-chart')!;
    const root = svg.getBoundingClientRect();
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
        fill="transparent"
        fillOpacity="0"
        onClick={addPoint}
      />
      {!!points.length && (
        <line
          ref={lineRef}
          x1={xScale(points[0].x)}
          y1={yScale(points[0].y)}
          x2={xScale(points[0].x)}
          y2={yScale(points[0].y)}
          stroke="white"
          strokeWidth="2"
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

interface D3ShapeProps {
  drawing: Drawing;
  onChange: (points: ChartPoint[]) => any;
}

export const D3EditLine: FC<D3ShapeProps> = ({ drawing, onChange }) => {
  const lineRef = useRef<SVGLineElement>(null);
  const [editing, setEditing] = useState(false);
  const { dms, xScale, yScale } = useD3ChartCtx();
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  const onKeyDown = (event: KeyboardEvent) => {
    const deleteKeys = ['Delete', 'Backspace', 'Clear'];
    if (deleteKeys.includes(event.key)) onChange([]);
  };

  const dragShape = (event: ReactMouseEvent<SVGGElement>) => {
    setEditing(true);
    const shape = event.currentTarget;
    const area = document.querySelector<SVGElement>('.chart-area')!;
    const circles = Array.from(shape.querySelectorAll('circle'));
    const root = area.getBoundingClientRect();
    const initialPoints = circles.map((c) => {
      const { x, y, width } = c.getBoundingClientRect();
      return {
        x: x - root.x + width / 2,
        y: y - root.y + width / 2,
      };
    });
    shape.style.setProperty('cursor', 'grabbing');
    const move = (e: MouseEvent) => {
      e.preventDefault(); // Prevent highlight
      if (e.clientX < root.x || e.clientX > root.x + root.width) return;
      if (e.clientY < root.y || e.clientY > root.y + root.height) return;
      const deltaX = e.clientX - event.clientX;
      const deltaY = e.clientY - event.clientY;
      const points = initialPoints.map(({ x, y }) => ({
        x: invertX(x + deltaX),
        y: invertY(y + deltaY),
      }));
      onChange(points);
    };
    const dragEnd = () => {
      document.removeEventListener('mousemove', move);
      shape.style.removeProperty('cursor');
      setEditing(false);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', dragEnd, { once: true });
  };

  const dragPoint = (
    event: ReactMouseEvent<SVGCircleElement>,
    index: number
  ) => {
    event.stopPropagation(); // Prevent mousedown on g
    setEditing(true);
    const circle = event.currentTarget;
    circle.style.setProperty('cursor', 'grabbing');
    circle.style.setProperty('fill', 'white');
    const box = circle.getBoundingClientRect();
    const area = document.querySelector<SVGElement>('.chart-area')!;
    const root = area.getBoundingClientRect();
    const initialX = box.x - root.x + box.width / 2;
    const initialY = box.y - root.y + box.width / 2;
    const points = structuredClone(drawing.points);
    const move = (e: MouseEvent) => {
      e.preventDefault(); // Prevent highlight
      if (e.clientX < root.x || e.clientX > root.x + root.width) return;
      if (e.clientY < root.y || e.clientY > root.y + root.height) return;
      const deltaX = e.clientX - event.clientX;
      const deltaY = e.clientY - event.clientY;
      points[index] = {
        x: invertX(initialX + deltaX),
        y: invertY(initialY + deltaY),
      };
      onChange(points);
    };
    const dragEnd = () => {
      document.removeEventListener('mousemove', move);
      circle.style.removeProperty('cursor');
      circle.style.removeProperty('fill');
      setEditing(false);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', dragEnd, { once: true });
  };
  const circles = drawing.points.map(({ x, y }, i) => (
    <circle
      key={i}
      cx={xScale(x)}
      cy={yScale(y)}
      r="5"
      fill="var(--primary)"
      className="draggable invisible hover:fill-white group-hover/drawing:visible group-focus/drawing:visible"
      onMouseDown={(e) => dragPoint(e, i)}
    />
  ));

  return (
    <>
      {editing && (
        <rect
          className="chart-editing-canvas"
          x="0"
          y="0"
          width={dms.boundedWidth}
          height={dms.boundedHeight}
          fill="transparent"
          fillOpacity="0"
        />
      )}
      <g
        className="draggable group/drawing cursor-grab focus-visible:outline-none"
        onKeyDown={onKeyDown}
        onMouseDown={dragShape}
        tabIndex={0}
      >
        <line
          className="draggable"
          ref={lineRef}
          x1={xScale(drawing.points[0].x)}
          x2={xScale(drawing.points[1].x)}
          y1={yScale(drawing.points[0].y)}
          y2={yScale(drawing.points[1].y)}
          stroke="var(--primary)"
          strokeWidth="2"
        />
        {circles}
        <D3DrawingRanges points={drawing.points} />
      </g>
    </>
  );
};
