/* eslint-disable unused-imports/no-unused-vars */
import { useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { StrategyInputOrder } from 'hooks/useStrategyInput';
import { useToken } from 'hooks/useTokens';
import { SimulatorInputOverlappingSearch } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useMemo, useState } from 'react';
import { getBounds } from 'components/strategies/common/utils';

export interface InternalSimulatorOverlappingInput
  extends SimulatorInputOverlappingSearch {
  buyMax?: string;
  sellMin?: string;
  buyBudget?: string;
  sellBudget?: string;
  sellBudgetError?: string;
  buyBudgetError?: string;
}

export type SimulatorOverlappingInputDispatch = <
  T extends InternalSimulatorOverlappingInput,
  K extends keyof T,
>(
  key: K,
  value: T[K],
) => void;

interface Props {
  searchState: SimulatorInputOverlappingSearch;
}

export interface SimulatorInputOverlappingValues {
  baseToken?: Token;
  quoteToken?: Token;
  buy: Omit<StrategyInputOrder, 'isRange'>;
  sell: Omit<StrategyInputOrder, 'isRange'>;
  start?: string;
  end?: string;
  spread: string;
}

export const useSimulatorOverlappingInput = ({ searchState }: Props) => {
  const navigate = useNavigate({ from: '/simulate/overlapping' });
  const [_state, setState] =
    useState<InternalSimulatorOverlappingInput>(searchState);

  const baseToken = useToken(_state.baseToken);
  const quoteToken = useToken(_state.quoteToken);

  const state = buildStrategyInputState(_state, baseToken, quoteToken);

  const setSearch = useCallback(
    (search: InternalSimulatorOverlappingInput) => {
      const {
        buyMax,
        sellMin,
        buyBudget,
        sellBudget,
        buyBudgetError,
        sellBudgetError,
        ...newSearch
      } = search;

      void navigate({
        search: newSearch,
        params: {},
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  useDebouncedValue(_state, 300, { cb: setSearch });

  const bounds = useMemo(
    () => getBounds(state.buy, state.sell),
    [state.buy, state.sell],
  );

  const dispatch: SimulatorOverlappingInputDispatch = useCallback(
    (key, value) => setState((state) => ({ ...state, [key]: value })),
    [],
  );

  return { dispatch, state, bounds, searchState };
};

export const buildStrategyInputState = (
  state: InternalSimulatorOverlappingInput,
  baseToken?: Token,
  quoteToken?: Token,
): SimulatorInputOverlappingValues => {
  return {
    baseToken,
    quoteToken,
    buy: {
      min: state.buyMin || '',
      max: state.buyMax || '',
      budget: state.buyBudget || '',
      budgetError: state.buyBudgetError,
    },
    sell: {
      min: state.sellMin || '',
      max: state.sellMax || '',
      budget: state.sellBudget || '',
      budgetError: state.sellBudgetError,
    },
    start: state.start || undefined,
    end: state.end || undefined,
    spread: state.spread || '',
  };
};
