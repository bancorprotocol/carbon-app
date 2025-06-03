import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';
import { ScaleBand, ScaleLinear } from 'd3';
import { useEffect, useState } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { handleDms, scaleBandInvert } from './utils';
import { useD3ChartCtx } from './D3ChartContext';
import { getAreaBox } from './drawing/utils';

const usePointerPosition = (
  xScale: ScaleBand<string>,
  yScale: ScaleLinear<number, number, never>,
) => {
  const [position, setPosition] = useState<{ x: string; y: number }>();
  useEffect(() => {
    const invert = scaleBandInvert(xScale);
    const chart = document.getElementById('interactive-chart');
    const box = getAreaBox();
    const move = (event: MouseEvent) => {
      if (event.clientX > box.x + box.width) return;
      if (event.clientY > box.y + box.height) return;
      const position = {
        x: event.clientX - box.x,
        y: event.clientY - box.y,
      };
      setPosition({
        x: invert(position.x),
        y: yScale.invert(position.y),
      });
    };
    const out = () => setPosition(undefined);
    chart?.addEventListener('mousemove', move);
    chart?.addEventListener('mouseout', out);
    return () => {
      chart?.removeEventListener('mousemove', move);
      chart?.removeEventListener('mouseout', out);
    };
  }, [xScale, yScale]);
  return position;
};

export const D3Pointer = () => {
  const { dms, xScale, yScale } = useD3ChartCtx();
  const position = usePointerPosition(xScale, yScale);
  if (!position) return;
  const x = xScale(position.x)!;
  const y = yScale(position.y);
  const bandwidth = xScale.bandwidth();
  return (
    <>
      {/* X axis */}
      <line
        x1={x + bandwidth / 2}
        x2={x + bandwidth / 2}
        y1={0}
        y2={dms.boundedHeight + 5}
        stroke="white"
        strokeOpacity="0.5"
        strokeDasharray="5"
        strokeDashoffset="5"
        className="pointer-events-none"
      />
      <rect
        x={x + bandwidth / 2 - handleDms.width / 2}
        y={dms.boundedHeight + 5}
        width={handleDms.width}
        height={handleDms.height}
        rx="4"
        ry="4"
        className="fill-background-700"
      />
      <text
        x={x + bandwidth / 2}
        y={dms.boundedHeight + 13}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="10"
        fill="white"
      >
        {xAxisFormatter.format(fromUnixUTC(position.x))}
      </text>
      {/* Y axis */}
      <line
        x1={0}
        x2={dms.boundedWidth + 5}
        y1={y}
        y2={y}
        stroke="white"
        strokeOpacity="0.5"
        strokeDasharray="5"
        strokeDashoffset="5"
        className="pointer-events-none"
      />
      <rect
        x={dms.boundedWidth + 5}
        y={y - handleDms.height / 2}
        width={handleDms.width}
        height={handleDms.height}
        rx="4"
        ry="4"
        className="fill-background-700"
      />
      <text
        x={dms.boundedWidth + 13}
        y={y}
        dominantBaseline="middle"
        textAnchor="start"
        fontSize="10"
        fill="white"
      >
        {prettifyNumber(position.y)}
      </text>
    </>
  );
};
