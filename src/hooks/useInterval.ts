import { useEffect, useRef } from 'react';

export const useInterval = (
  callback: () => void,
  delay: null | number,
  leading = true
) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      const current = savedCallback.current;
      current && current();
    }

    if (delay !== null) {
      if (leading) tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay, leading]);
};
