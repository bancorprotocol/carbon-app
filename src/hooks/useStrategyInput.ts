import { useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useTokens } from 'hooks/useTokens';
import { StrategyInputSearch } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useMemo, useState } from 'react';
import { stringToBoolean } from 'utils/helpers';

export interface InternalStrategyInput extends StrategyInputSearch {
  sellBudgetError?: string;
  buyBudgetError?: string;
  buyPriceError?: string;
  sellPriceError?: string;
}

export type StrategyInputDispatch = <
  T extends InternalStrategyInput,
  K extends keyof T
>(
  key: K,
  value: T[K]
) => void;

export interface StrategyInputOrder {
  min: string;
  max: string;
  budget: string;
  budgetError?: string;
  priceError?: string;
  isRange: boolean;
}

export interface StrategyInputValues {
  baseToken?: Token;
  quoteToken?: Token;
  buy: StrategyInputOrder;
  sell: StrategyInputOrder;
}

interface Props {
  searchState: StrategyInputSearch;
}

export const useStrategyInput = ({ searchState }: Props) => {
  const { getTokenById } = useTokens();
  const navigate = useNavigate();
  const [_state, setState] = useState<InternalStrategyInput>({
    ...searchState,
    sellIsRange: stringToBoolean(String(searchState.sellIsRange), true),
    buyIsRange: stringToBoolean(String(searchState.buyIsRange), true),
  });

  const baseToken = useMemo(
    () => getTokenById(_state.baseToken),
    [_state.baseToken, getTokenById]
  );
  const quoteToken = useMemo(
    () => getTokenById(_state.quoteToken),
    [_state.quoteToken, getTokenById]
  );

  const state = useMemo<StrategyInputValues>(() => {
    return {
      baseToken,
      quoteToken,
      buy: {
        min: _state.buyMin || '',
        max: _state.buyMax || '',
        budget: _state.buyBudget || '',
        budgetError: _state.buyBudgetError,
        isRange: !!_state.buyIsRange,
        priceError: _state.buyPriceError,
      },
      sell: {
        min: _state.sellMin || '',
        max: _state.sellMax || '',
        budget: _state.sellBudget || '',
        budgetError: _state.sellBudgetError,
        isRange: !!_state.sellIsRange,
        priceError: _state.sellPriceError,
      },
    };
  }, [baseToken, quoteToken, _state]);

  const setSearch = useCallback(
    (search: InternalStrategyInput) => {
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
    },
    [navigate]
  );

  useDebouncedValue(_state, 300, { cb: setSearch });

  const dispatch: StrategyInputDispatch = useCallback((key, value) => {
    setState((state) => ({ ...state, [key]: value }));
  }, []);

  return { dispatch, state };
};
