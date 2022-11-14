import { useMemo, useState } from 'react';
import { debounce } from 'lodash';

export const useDebounce = (
  initialState: any = null,
  interval: number = 500
) => {
  const [state, setState] = useState(initialState);

  const setDebouncedState = (_val: string) => {
    debouncer(_val);
  };

  const debouncer = useMemo(
    () =>
      debounce((_prop: string) => {
        setState(_prop);
      }, interval),
    [interval]
  );

  return [state, setDebouncedState];
};
