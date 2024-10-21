import { FC } from 'react';
import { ChartPoint, useD3ChartCtx } from '../D3ChartContext';
import { getMax, getMin } from 'utils/helpers/operators';
import { prettifyNumber } from 'utils/helpers';
import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';

const rect = {
  w: 72,
  h: 24,
};

interface Props {
  points: ChartPoint[];
}
export const D3DrawingRanges: FC<Props> = ({ points }) => {
  const xMin = getMin(...points.map((v) => v.x));
  const xMax = getMax(...points.map((v) => v.x));
  const yMin = getMin(...points.map((v) => v.y));
  const yMax = getMax(...points.map((v) => v.y));
  return (
    <>
      <D3DrawingXRange min={xMin.toString()} max={xMax.toString()} />
      <D3DrawingYRange min={yMin} max={yMax} />
    </>
  );
};

interface XRangeProps {
  min: string;
  max: string;
}
export const D3DrawingXRange: FC<XRangeProps> = ({ min, max }) => {
  const { dms, xScale } = useD3ChartCtx();
  return (
    <g className="hidden group-focus/drawing:block">
      <rect
        x={xScale(min)}
        y={dms.boundedHeight}
        height="80"
        width={xScale(max)! - xScale(min)!}
        fill="var(--primary)"
        fillOpacity="0.3"
      />
      <g transform={`translate(${xScale(min)}, ${dms.boundedHeight})`}>
        <rect
          x={rect.w / -2}
          y="8"
          width={rect.w}
          height={rect.h}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x={xScale.bandwidth() / 2}
          y="16"
          dominantBaseline="hanging"
          textAnchor="middle"
          fontSize="12"
          fill="white"
        >
          {xAxisFormatter.format(fromUnixUTC(min))}
        </text>
      </g>
      <g transform={`translate(${xScale(max)}, ${dms.boundedHeight})`}>
        <rect
          x={rect.w / -2}
          y="8"
          width={rect.w}
          height={rect.h}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x={xScale.bandwidth() / 2}
          y="16"
          dominantBaseline="hanging"
          textAnchor="middle"
          fontSize="12"
          fill="white"
        >
          {xAxisFormatter.format(fromUnixUTC(max))}
        </text>
      </g>
    </g>
  );
};

interface YRangeProps {
  min: number;
  max: number;
}
export const D3DrawingYRange: FC<YRangeProps> = ({ min, max }) => {
  const { dms, yScale } = useD3ChartCtx();
  return (
    <g className="hidden group-focus/drawing:block">
      <rect
        x={dms.boundedWidth}
        y={yScale(max)}
        width="80"
        height={yScale(min) - yScale(max)}
        fill="var(--primary)"
        fillOpacity="0.3"
      />
      <g transform={`translate(${dms.boundedWidth}, ${yScale(min)})`}>
        <rect
          x="4"
          y={rect.h / -2}
          width={rect.w}
          height={rect.h}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x="16"
          y="0"
          dominantBaseline="middle"
          textAnchor="start"
          fontSize="12"
          fill="white"
        >
          {prettifyNumber(min)}
        </text>
      </g>
      <g transform={`translate(${dms.boundedWidth}, ${yScale(max)})`}>
        <rect
          x="4"
          y={rect.h / -2}
          width={rect.w}
          height={rect.h}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x="16"
          y="0"
          dominantBaseline="middle"
          textAnchor="start"
          fontSize="12"
          fill="white"
        >
          {prettifyNumber(max)}
        </text>
      </g>
    </g>
  );
};
