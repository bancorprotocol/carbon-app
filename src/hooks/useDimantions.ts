import { useRef, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

const observerErr =
  "💡 react-cool-dimensions: the browser doesn't support Resize Observer, please use polyfill: https://github.com/wellyshen/react-cool-dimensions#resizeobserver-polyfill";
const borderBoxWarn =
  "💡 react-cool-dimensions: the browser doesn't support border-box size, fallback to content-box size. Please see: https://github.com/wellyshen/react-cool-dimensions#border-box-size-measurement";

interface State {
  readonly width: number;
  readonly height: number;
  readonly entry?: ResizeObserverEntry;
}
interface Observe<T> {
  (element?: T | null): void;
}
interface Event<T> extends State {
  readonly entry: ResizeObserverEntry;
  observe: Observe<T>;
  unobserve: () => void;
}
interface Options {
  debouncedMs?: number;
  useBorderBoxSize?: boolean;
}
interface Return<T> extends Omit<Event<T>, 'entry'> {
  entry?: ResizeObserverEntry;
}

const initialState: State = {
  width: 0,
  height: 0,
};

const useDimensions = <T extends HTMLElement | null>({
  debouncedMs,
  useBorderBoxSize,
}: Options = {}): Return<T> => {
  const [stateDebounced, setStateDebounced] = useDebounce(
    initialState,
    debouncedMs
  );

  const prevSizeRef = useRef<{ width?: number; height?: number }>({});
  const observerRef = useRef<ResizeObserver>();
  const warnedRef = useRef(false);
  const ref = useRef<T>();

  const unobserve = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
  }, []);

  const observe = useCallback<Observe<T>>(
    (element) => {
      if (element && element !== ref.current) {
        unobserve();
        ref.current = element;
      }
      if (observerRef.current && ref.current)
        observerRef.current.observe(ref.current as HTMLElement);
    },
    [unobserve]
  );

  useEffect(() => {
    if (!('ResizeObserver' in window) || !('ResizeObserverEntry' in window)) {
      console.error(observerErr);
      return () => null;
    }

    let raf: number | null = null;

    observerRef.current = new ResizeObserver(([entry]) => {
      raf = requestAnimationFrame(() => {
        const { contentBoxSize, borderBoxSize, contentRect } = entry;

        let boxSize = contentBoxSize;
        if (useBorderBoxSize)
          if (borderBoxSize) {
            boxSize = borderBoxSize;
          } else if (!warnedRef.current) {
            console.warn(borderBoxWarn);
            warnedRef.current = true;
          }

        const width =
          boxSize && boxSize[0] ? boxSize[0].inlineSize : contentRect.width;
        const height =
          boxSize && boxSize[0] ? boxSize[0].blockSize : contentRect.height;

        const isUnchanged =
          width === prevSizeRef.current.width &&
          height === prevSizeRef.current.height;

        if (isUnchanged) {
          return;
        }

        prevSizeRef.current = { width, height };

        setStateDebounced({ width, height, entry });
      });
    });

    observe();

    return () => {
      unobserve();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [observe, setStateDebounced, unobserve, useBorderBoxSize]);

  return { ...stateDebounced, observe, unobserve };
};

export default useDimensions;
