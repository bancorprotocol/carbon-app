import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useTokens } from 'hooks/useTokens';
import { ChartPrices } from 'libs/d3/charts/candlestick/D3ChartCandlesticks';
import { SimulatorInputSearch, SimulatorType } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useMemo, useState } from 'react';

export type StrategyInputDispatch = <
  T extends StrategyInput,
  K extends keyof T
>(
  key: K,
  value: T[K],
  setBounds?: boolean
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
  start: number;
  end: number;
}

const start = dayjs().unix() - 60 * 60 * 24 * 30 * 12;
const end = dayjs().unix();

export const useStrategyInput = () => {
  const { getTokenById } = useTokens();
  const navigate = useNavigate();
  const search: SimulatorInputSearch = useSearch({ strict: false });
  const params = useParams({ from: '/simulator/$simulationType' });
  const [_state, setState] = useState<StrategyInput>(search);

  const [bounds, setBounds] = useState<ChartPrices>({
    buy: { min: search.buyMin, max: search.buyMax },
    sell: { min: search.sellMin, max: search.sellMax },
  });

  const baseToken = getTokenById(_state.baseToken);
  const quoteToken = getTokenById(_state.quoteToken);

  const state = useMemo<StrategyInput2>(() => {
    return {
      simulationType: params.simulationType,
      baseToken,
      quoteToken,
      buy: {
        min: _state.buyMin,
        max: _state.buyMax,
        budget: _state.buyBudget,
        budgetError: _state.buyBudgetError,
        isRange: !!_state.buyIsRange,
        priceError: _state.buyPriceError,
      },
      sell: {
        min: _state.sellMin,
        max: _state.sellMax,
        budget: _state.sellBudget,
        budgetError: _state.sellBudgetError,
        isRange: !!_state.sellIsRange,
        priceError: _state.sellPriceError,
      },
      start,
      end,
    };
  }, [baseToken, params.simulationType, quoteToken, _state]);

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

  useDebouncedValue(_state, 300, { cb: setSearch });

  const dispatch: StrategyInputDispatch = useCallback(
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

  return { dispatch, state, bounds };
};
