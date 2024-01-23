import { D3ChartSettings, D3ChartSettingsProps } from 'libs/d3/types';
import { useChartDimensions } from 'libs/d3/useChartDimensions';
import { ReactNode } from 'react';

interface Props {
  children: (dms: D3ChartSettings) => ReactNode;
  settings: D3ChartSettingsProps;
}

export const SimChartWrapper = ({ children, settings }: Props) => {
  const [ref, dms] = useChartDimensions(settings);

  return (
    <div ref={ref}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
          {children(dms)}
        </g>
      </svg>
    </div>
  );
};
