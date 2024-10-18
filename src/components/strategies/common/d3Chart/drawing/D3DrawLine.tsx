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
  const { xScale, yScale } = useD3ChartCtx();
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  const onKeyDown = (event: KeyboardEvent) => {
    const deleteKeys = ['Delete', 'Backspace', 'Clear'];
    if (deleteKeys.includes(event.key)) onChange([]);
  };

  const dragShape = (event: ReactMouseEvent<SVGGElement>) => {
    const shape = event.currentTarget;
    const area = document.querySelector<SVGElement>('.chart-area')!;
    const root = area.getBoundingClientRect();
    const move = (e: MouseEvent) => {
      if (e.clientX < root.x || e.clientX > root.x + root.width) return;
      if (e.clientY < root.y || e.clientY > root.y + root.height) return;
      const deltaX = e.clientX - event.clientX;
      const deltaY = e.clientY - event.clientY;
      const translate = `translate(${deltaX}px, ${deltaY}px)`;
      shape.style.setProperty('transform', translate);
    };
    const dragEnd = () => {
      const circles = Array.from(shape.querySelectorAll('circle'));
      document.removeEventListener('mousemove', move);
      const points = circles.map((c) => {
        const { x, y, width } = c.getBoundingClientRect();
        return {
          x: invertX(x - root.x + width / 2),
          y: invertY(y - root.y + width / 2),
        };
      });
      shape.style.removeProperty('transform');
      onChange(points);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', dragEnd, { once: true });
  };

  const dragPoint = (
    event: ReactMouseEvent<SVGCircleElement>,
    index: number
  ) => {
    event.stopPropagation(); // Prevent mousedown on g
    const circle = event.currentTarget;
    const area = document.querySelector<SVGElement>('.chart-area')!;
    const root = area.getBoundingClientRect();
    const move = (e: MouseEvent) => {
      if (e.clientX < root.x || e.clientX > root.x + root.width) return;
      if (e.clientY < root.y || e.clientY > root.y + root.height) return;
      const x = `${e.clientX - root.x}`;
      const y = `${e.clientY - root.y}`;
      lineRef.current!.setAttribute(`x${index + 1}`, x);
      lineRef.current!.setAttribute(`y${index + 1}`, y);
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
    };
    const dragEnd = () => {
      const points = structuredClone(drawing.points);
      document.removeEventListener('mousemove', move);
      const { x, y, width } = circle.getBoundingClientRect();
      points[index] = {
        x: invertX(x - root.x + width / 2),
        y: invertY(y - root.y + width / 2),
      };
      onChange(points);
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
      fill="white"
      className="draggable hidden group-focus:block"
      onMouseDown={(e) => dragPoint(e, i)}
    />
  ));
  return (
    <g
      className="draggable group"
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
        stroke="white"
        strokeWidth="2"
      />
      {circles}
    </g>
  );
};
