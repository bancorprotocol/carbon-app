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

const polygonPoints = (
  points: ChartPoint[],
  xScale: ScaleBand<string>,
  yScale: ScaleLinear<number, number>
) => {
  return points.map(({ x, y }) => `${xScale(x)},${yScale(y)}`).join(' ');
};

export const D3DrawTriangle: FC<Props> = ({ xScale, yScale, onChange }) => {
  const ref = useRef<SVGPolygonElement>(null);
  const { dms } = useD3ChartCtx();
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  useEffect(() => {
    if (!points.length) return;
    const area = document.querySelector<SVGElement>('.chart-drawing-canvas')!;
    const root = area!.getBoundingClientRect();
    const handler = (event: MouseEvent) => {
      if (!ref.current) return;
      const x = invertX(event.clientX - root.x);
      const y = invertY(event.clientY - root.y);
      const newPoints = polygonPoints([...points, { x, y }], xScale, yScale);
      ref.current.setAttribute('points', newPoints);
    };
    area.addEventListener('mousemove', handler as any);
    return () => area.removeEventListener('mousemove', handler as any);
  }, [invertX, invertY, points, xScale, yScale]);

  const addPoint = (event: ReactMouseEvent) => {
    const svg = document.getElementById('interactive-chart')!;
    const root = svg.getBoundingClientRect();
    const x = invertX(event.clientX - root.x);
    const y = invertY(event.clientY - root.y);
    const line = [...points, { x, y }];
    if (line.length === 3) onChange(line);
    setPoints(line);
  };

  const polygon = polygonPoints(points, xScale, yScale);

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
        <polygon
          ref={ref}
          points={polygon}
          stroke="var(--primary)"
          strokeWidth="2"
          fill="var(--primary)"
          fillOpacity="0.4"
          // click event not bubbled in SVG, line was blocking the addPoint
          className="pointer-events-none"
        />
      )}
      {points.map(({ x, y }) => (
        <circle
          key={x + '-' + y}
          cx={xScale(x)}
          cy={yScale(y)}
          r="5"
          fill="var(--primary)"
        />
      ))}
    </>
  );
};

interface D3ShapeProps {
  drawing: Drawing;
  onChange: (points: ChartPoint[]) => any;
}

export const D3EditTriangle: FC<D3ShapeProps> = ({ drawing, onChange }) => {
  const ref = useRef<SVGPolygonElement>(null);
  const [editing, setEditing] = useState(false);
  const { dms, xScale, yScale } = useD3ChartCtx();
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  useEffect(() => {
    document.getElementById(`shape-${drawing.id}`)?.focus();
  }, [drawing.id]);

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

  const showIndicator = () => {
    const ranges = document.getElementById(`ranges-${drawing.id}`);
    ranges?.style.setProperty('display', 'inline');
  };
  const hideIndicator = () => {
    const ranges = document.getElementById(`ranges-${drawing.id}`);
    ranges?.style.removeProperty('display');
  };

  const polygon = polygonPoints(drawing.points, xScale, yScale);

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
        id={`shape-${drawing.id}`}
        className="draggable group/drawing cursor-pointer focus-visible:outline-none"
        onKeyDown={onKeyDown}
        onMouseDown={dragShape}
        onFocus={showIndicator}
        onBlur={hideIndicator}
        tabIndex={0}
      >
        <polygon
          className="draggable"
          ref={ref}
          points={polygon}
          stroke="var(--primary)"
          strokeWidth="2"
          fill="var(--primary)"
          fillOpacity="0.4"
        />
        {circles}
      </g>
    </>
  );
};
