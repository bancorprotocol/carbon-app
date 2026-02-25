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
      <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
        {children(dms)}
      </g>
    </svg>
  );
};
