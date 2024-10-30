import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';
import { ScaleBand, ScaleLinear } from 'd3';
import { useEffect, useState } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { scaleBandInvert } from './utils';
import { useD3ChartCtx } from './D3ChartContext';
import { getAreaBox } from './drawing/utils';

const rect = {
  w: 72,
  h: 24,
};

const usePointerPosition = (
  xScale: ScaleBand<string>,
  yScale: ScaleLinear<number, number, never>
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
  return (
    <>
      {/* X axis */}
      <line
        x1={(xScale(position.x) ?? 0) + xScale.bandwidth() / 2}
        x2={(xScale(position.x) ?? 0) + xScale.bandwidth() / 2}
        y1={0}
        y2={dms.boundedHeight}
        stroke="white"
        strokeOpacity="0.5"
        strokeDasharray="5"
        strokeDashoffset="5"
        className="pointer-events-none"
      />
      <rect
        x={(xScale(position.x) ?? 0) + xScale.bandwidth() / 2 - rect.w / 2}
        y={dms.boundedHeight}
        width={rect.w}
        height={rect.h}
        rx="4"
        ry="4"
        className="fill-background-700"
      />
      <text
        x={(xScale(position.x) ?? 0) + xScale.bandwidth() / 2}
        y={dms.boundedHeight + 8}
        dominantBaseline="hanging"
        textAnchor="middle"
        fontSize="12"
        fill="white"
      >
        {xAxisFormatter.format(fromUnixUTC(position.x))}
      </text>
      {/* Y axis */}
      <line
        x1={0}
        x2={dms.boundedWidth}
        y1={yScale(position.y)}
        y2={yScale(position.y)}
        stroke="white"
        strokeOpacity="0.5"
        strokeDasharray="5"
        strokeDashoffset="5"
        className="pointer-events-none"
      />
      <rect
        x={dms.boundedWidth}
        y={yScale(position.y) - rect.h / 2}
        width={rect.w}
        height={rect.h}
        rx="4"
        ry="4"
        className="fill-background-700"
      />
      <text
        x={dms.boundedWidth + 8}
        y={yScale(position.y)}
        dominantBaseline="middle"
        textAnchor="start"
        fontSize="12"
        fill="white"
      >
        {prettifyNumber(position.y)}
      </text>
    </>
  );
};
