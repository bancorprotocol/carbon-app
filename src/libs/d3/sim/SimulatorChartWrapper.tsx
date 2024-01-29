import { D3ChartSettings, D3ChartSettingsProps } from 'libs/d3/types';
import { useChartDimensions } from 'libs/d3/useChartDimensions';
import { FC, ReactNode } from 'react';

interface Props {
  children: (dms: D3ChartSettings) => ReactNode;
  settings: D3ChartSettingsProps;
  className?: string;
}

export const SimChartWrapper: FC<Props> = ({
  children,
  settings,
  className,
}) => {
  const [divRef, dms] = useChartDimensions(settings);

  return (
    <div ref={divRef} className={className}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
          {children(dms)}
        </g>
      </svg>
    </div>
  );
};
