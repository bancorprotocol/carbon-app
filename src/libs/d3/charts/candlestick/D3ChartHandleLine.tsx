import { D3ChartSettings } from 'libs/d3';
import { SVGProps } from 'react';

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
}

export const D3ChartHandleLine = ({ lineProps, ...props }: Props) => {
  const { selector, dms, color, y = 0, label } = props;
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
      <g transform={`translate(${lineWidth},-${handleDms.height / 2})`}>
        <rect y={y} {...handleDms} fill={color} rx={4} />
        {label && (
          <text y={y + 12} x={6} fill="black" fontSize={10}>
            {label}
          </text>
        )}
      </g>
    </g>
  );
};
