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
import { getAreaBox, getDelta, getEdges, getInitialPoints } from './utils';

interface Props {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  onChange: (points: ChartPoint[]) => any;
}

/** Transform the values of the polygon into two lines in D3 space */
const fromPolygonPoints = (
  polygon: SVGPolygonElement,
  invertX: (value: number) => string,
  invertY: (value: number) => number,
) => {
  return [
    polygon.points.getItem(0), // line1 x1,y1
    polygon.points.getItem(1), // line1 x2,y2
    polygon.points.getItem(3), // line2 x1,y1
    polygon.points.getItem(2), // line2 x2,y2
  ].map(({ x, y }) => ({
    x: invertX(x),
    y: invertY(y),
  }));
};

/** Transform points into D3 polygon points */
const toPolygonPoints = (
  points: ChartPoint[],
  xScale: ScaleBand<string>,
  yScale: ScaleLinear<number, number>,
) => {
  return [points[0], points[1], points[3], points[2]]
    .map(({ x, y }) => `${xScale(x)},${yScale(y)}`)
    .join(' ');
};

/** Get the polygon point out of a mouse delta & a base line */
const getPolygonPoints = (line: SVGLineElement, deltaY: number) => {
  const x1 = line.x1.baseVal.value;
  const x2 = line.x2.baseVal.value;
  const y1 = line.y1.baseVal.value;
  const y2 = line.y2.baseVal.value;
  const points = [
    [x1, y1],
    [x2, y2],
    [x2, y2 + deltaY],
    [x1, y1 + deltaY],
  ];
  return points.map(([x, y]) => `${x},${y}`).join(' ');
};

const getLineCenter = (
  points: ChartPoint[],
  xScale: ScaleBand<string>,
  yScale: ScaleLinear<number, number>,
) => {
  const [a, b] = points;
  return {
    cx: (xScale(a.x)! + xScale(b.x)!) / 2,
    cy: (yScale(a.y)! + yScale(b.y)!) / 2,
  };
};

