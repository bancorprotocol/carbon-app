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

const defaultWidth = window?.innerWidth || 0;

export const useBreakpoints = () => {
  const [width, setWidth] = useState(defaultWidth);

  const currentBreakpoint = useMemo(() => {
    return Object.keys(screens).reduce(
      (acc, key) => (width >= screens[key as Breakpoint] ? key : acc),
      'sm'
    ) as Breakpoint;
  }, [width]);

  const aboveBreakpoint = useCallback(
    (breakpoint: Breakpoint) => {
      return width >= screens[breakpoint];
    },
    [width]
  );

  const belowBreakpoint = useCallback(
    (breakpoint: Breakpoint) => {
      return width < screens[breakpoint];
    },
    [width]
  );

  useEffect(() => {
    const track = (innerWidth?: number) => {
      setWidth(innerWidth || defaultWidth);
    };
    window?.addEventListener('resize', (e) =>
      // @ts-ignore
      track(e.currentTarget?.innerWidth)
    );
    return () => window?.removeEventListener('resize', () => track());
  }, []);

  return { width, currentBreakpoint, aboveBreakpoint, belowBreakpoint };
};
