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
import { getMax, getMin } from 'utils/helpers/operators';
import { getAreaBox, getDelta, getEdges, getInitialPoints } from './utils';

const getRectPoints = (points: ChartPoint[]) => {
  const minX = getMin(...points.map((p) => p.x)).toString();
  const minY = getMin(...points.map((p) => p.y));
  const maxX = getMax(...points.map((p) => p.x)).toString();
  const maxY = getMax(...points.map((p) => p.y));
  // yScale will invert Y, so we need to put maxY first
  return [
    { x: minX, y: maxY },
    { x: minX, y: minY },
    { x: maxX, y: maxY },
    { x: maxX, y: minY },
  ];
};
const getRectProps = (
  points: ChartPoint[],
  xScale: ScaleBand<string>,
  yScale: ScaleLinear<number, number>,
) => ({
  x: xScale(points[0].x)!,
  y: yScale(points[0].y),
  width: xScale(points[3].x)! - xScale(points[0].x)!,
  height: yScale(points[3].y) - yScale(points[0].y),
});

interface Props {
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
  onChange: (points: ChartPoint[]) => any;
}

export const D3DrawRect: FC<Props> = ({ xScale, yScale, onChange }) => {
  const ref = useRef<SVGRectElement>(null);
  const { dms } = useD3ChartCtx();
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;

  useEffect(() => {
    if (points.length !== 1) return;
    const area = document.querySelector<SVGElement>('.chart-drawing-canvas')!;
    const root = area!.getBoundingClientRect();
    const handler = (event: MouseEvent) => {
      if (!ref.current) return;
      const x = invertX(event.clientX - root.x);
      const y = invertY(event.clientY - root.y);
      const newPoints = getRectPoints([points[0], { x, y }]);
      const props = getRectProps(newPoints, xScale, yScale);
      for (const [key, value] of Object.entries(props)) {
        ref.current.setAttribute(key, value.toString());
      }
    };
    area.addEventListener('mousemove', handler as any);
    return () => area.removeEventListener('mousemove', handler as any);
  }, [invertX, invertY, points, xScale, yScale]);

  const addPoint = (event: ReactMouseEvent) => {
    const svg = document.getElementById('interactive-chart')!;
    const root = svg.getBoundingClientRect();
    const x = invertX(event.clientX - root.x);
    const y = invertY(event.clientY - root.y);
    const rect = [...points, { x, y }];
    setPoints(rect);
    if (points.length === 1) {
      const [min, , , max] = getRectPoints(rect);
      onChange([min, max]);
    }
  };

  return (
    <>
      {!!points.length && (
        <rect
          ref={ref}
          x={xScale(points[0].x)}
          y={yScale(points[0].y)}
          width="0"
          height="0"
          stroke="var(--primary)"
          strokeWidth="2"
          fill="var(--primary)"
          fillOpacity="0.2"
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

export const D3EditRect: FC<D3ShapeProps> = ({ drawing, onChange }) => {
  const ref = useRef<SVGRectElement>(null);
  const [editing, setEditing] = useState(false);
  const { dms, xScale, yScale } = useD3ChartCtx();
  const invertX = scaleBandInvert(xScale);
  const invertY = yScale.invert;
  const rectPoints = getRectPoints(drawing.points);
  const rectProps = getRectProps(rectPoints, xScale, yScale);

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
    const circles = getEdges(drawing.id);
    const root = getAreaBox();
    const initialPoints = getInitialPoints(root, circles);
    shape.style.setProperty('cursor', 'grabbing');
    const move = (e: MouseEvent) => {
      const delta = getDelta(root, event, e);
      if (!delta) return;
      const points = initialPoints.map(({ x, y }) => ({
        x: invertX(x + delta.x),
        y: invertY(y + delta.y),
      }));
      const [min, , , max] = getRectPoints(points);
      onChange([min, max]);
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
    const circle = event.currentTarget;
    circle.style.setProperty('cursor', 'grabbing');
    const box = circle.getBoundingClientRect();
    const root = getAreaBox();
    const initialX = box.x - root.x + box.width / 2;
    const initialY = box.y - root.y + box.width / 2;
    const points = structuredClone(rectPoints);
    const move = (e: MouseEvent) => {
      const delta = getDelta(root, event, e);
      if (!delta) return;
      const opposite = points.find((p) => {
        return p.x !== points[index].x && p.y !== points[index].y;
      });
      if (!opposite) return;
      const newPoint = {
        x: invertX(initialX + delta.x),
        y: invertY(initialY + delta.y),
      };
      onChange([opposite, newPoint]);
    };
    const dragEnd = () => {
      document.removeEventListener('mousemove', move);
      circle.style.removeProperty('cursor');
      setEditing(false);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', dragEnd, { once: true });
  };
  const circles = rectPoints.map(({ x, y }, i) => (
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
        <rect
          className="draggable"
          ref={ref}
          {...rectProps}
          stroke="var(--primary)"
          strokeWidth="2"
          fill="var(--primary)"
          fillOpacity="0.2"
        />
        {circles}
      </g>
    </>
  );
};
