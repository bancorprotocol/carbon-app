import { useCallback, useEffect, useMemo, useState } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type Screens = {
  [key in Breakpoint]: number;
};

const screens: Screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const getWidth = () => {
  return window?.innerWidth || 0;
};

export const useBreakpoints = () => {
  const [width, setWidth] = useState(getWidth);

  const currentBreakpoint = useMemo(() => {
    return Object.keys(screens).reduce(
      (acc, key) => (width >= screens[key as Breakpoint] ? key : acc),
      'sm',
    ) as Breakpoint;
  }, [width]);

  const aboveBreakpoint = useCallback(
    (breakpoint: Breakpoint) => {
      return width >= screens[breakpoint];
    },
    [width],
  );

  const belowBreakpoint = useCallback(
    (breakpoint: Breakpoint) => {
      return width < screens[breakpoint];
    },
    [width],
  );

  const track = useCallback(() => {
    setWidth(getWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', track);
    return () => window.removeEventListener('resize', track);
  }, [track]);

  return { currentBreakpoint, aboveBreakpoint, belowBreakpoint };
};