export const D3DrawChannel: FC<Props> = ({ xScale, yScale, onChange }) => {
  const lineRef = useRef<SVGLineElement>(null);
  const secondLineRef = useRef<SVGLineElement>(null);
  const polygonRef = useRef<SVGPolygonElement>(null);
  const { dms } = useD3ChartCtx();
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  const addPoint = (event: ReactMouseEvent) => {
    const svg = document.getElementById('interactive-chart')!;
    const root = svg.getBoundingClientRect();
    const x = invertX(event.clientX - root.x);
    const y = invertY(event.clientY - root.y);
    if (!points.length) {
      setPoints([{ x, y }]);
      const handler = (e: MouseEvent) => {
        if (!lineRef.current) return;
        lineRef.current.setAttribute('x2', `${e.clientX - root.x}`);
        lineRef.current.setAttribute('y2', `${e.clientY - root.y}`);
      };
      document.addEventListener('mousemove', handler);
      // wait after click event bubble up to document
      requestAnimationFrame(() => {
        document.addEventListener(
          'click',
          () => document.removeEventListener('mousemove', handler),
          { once: true },
        );
      });
    } else if (points.length === 1) {
      setPoints((p) => [p[0], { x, y }]);
      const handler = (e: MouseEvent) => {
        if (!secondLineRef.current) return;
        const secondLine = secondLineRef.current;
        const deltaY = e.clientY - event.clientY;
        const translate = `translate(0, ${deltaY})`;
        secondLine.setAttribute('transform', translate);
        const polygonPoint = getPolygonPoints(secondLine, deltaY);
        polygonRef.current?.setAttribute('points', polygonPoint);
      };
      document.addEventListener('mousemove', handler);
      requestAnimationFrame(() => {
        document.addEventListener(
          'click',
          () => document.removeEventListener('mousemove', handler),
          { once: true },
        );
      });
    } else {
      const polygon = polygonRef.current!;
      onChange(fromPolygonPoints(polygon, invertX, invertY));
    }
  };

  return (
    <>
      <polygon ref={polygonRef} fill="var(--primary)" fillOpacity="0.2" />
      {!!points.length && (
        <line
          ref={lineRef}
          x1={xScale(points[0].x)}
          y1={yScale(points[0].y)}
          x2={xScale(points[1]?.x ?? points[0].x)}
          y2={yScale(points[1]?.y ?? points[0].y)}
          stroke="var(--primary)"
          strokeWidth="2"
        />
      )}
      {points.length === 2 && (
        <line
          ref={secondLineRef}
          x1={xScale(points[0].x)}
          y1={yScale(points[0].y)}
          x2={xScale(points[1].x)}
          y2={yScale(points[1].y)}
          stroke="var(--primary)"
          strokeWidth="2"
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
    </>
  );
};

interface D3ShapeProps {
  drawing: Drawing;
  onChange: (points: ChartPoint[]) => any;
}

export const D3EditChannel: FC<D3ShapeProps> = ({ drawing, onChange }) => {
  const ref = useRef<SVGLineElement>(null);
  const [editing, setEditing] = useState(false);
  const { dms, xScale, yScale } = useD3ChartCtx();
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  const points = drawing.points;

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
    const allCircles = getEdges(drawing.id);
    const root = getAreaBox();
    const initialPoints = getInitialPoints(root, allCircles);
    shape.style.setProperty('cursor', 'grabbing');
    const move = (e: MouseEvent) => {
      const delta = getDelta(root, event, e);
      if (!delta) return;
      const points = initialPoints.map(({ x, y }) => ({
        x: invertX(x + delta.x),
        y: invertY(y + delta.y),
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
    index: number,
  ) => {
    event.stopPropagation(); // Prevent mousedown on g
    setEditing(true);
    const allCircles = getEdges(drawing.id);
    const circle = allCircles[index];
    const matchingIndex = (index + 2) % 4;
    circle.style.setProperty('cursor', 'grabbing');

    const root = getAreaBox();
    const initialPoints = getInitialPoints(root, allCircles);
    const newPoints = structuredClone(points);
    const move = (e: MouseEvent) => {
      const delta = getDelta(root, event, e);
      if (!delta) return;
      newPoints[index] = {
        x: invertX(initialPoints[index].x + delta.x),
        y: invertY(initialPoints[index].y + delta.y),
      };
      newPoints[matchingIndex] = {
        x: invertX(initialPoints[matchingIndex].x + delta.x),
        y: invertY(initialPoints[matchingIndex].y + delta.y),
      };
      onChange(newPoints);
    };
    const dragEnd = () => {
      document.removeEventListener('mousemove', move);
      circle.style.removeProperty('cursor');
      setEditing(false);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', dragEnd, { once: true });
  };

  const dragCenter = (event: ReactMouseEvent, index: number) => {
    event.stopPropagation(); // Prevent mousedown on g
    setEditing(true);
    const allCircles = getEdges(drawing.id);
    const circleIndexes = index === 0 ? [0, 1] : [2, 3];
    const root = getAreaBox();
    const initialPoints = getInitialPoints(root, allCircles);
    const newPoints = structuredClone(points);
    const move = (e: MouseEvent) => {
      const delta = getDelta(root, event, e);
      if (!delta) return;
      for (const i of circleIndexes) {
        newPoints[i].y = invertY(initialPoints[i].y + delta.y);
      }
      onChange(newPoints);
    };
    const dragEnd = () => {
      document.removeEventListener('mousemove', move);
      setEditing(false);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', dragEnd, { once: true });
  };

  const circles = points.map(({ x, y }, i) => (
    <circle
      key={i}
      cx={xScale(x)}
      cy={yScale(y)}
      r="5"
      fill="var(--primary)"
      className="edge draggable invisible hover:fill-white group-hover/drawing:visible group-focus/drawing:visible"
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
          points={toPolygonPoints(points, xScale, yScale)}
          fill="var(--primary)"
          fillOpacity="0.2"
        />
        <line
          className="draggable"
          ref={ref}
          x1={xScale(points[0].x)}
          x2={xScale(points[1].x)}
          y1={yScale(points[0].y)}
          y2={yScale(points[1].y)}
          stroke="var(--primary)"
          strokeWidth="2"
        />
        <line
          className="draggable"
          x1={xScale(points[2].x)}
          x2={xScale(points[3].x)}
          y1={yScale(points[2].y)}
          y2={yScale(points[3].y)}
          stroke="var(--primary)"
          strokeWidth="2"
        />
        {circles}
        <circle
          {...getLineCenter([points[0], points[1]], xScale, yScale)}
          r="5"
          fill="var(--primary)"
          className="draggable invisible hover:fill-white group-hover/drawing:visible group-focus/drawing:visible"
          onMouseDown={(e) => dragCenter(e, 0)}
        />
        <circle
          {...getLineCenter([points[2], points[3]], xScale, yScale)}
          r="5"
          fill="var(--primary)"
          className="draggable invisible hover:fill-white group-hover/drawing:visible group-focus/drawing:visible"
          onMouseDown={(e) => dragCenter(e, 1)}
        />
      </g>
    </>
  );
};
