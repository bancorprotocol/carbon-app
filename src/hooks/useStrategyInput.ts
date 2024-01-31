import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useTokens } from 'hooks/useTokens';
import { getDomain } from 'libs/d3/charts/candlestick/D3ChartCandlesticks';
import { useLinearScale } from 'libs/d3/useLinearScale';
import {
  useCompareTokenPrice,
  useGetTokenPriceHistory,
} from 'libs/queries/extApi/tokenPrice';
import { SimulatorInputSearch, SimulatorType } from 'libs/routing/routes/sim';
import { Token } from 'libs/tokens';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

export type ChartY = Pick<
  SimulatorInputSearch,
  'buyMin' | 'buyMax' | 'sellMin' | 'sellMax'
>;

export type StrategyInputDispatchY = <T extends ChartY, K extends keyof T>(
  key: K,
  value: T[K]
) => void;

const start = dayjs().unix() - 60 * 60 * 24 * 30 * 12;
const end = dayjs().unix();

export type UseStrategyInputReturn = ReturnType<typeof useStrategyInput>;

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

  const marketPrice = useCompareTokenPrice(
    state2.baseToken?.address,
    state2.quoteToken?.address
  );

  const priceHistoryQuery = useGetTokenPriceHistory({
    baseToken: state.baseToken,
    quoteToken: state.quoteToken,
    start,
    end,
  });

  // const [domain, setDomain] = useState(
  //   getDomain(priceHistoryQuery.data ?? [], state2, marketPrice)
  // );

  const [bounds, setBounds] = useState<ChartY>({
    buyMax: search.buyMax,
    buyMin: search.buyMin,
    sellMax: search.sellMax,
    sellMin: search.sellMin,
  });

  const y = useLinearScale({
    domain: getDomain(priceHistoryQuery.data ?? [], state2, marketPrice),
    range: [700, 0],
  });

  const [stateY, setStateChart] = useState<ChartY>({
    buyMax: '',
    buyMin: '',
    sellMax: '',
    sellMin: '',
  });

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

    switch (key) {
      case 'buyMax':
        setBounds((bounds) => ({ ...bounds, buyMax: value as string }));
        break;
      case 'buyMin':
        setBounds((bounds) => ({ ...bounds, buyMax: value as string }));
        break;
      case 'sellMax':
        setBounds((bounds) => ({ ...bounds, buyMax: value as string }));
        break;
      case 'sellMin':
        setBounds((bounds) => ({ ...bounds, buyMax: value as string }));
        break;
    }
    // setDomain(getDomain(priceHistoryQuery.data ?? [], state2, marketPrice));
  }, []);

  const dispatchY: StrategyInputDispatchY = useCallback((key, value) => {
    setStateChart((state) => ({ ...state, [key]: value }));
  }, []);

  const stateChartInverted = useMemo(() => {
    return {
      buyMax: y.scale.invert(Number(stateY.buyMax)),
      buyMin: y.scale.invert(Number(stateY.buyMin)),
      sellMax: y.scale.invert(Number(stateY.sellMax)),
      sellMin: y.scale.invert(Number(stateY.sellMin)),
    };
  }, [stateY, y]);

  const state2Inverted = useMemo(() => {
    return {
      buyMax: y.scale(Number(state.buyMax)),
      buyMin: y.scale(Number(state.buyMin)),
      sellMax: y.scale(Number(state.sellMax)),
      sellMin: y.scale(Number(state.sellMin)),
    };
  }, [state, y]);

  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current) {
      return;
    }
    setState((state) => ({
      ...state,
      buyMax: stateChartInverted.buyMax.toString(),
      buyMin: stateChartInverted.buyMin.toString(),
      sellMax: stateChartInverted.sellMax.toString(),
      sellMin: stateChartInverted.sellMin.toString(),
    }));
  }, [
    stateChartInverted.buyMax,
    stateChartInverted.buyMin,
    stateChartInverted.sellMax,
    stateChartInverted.sellMin,
  ]);

  return {
    state,
    dispatch,
    state2,
    stateChart: stateY,
    dispatchY,
    state2Inverted,
    y,
    stateChartInverted,
    isDragging,
  };
};
