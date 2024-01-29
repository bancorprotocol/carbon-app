import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useTokens } from 'hooks/useTokens';
import { SimulatorInputSearch, SimulatorType } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useMemo, useState } from 'react';

export type StrategyInputDispatch = <
  T extends StrategyInput,
  K extends keyof T
>(
  key: K,
  value: T[K]
) => void;

interface StrategyInput extends SimulatorInputSearch {
  sellBudgetError?: string;
  buyBudgetError?: string;
  buyPriceError?: string;
  sellPriceError?: string;
}

export interface StrategyInputOrder {
  min: string;
  max: string;
  budget: string;
  budgetError?: string;
  priceError?: string;
  isRange: boolean;
}

export interface StrategyInput2 {
  baseToken?: Token;
  quoteToken?: Token;
  buy: StrategyInputOrder;
  sell: StrategyInputOrder;
  simulationType: SimulatorType;
}

export const useStrategyInput = () => {
  const { getTokenById } = useTokens();
  const navigate = useNavigate();
  const search: SimulatorInputSearch = useSearch({ strict: false });
  const params = useParams({ from: '/simulator/$simulationType' });
  const [state, setState] = useState<StrategyInput>(search);

  const baseToken = getTokenById(state.baseToken);
  const quoteToken = getTokenById(state.quoteToken);

  const state2 = useMemo<StrategyInput2>(() => {
    return {
      simulationType: params.simulationType,
      baseToken,
      quoteToken,
      buy: {
        min: state.buyMin,
        max: state.buyMax,
        budget: state.buyBudget,
        budgetError: state.buyBudgetError,
        isRange: !!state.buyIsRange,
        priceError: state.buyPriceError,
      },
      sell: {
        min: state.sellMin,
        max: state.sellMax,
        budget: state.sellBudget,
        budgetError: state.sellBudgetError,
        isRange: !!state.sellIsRange,
        priceError: state.sellPriceError,
      },
    };
  }, [
    baseToken,
    params.simulationType,
    quoteToken,
    state.buyBudgetError,
    state.buyBudget,
    state.buyIsRange,
    state.buyMax,
    state.buyMin,
    state.sellBudgetError,
    state.sellBudget,
    state.sellIsRange,
    state.sellMax,
    state.sellMin,
    state.buyPriceError,
    state.sellPriceError,
  ]);

  const setSearch = (search: StrategyInput) => {
    const {
      buyBudgetError,
      sellBudgetError,
      buyPriceError,
      sellPriceError,
      ...newSearch
    } = search;

    void navigate({
      search: newSearch,
      params: {},
      replace: true,
      resetScroll: false,
    });
  };

  useDebouncedValue(state, 300, { cb: setSearch });

  const dispatch: StrategyInputDispatch = useCallback((key, value) => {
    setState((state) => ({ ...state, [key]: value }));
  }, []);

  return { state, dispatch, state2 };
};
