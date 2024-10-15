import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';
import { ScaleBand, ScaleLinear } from 'd3';
import { D3ChartSettings } from 'libs/d3';
import { FC, useEffect, useState } from 'react';
import { prettifyNumber } from 'utils/helpers';

const rect = {
  w: 72,
  h: 24,
};

const usePointerPosition = (
  xScale: ScaleBand<string>,
  yScale: ScaleLinear<number, number, never>
) => {
  const [position, setPosition] = useState<{ x: string; y: number }>();
  function scaleBandInvert(scale: ScaleBand<string>) {
    var domain = scale.domain();
    var paddingOuter = scale(domain[0]) ?? 0;
    var eachBand = scale.step();
    return function (value: number) {
      var index = Math.floor((value - paddingOuter) / eachBand);
      return domain[Math.max(0, Math.min(index, domain.length - 1))];
    };
  }
  useEffect(() => {
    const invert = scaleBandInvert(xScale);
    const chart = document.querySelector<HTMLElement>('.chart-area');
    const move = (event: MouseEvent) => {
      const rect = chart!.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.x,
        y: event.clientY - rect.y,
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

interface Props {
  dms: D3ChartSettings;
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number, never>;
}

export const D3Pointer: FC<Props> = ({ dms, xScale, yScale }) => {
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
