import { useNavigate, useSearch } from '@tanstack/react-router';
import { SimulatorInputSearch } from 'libs/routing/routes/sim';
import { useState } from 'react';
import { debounce } from 'utils/helpers';

export type StrategyInputDispatch = <
  T extends SimulatorInputSearch,
  K extends keyof T
>(
  key: K,
  value: T[K]
) => void;

export const useStrategyInput = () => {
  const navigate = useNavigate();
  const search: SimulatorInputSearch = useSearch({ strict: false });
  const [state, setState] = useState(search);

  const navigateDebounced = debounce((key: string, value: string) =>
    navigate({
      search: (search) => ({ ...search, [key]: value }),
      params: {},
      replace: true,
      resetScroll: false,
    })
  );

  const dispatch: StrategyInputDispatch = (key, value) => {
    setState((state) => ({ ...state, [key]: value }));
    navigateDebounced(key, value);
  };

  return [state, dispatch] as const;
};
