import { FC } from 'react';
import { Drawing, useD3ChartCtx } from '../D3ChartContext';
import { getMax, getMin } from 'utils/helpers/operators';
import { prettifyNumber } from 'utils/helpers';
import { fromUnixUTC, dayFormatter } from 'components/simulator/utils';
import { handleDms } from '../utils';

export const D3AllDrawingRanges = () => {
  const { drawings } = useD3ChartCtx();
  return drawings.map((d, i) => <D3DrawingRanges key={i} drawing={d} />);
};

interface Props {
  drawing: Drawing;
  color?: 'primary' | 'secondary' | 'buy' | 'sell';
  formatX?: (x: string) => string;
  formatY?: (y: number) => string;
}
export const D3DrawingRanges: FC<Props> = ({
  drawing,
  color = 'secondary',
  formatX = (x: string) => dayFormatter.format(fromUnixUTC(x)),
  formatY = (y: number) => prettifyNumber(y, { abbreviate: true }),
}) => {
  const xMin = getMin(...drawing.points.map((v) => v.x)).toString();
  const xMax = getMax(...drawing.points.map((v) => v.x)).toString();
  const yMin = getMin(...drawing.points.map((v) => v.y));
  const yMax = getMax(...drawing.points.map((v) => v.y));
  return (
    <g id={`ranges-${drawing.id}`} className="hidden">
      <D3DrawingXRange format={formatX} min={xMin} max={xMax} color={color} />
      <D3DrawingYRange format={formatY} min={yMin} max={yMax} color={color} />
    </g>
  );
};

interface XRangeProps {
  min: string;
  max: string;
  color: 'primary' | 'secondary' | 'buy' | 'sell';
  format: (x: string) => string;
}
export const D3DrawingXRange: FC<XRangeProps> = (props) => {
  const { dms, xScale } = useD3ChartCtx();
  const min = xScale(props.min)!;
  const max = xScale(props.max)!;
  const y = dms.boundedHeight + dms.marginBottom / 2 - handleDms.height / 2;
  return (
    <g>
      <rect
        x={min}
        y={dms.boundedHeight}
        height={dms.marginBottom}
        width={max - min}
        fill={`var(--color-${props.color})`}
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
          fill={`var(--color-${props.color})`}
        />
        <text
          x={xScale.bandwidth() / 2}
          y={handleDms.height / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {props.format(props.min)}
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
          fill={`var(--color-${props.color})`}
        />
        <text
          x={xScale.bandwidth() / 2}
          y={handleDms.height / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {props.format(props.max)}
        </text>
      </g>
    </g>
  );
};

interface YRangeProps {
  min: number;
  max: number;
  color: 'primary' | 'secondary' | 'buy' | 'sell';
  format: (y: number) => string;
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
        fill={`var(--color-${props.color})`}
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
          fill={`var(--color-${props.color})`}
        />
        <text
          x={dms.marginRight / 2}
          y="0"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {props.format(props.min)}
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
          fill={`var(--color-${props.color})`}
        />
        <text
          x={dms.marginRight / 2}
          y="0"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="black"
        >
          {props.format(props.max)}
        </text>
      </g>
    </g>
  );
};
