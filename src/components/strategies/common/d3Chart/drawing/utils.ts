import { MouseEvent as ReactMouseEvent } from 'react';
export const getEdges = (id: number) => {
  const shape = document.getElementById(`shape-${id}`)!;
  const circles = shape.querySelectorAll<SVGCircleElement>('circle.edge');
  return Array.from(circles);
};

export const getAreaBox = () => {
  const area = document.querySelector<SVGElement>('.chart-area')!;
  return area.getBoundingClientRect();
};

export const getInitialPoints = (
  root: DOMRect,
  circles: SVGCircleElement[],
) => {
  return circles.map((c) => {
    const { x, y, width } = c.getBoundingClientRect();
    return {
      x: x - root.x + width / 2,
      y: y - root.y + width / 2,
    };
  });
};

export const getDelta = (
  root: DOMRect,
  mouseDown: ReactMouseEvent,
  moveMove: MouseEvent,
) => {
  if (moveMove.clientX < root.x || moveMove.clientX > root.x + root.width)
    return;
  if (moveMove.clientY < root.y || moveMove.clientY > root.y + root.height)
    return;
  return {
    x: moveMove.clientX - mouseDown.clientX,
    y: moveMove.clientY - mouseDown.clientY,
  };
};
