import { useEffect, useRef } from 'react';

function useInitEffect(effect: () => void, deps: any[]) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      return effect();
    }
  }, deps);
}

export default useInitEffect;
