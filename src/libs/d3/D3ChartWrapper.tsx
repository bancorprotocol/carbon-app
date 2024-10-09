import {
  useChartDimensions,
  D3ChartSettings,
  D3ChartSettingsProps,
} from 'libs/d3';
import { FC, ReactNode } from 'react';

interface Props {
  children: (dms: D3ChartSettings) => ReactNode;
  settings: D3ChartSettingsProps;
  className?: string;
}

export const D3ChartWrapper: FC<Props> = ({
  children,
  settings,
  className,
  ...props
}) => {
  const [ref, dms] = useChartDimensions(settings);
  return (
    <svg ref={ref} id="interactive-chart" className={className} {...props}>
      <defs>
        <linearGradient id="svg-brand-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--gradient-first)" />
          <stop offset="50%" stopColor="var(--gradient-middle)" />
          <stop offset="100%" stopColor="var(--gradient-last)" />
        </linearGradient>
      </defs>
      <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
        {children(dms)}
      </g>
    </svg>
  );
};
