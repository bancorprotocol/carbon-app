import { useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { StrategyInputOrder } from 'hooks/useStrategyInput';
import { ChartPrices } from 'components/strategies/common/d3Chart/D3ChartCandlesticks';
import { useTokens } from 'hooks/useTokens';
import { SimulatorInputOverlappingSearch } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useMemo, useState } from 'react';

export interface InternalSimulatorOverlappingInput
  extends SimulatorInputOverlappingSearch {
  buyMax?: string;
  sellMin?: string;
  buyBudget?: string;
  sellBudget?: string;
  sellBudgetError?: string;
  buyBudgetError?: string;
  buyPriceError?: string;
  sellPriceError?: string;
}

export type SimulatorOverlappingInputDispatch = <
  T extends InternalSimulatorOverlappingInput,
  K extends keyof T
>(
  key: K,
  value: T[K],
  setBounds?: boolean
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
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/simulate/overlapping' });
  const [_state, setState] =
    useState<InternalSimulatorOverlappingInput>(searchState);

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
    (search: InternalSimulatorOverlappingInput) => {
      const {
        buyMax,
        sellMin,
        buyBudget,
        sellBudget,
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

  const [bounds, setBounds] = useState<ChartPrices>({
    buy: { min: searchState.buyMin || '', max: '' },
    sell: { min: '', max: searchState.sellMax || '' },
  });

  const dispatch: SimulatorOverlappingInputDispatch = useCallback(
    (key, value, updateBounds = true) => {
      setState((state) => ({ ...state, [key]: value }));

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
    []
  );

  return { dispatch, state, bounds, searchState };
};

export const buildStrategyInputState = (
  state: InternalSimulatorOverlappingInput,
  baseToken?: Token,
  quoteToken?: Token
): SimulatorInputOverlappingValues => {
  return {
    baseToken,
    quoteToken,
    buy: {
      min: state.buyMin || '',
      max: state.buyMax || '',
      budget: state.buyBudget || '',
      budgetError: state.buyBudgetError,
      priceError: state.buyPriceError,
    },
    sell: {
      min: state.sellMin || '',
      max: state.sellMax || '',
      budget: state.sellBudget || '',
      budgetError: state.sellBudgetError,
      priceError: state.sellPriceError,
    },
    start: state.start || undefined,
    end: state.end || undefined,
    spread: state.spread || '',
  };
};
