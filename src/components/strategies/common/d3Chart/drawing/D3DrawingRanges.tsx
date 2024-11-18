import { FC } from 'react';
import { Drawing, useD3ChartCtx } from '../D3ChartContext';
import { getMax, getMin } from 'utils/helpers/operators';
import { prettifyNumber } from 'utils/helpers';
import { fromUnixUTC, xAxisFormatter } from 'components/simulator/utils';
import { handleDms } from '../utils';

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
      <D3DrawingXRange min={xMin} max={xMax} />
      <D3DrawingYRange min={yMin} max={yMax} />
    </g>
  );
};

interface XRangeProps {
  min: number;
  max: number;
}
export const D3DrawingXRange: FC<XRangeProps> = (props) => {
  const { dms, xScale } = useD3ChartCtx();
  const min = xScale(props.min.toString())!;
  const max = xScale(props.max.toString())!;
  const y = dms.boundedHeight + dms.marginBottom / 2 - handleDms.height / 2;
  return (
    <g>
      <rect
        x={min}
        y={dms.boundedHeight}
        height={dms.marginBottom}
        width={max - min}
        fill="var(--primary)"
        fillOpacity="0.2"
      />
      <g transform={`translate(${min}, ${y})`}>
        <rect
          x={handleDms.width / -2}
          y="0"
          width={handleDms.width}
          height={handleDms.height}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x={xScale.bandwidth() / 2}
          y={handleDms.height / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {xAxisFormatter.format(fromUnixUTC(props.min))}
        </text>
      </g>
      <g transform={`translate(${max}, ${y})`}>
        <rect
          x={handleDms.width / -2}
          y="0"
          width={handleDms.width}
          height={handleDms.height}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x={xScale.bandwidth() / 2}
          y={handleDms.height / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {xAxisFormatter.format(fromUnixUTC(props.max))}
        </text>
      </g>
    </g>
  );
};

interface YRangeProps {
  min: number;
  max: number;
}
export const D3DrawingYRange: FC<YRangeProps> = (props) => {
  const { dms, yScale } = useD3ChartCtx();
  const min = yScale(props.min);
  const max = yScale(props.max);
  const x = dms.boundedWidth;
  const padding = (dms.marginRight - handleDms.width) / 2;
  return (
    <g>
      <rect
        x={dms.boundedWidth}
        y={max}
        width={dms.marginRight}
        height={min - max}
        fill="var(--primary)"
        fillOpacity="0.2"
      />
      <g transform={`translate(${x}, ${min})`}>
        <rect
          x={padding}
          y={handleDms.height / -2}
          width={handleDms.width}
          height={handleDms.height}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x={dms.marginRight / 2}
          y="0"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {prettifyNumber(props.min, { abbreviate: true })}
        </text>
      </g>
      <g transform={`translate(${x}, ${max})`}>
        <rect
          x={padding}
          y={handleDms.height / -2}
          width={handleDms.width}
          height={handleDms.height}
          rx="4"
          ry="4"
          fill="var(--primary)"
        />
        <text
          x={dms.marginRight / 2}
          y="0"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {prettifyNumber(props.max, { abbreviate: true })}
        </text>
      </g>
    </g>
  );
};
