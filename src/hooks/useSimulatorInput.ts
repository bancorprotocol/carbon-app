import {
  InternalStrategyInput,
  useStrategyInput,
} from 'hooks/useStrategyInput';
import { ChartPrices } from 'components/strategies/common/d3Chart/D3ChartCandlesticks';
import { StrategyInputSearch } from 'libs/routing/routes/sim';
import { useCallback, useState } from 'react';

export type SimulatorInputDispatch = <
  T extends InternalStrategyInput,
  K extends keyof T
>(
  key: K,
  value: T[K],
  setBounds?: boolean
) => void;

interface Props {
  searchState: StrategyInputSearch;
}

export const useSimulatorInput = ({ searchState }: Props) => {
  const { state, dispatch: _dispatch } = useStrategyInput({ searchState });

  const [bounds, setBounds] = useState<ChartPrices>({
    buy: { min: searchState.buyMin || '', max: searchState.buyMax || '' },
    sell: { min: searchState.sellMin || '', max: searchState.sellMax || '' },
  });

  const dispatch: SimulatorInputDispatch = useCallback(
    (key, value, updateBounds = true) => {
      _dispatch(key, value);

      if (!updateBounds) {
        return;
      }

      switch (key) {
        case 'buyMin':
          setBounds((bounds) => ({
            ...bounds,
            buy: { ...bounds.buy, min: value as string },
          }));
          break;
        case 'buyMax':
          setBounds((bounds) => ({
            ...bounds,
            buy: { ...bounds.buy, max: value as string },
          }));
          break;
        case 'sellMin':
          setBounds((bounds) => ({
            ...bounds,
            sell: { ...bounds.sell, min: value as string },
          }));
          break;
        case 'sellMax':
          setBounds((bounds) => ({
            ...bounds,
            sell: { ...bounds.sell, max: value as string },
          }));
          break;
      }
    },
    [_dispatch]
  );

  return { dispatch, state, bounds, searchState };
};
