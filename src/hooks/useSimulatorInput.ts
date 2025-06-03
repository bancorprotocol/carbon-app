import {
  InternalStrategyInput,
  useStrategyInput,
} from 'hooks/useStrategyInput';
import { StrategyInputSearch } from 'libs/routing/routes/sim';
import { useCallback, useMemo } from 'react';
import { getBounds } from 'components/strategies/common/utils';

export type SimulatorInputDispatch = <
  T extends InternalStrategyInput,
  K extends keyof T,
>(
  key: K,
  value: T[K],
  setBounds?: boolean,
) => void;

interface Props {
  searchState: StrategyInputSearch;
}

export const useSimulatorInput = ({ searchState }: Props) => {
  const { state, dispatch: _dispatch } = useStrategyInput({ searchState });

  const bounds = useMemo(
    () => getBounds(state.buy, state.sell),
    [state.buy, state.sell],
  );

  const dispatch: SimulatorInputDispatch = useCallback(
    (key, value) => {
      _dispatch(key, value);
    },
    [_dispatch],
  );

  return { dispatch, state, bounds, searchState };
};
