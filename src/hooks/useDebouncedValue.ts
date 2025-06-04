import { useEffect, useState, useRef, useCallback } from 'react';

export const useDebouncedValue = <T = any>(
  value: T,
  wait: number,
  options: { leading?: boolean; cb?: (v: T) => unknown } = { leading: false },
) => {
  const [_value, _setValue] = useState(value);
  const mountedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const cooldownRef = useRef(false);

  const setValue = useCallback(
    (v: T) => {
      _setValue(v);
      options.cb?.(v);
    },
    [options],
  );

  const cancel = () => window.clearTimeout(timeoutRef.current);

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setValue(value);
      } else {
        cancel();
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait, setValue]);

  useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [_value, cancel] as const;
};
