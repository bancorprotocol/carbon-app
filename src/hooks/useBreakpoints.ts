import { useCallback, useEffect, useState } from 'react';

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

export const useBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm');

  const aboveBreakpoint = useCallback(
    (target: Breakpoint) => {
      return screens[breakpoint] >= screens[target];
    },
    [breakpoint],
  );

  const belowBreakpoint = useCallback(
    (target: Breakpoint) => {
      return screens[breakpoint] < screens[target];
    },
    [breakpoint],
  );

  useEffect(() => {
    const cleanup: (() => void)[] = [];
    // landscape mode
    for (const [key, value] of Object.entries(screens)) {
      const media = `(width >= ${value}px) and (orientation: landscape)`;
      const queryList = window.matchMedia(media);
      if (queryList.matches) setBreakpoint(key as Breakpoint);
      const update = (e: MediaQueryListEvent) => {
        if (e.matches) setBreakpoint(key as Breakpoint);
      };
      queryList.addEventListener('change', update);
      cleanup.push(() => queryList.removeEventListener('change', update));
    }
    // portrait -> sm
    const portrait = window.matchMedia('(orientation: portrait)');
    if (portrait.matches) setBreakpoint('sm');
    const setPortrait = (e: MediaQueryListEvent) => {
      if (e.matches) setBreakpoint('sm');
    };
    portrait.addEventListener('change', setPortrait);
    cleanup.push(() => portrait.removeEventListener('change', setPortrait));

    // cleanup
    return () => cleanup.forEach((fn) => fn());
  }, []);

  return {
    currentBreakpoint: breakpoint,
    aboveBreakpoint,
    belowBreakpoint,
  };
};
