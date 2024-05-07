import { useState } from 'react';

export const useNextRender = <T>(cb: () => T | Promise<T>) => {
  const [state, setState] = useState<T | null>(null);
  setTimeout(async () => {
    const result = await cb();
    setState(result);
  }, 0);
  return state;
};
