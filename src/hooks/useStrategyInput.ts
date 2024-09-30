import { useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useTokens } from 'hooks/useTokens';
import { StrategyInputSearch } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useMemo, useState } from 'react';

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
  start?: string;
  end?: string;
  overlappingSpread?: string;
}

interface Props {
  searchState: StrategyInputSearch;
}

export const useStrategyInput = ({ searchState }: Props) => {
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/simulate/recurring' });
  const [_state, setState] = useState<InternalStrategyInput>(searchState);

  const baseToken = useMemo(
    () => getTokenById(_state.baseToken),
    [_state.baseToken, getTokenById]
  );
  const quoteToken = useMemo(
    () => getTokenById(_state.quoteToken),
    [_state.quoteToken, getTokenById]
  );

  const state = buildStrategyInputState(_state, baseToken, quoteToken);

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

function isInternalState(object: any): object is InternalStrategyInput {
  return 'buyBudgetError' in object;
}

export const buildStrategyInputState = (
  state: InternalStrategyInput | StrategyInputSearch,
  baseToken?: Token,
  quoteToken?: Token
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
        priceError: state.buyPriceError,
      },
      sell: {
        min: state.sellMin || '',
        max: state.sellMax || '',
        budget: state.sellBudget || '',
        budgetError: state.sellBudgetError,
        isRange: !!state.sellIsRange,
        priceError: state.sellPriceError,
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
        priceError: '',
      },
      sell: {
        min: state.sellMin || '',
        max: state.sellMax || '',
        budget: state.sellBudget || '',
        budgetError: '',
        isRange: !!state.sellIsRange,
        priceError: '',
      },
      start: state.start || undefined,
      end: state.end || undefined,
    };
  }
};
