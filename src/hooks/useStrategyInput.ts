/* eslint-disable unused-imports/no-unused-vars */
import { useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useToken } from 'hooks/useTokens';
import { StrategyInputSearch } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useState } from 'react';

export interface InternalStrategyInput extends StrategyInputSearch {
  sellBudgetError?: string;
  buyBudgetError?: string;
}

export type StrategyInputDispatch = <
  T extends InternalStrategyInput,
  K extends keyof T,
>(
  key: K,
  value: T[K],
) => void;

export interface StrategyInputOrder {
  min: string;
  max: string;
  budget: string;
  budgetError?: string;
  isRange: boolean;
}

export interface StrategyInputValues {
  baseToken?: Token;
  quoteToken?: Token;
  buy: StrategyInputOrder;
  sell: StrategyInputOrder;
  start?: string;
  end?: string;
  overlappingSpread?: string;
}

interface Props {
  searchState: StrategyInputSearch;
}

export const useStrategyInput = ({ searchState }: Props) => {
  const navigate = useNavigate({ from: '/simulate/recurring' });
  const [_state, setState] = useState<InternalStrategyInput>(searchState);

  const baseToken = useToken(_state.baseToken);
  const quoteToken = useToken(_state.quoteToken);

  const state = buildStrategyInputState(_state, baseToken, quoteToken);

  const setSearch = useCallback(
    (search: InternalStrategyInput) => {
      const { buyBudgetError, sellBudgetError, ...newSearch } = search;

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

  const dispatch: StrategyInputDispatch = useCallback((key, value) => {
    setState((state) => ({ ...state, [key]: value }));
  }, []);

  return { dispatch, state };
};

function isInternalState(object: any): object is InternalStrategyInput {
  return 'buyBudgetError' in object;
}

export const buildStrategyInputState = (
  state: InternalStrategyInput | StrategyInputSearch,
  baseToken?: Token,
  quoteToken?: Token,
): StrategyInputValues => {
  if (isInternalState(state)) {
    return {
      baseToken,
      quoteToken,
      buy: {
        min: state.buyMin || '',
        max: state.buyMax || '',
        budget: state.buyBudget || '',
        budgetError: state.buyBudgetError,
        isRange: !!state.buyIsRange,
      },
      sell: {
        min: state.sellMin || '',
        max: state.sellMax || '',
        budget: state.sellBudget || '',
        budgetError: state.sellBudgetError,
        isRange: !!state.sellIsRange,
      },
      start: state.start || undefined,
      end: state.end || undefined,
    };
  } else {
    return {
      baseToken,
      quoteToken,
      buy: {
        min: state.buyMin || '',
        max: state.buyMax || '',
        budget: state.buyBudget || '',
        budgetError: '',
        isRange: !!state.buyIsRange,
      },
      sell: {
        min: state.sellMin || '',
        max: state.sellMax || '',
        budget: state.sellBudget || '',
        budgetError: '',
        isRange: !!state.sellIsRange,
      },
      start: state.start || undefined,
      end: state.end || undefined,
    };
  }
};
