import { D3ChartSettings } from 'libs/d3';

import { FC, MouseEvent, useState } from 'react';

interface Props {
  dms: D3ChartSettings;
}

export const D3DrawLine: FC<Props> = ({ dms }) => {
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  const start = (event: MouseEvent) => {
    const svg = document.getElementById('interactive-chart');
    const root = svg!.getBoundingClientRect();
    const x = event.clientX - root.x;
    const y = event.clientY - root.y;
    setPoints((points) => [...points, { x, y }]);
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
        onClick={start}
      />
      {points.map(({ x, y }) => (
        <circle key={x + '-' + y} cx={x} cy={y} r="5" fill="white" />
      ))}
    </>
  );
};
