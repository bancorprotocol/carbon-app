import { D3ChartSettings, D3ChartSettingsProps } from './types';
import { RefObject, useEffect, useRef, useState } from 'react';

export const useChartDimensions = (
  settings: D3ChartSettingsProps
): [RefObject<SVGSVGElement>, D3ChartSettings] => {
  const ref = useRef<SVGSVGElement>(null);
  const dimensions = combineChartDimensions(settings);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return;
    const element = ref.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const rect = entries[0].target?.getBoundingClientRect();
      if (!rect) return;
      if (!dimensions.width && width !== rect.width) setWidth(rect.width);
      if (!dimensions.height && height !== rect.height) setHeight(rect.height);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [dimensions.height, dimensions.width, height, width]);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

const combineChartDimensions = (dimensions: D3ChartSettingsProps) => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop || 0,
    marginRight: dimensions.marginRight || 0,
    marginBottom: dimensions.marginBottom || 0,
    marginLeft: dimensions.marginLeft || 0,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};
