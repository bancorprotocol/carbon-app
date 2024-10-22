import { FC } from 'react';
import { Drawing, useD3ChartCtx } from '../D3ChartContext';
import { getMax, getMin } from 'utils/helpers/operators';
import { prettifyNumber } from 'utils/helpers';
import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';

const rect = {
  w: 72,
  h: 24,
};

export const D3AllDrawingRanges = () => {
  const { drawings } = useD3ChartCtx();
  return drawings.map((d, i) => <D3DrawingRanges key={i} drawing={d} />);
};

interface Props {
  drawing: Drawing;
}
export const D3DrawingRanges: FC<Props> = ({ drawing }) => {
  const xMin = getMin(...drawing.points.map((v) => v.x));
  const xMax = getMax(...drawing.points.map((v) => v.x));
  const yMin = getMin(...drawing.points.map((v) => v.y));
  const yMax = getMax(...drawing.points.map((v) => v.y));
  return (
    <g id={`ranges-${drawing.id}`} className="hidden">
      <D3DrawingXRange min={xMin.toString()} max={xMax.toString()} />
      <D3DrawingYRange min={yMin} max={yMax} />
    </g>
  );
};

interface XRangeProps {
  min: string;
  max: string;
}
export const D3DrawingXRange: FC<XRangeProps> = ({ min, max }) => {
  const { dms, xScale } = useD3ChartCtx();
  return (
    <g>
      <rect
        x={xScale(min)}
        y={dms.boundedHeight}
        height="40"
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
    <g>
      <rect
        x={dms.boundedWidth}
        y={yScale(max)}
        width="72"
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
