import { ResizeObserver } from '@juggle/resize-observer';
import { D3ChartSettings, D3ChartSettingsProps } from './types';
import { RefObject, useEffect, useRef, useState } from 'react';

export const useChartDimensions = (
  setttings: D3ChartSettingsProps
): [RefObject<HTMLDivElement>, D3ChartSettings] => {
  const ref = useRef<HTMLDivElement>(null);
  const dimensions = combineChartDimensions(setttings);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      return;
    }
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;
      const entry = entries[0];
      if (width !== entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height)
        setHeight(entry.contentRect.height);
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
