import { D3ChartSettings } from 'libs/d3';
import { SVGProps } from 'react';
import { cn } from 'utils/helpers';

const handleDms = {
  width: 64,
  height: 16,
};

interface Props {
  selector?: string;
  dms: D3ChartSettings;
  y?: number;
  color: string;
  label?: string;
  lineProps?: SVGProps<SVGLineElement>;
  handleClassName?: string;
  readonly?: boolean;
  isDraggable?: boolean;
}

export const D3ChartHandleLine = ({ lineProps, ...props }: Props) => {
  const {
    selector,
    dms,
    color,
    y = 0,
    label,
    readonly,
    isDraggable,
    handleClassName,
  } = props;
  const lineWidth = dms.boundedWidth + 5;

  return (
    <g className={selector}>
      <line
        x1={0}
        x2={lineWidth}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={1}
        {...lineProps}
      />
      <g
        transform={`translate(${lineWidth},-${handleDms.height / 2})`}
        className={cn(
          isDraggable && !readonly && 'cursor-ns-resize',
          handleClassName
        )}
      >
        <rect y={y} {...handleDms} fill={color} rx={4} />
        {label && (
          <text y={y + 12} x={6} fill="black" fontSize={10}>
            {label}
          </text>
        )}
      </g>
      {readonly && (
        <g
          className="readonly"
          transform={`translate(${lineWidth - 20}, ${y - 8})`}
        >
          <circle cx="8.41406" cy="8.28931" r="8" fill="#404040" />
          <rect
            x="5.49805"
            y="7.87268"
            width="5.83333"
            height="4.16667"
            rx="1"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.33008 6.62264C6.33008 5.47205 7.26282 4.53931 8.41341 4.53931V4.53931C9.564 4.53931 10.4967 5.47205 10.4967 6.62264V7.87264H6.33008V6.62264Z"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
};
