import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CreateOverlappingStrategy } from 'components/simulator/input/overlapping/CreateOverlappingStrategy';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { useSimulatorOverlappingInput } from 'hooks/useSimulatorOverlappingInput';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { FormEvent, useCallback, useEffect, useMemo } from 'react';
import { formatNumber } from 'utils/helpers';
import { D3ChartOverlapping } from 'components/strategies/common/d3Chart/overlapping/D3ChartOverlapping';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import {
  defaultEnd,
  defaultStart,
  oneYearAgo,
} from 'components/strategies/common/utils';
import { cn } from 'utils/helpers';
import { defaultSpread } from 'components/strategies/overlapping/utils';
import { isEmptyHistory } from 'components/strategies/common/d3Chart/utils';
import style from 'components/strategies/common/form.module.css';
import { useMarketPrice } from 'hooks/useMarketPrice';

export const SimulatorInputOverlappingPage = () => {
  const searchState = useSearch({ from: '/simulate/overlapping' });
  const { marketPrice } = useMarketPrice({
    base: searchState.base,
    quote: searchState.quote,
  });

  const { dispatch, state, bounds } = useSimulatorOverlappingInput({
    searchState,
  });

  const { data, isPending } = useGetTokenPriceHistory({
    baseToken: searchState.base,
    quoteToken: searchState.quote,
    start: oneYearAgo(),
    end: defaultEnd(),
  });

  useEffect(() => {
    if (searchState.sellMax || searchState.buyMin) return;
    dispatch('base', searchState.base);
    dispatch('quote', searchState.quote);
    dispatch('spread', defaultSpread);
    dispatch('buyMax', '');
    dispatch('buyMin', '');
    dispatch('sellMax', '');
    dispatch('sellMin', '');
    dispatch('sellBudget', '');
    dispatch('sellBudgetError', '');
    dispatch('buyBudget', '');
    dispatch('buyBudgetError', '');
  }, [
    dispatch,
    searchState.base,
    searchState.quote,
    searchState.sellMax,
    searchState.buyMin,
  ]);

  const emptyHistory = useMemo(() => isEmptyHistory(data), [data]);
  const noBudget = Number(state.buy.budget) + Number(state.sell.budget) <= 0;
  const noBudgetText =
    !emptyHistory && noBudget && 'Please add Sell and/or Buy budgets';
  const loadingText = isPending && 'Loading price history...';
  const btnDisabled = isPending || emptyHistory || noBudget;

  const navigate = useNavigate();

  const _sP_ = useMemo(() => {
    const start = Number(state.start ?? defaultStart());
    return data?.find(({ date }) => date === start)?.close;
  }, [data, state.start]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (btnDisabled) return;
    const start = state.start ?? defaultStart();
    const end = state.end ?? defaultEnd();

    if (!state.base || !state.quote || !_sP_) return;
    if (e.currentTarget.querySelector('.error-message')) return;

    const prices = calculateOverlappingPrices(
      state.buy.min,
      state.sell.max,
      _sP_.toString(),
      state.spread,
    );

    const search = {
      base: state.base.address,
      quote: state.quote.address,
      buyMin: prices.buyPriceLow,
      buyMax: prices.buyPriceHigh,
      buyBudget: state.buy.budget,
      buyMarginal: prices.buyPriceMarginal,
      buyIsRange: true,
      sellMin: prices.sellPriceLow,
      sellMax: prices.sellPriceHigh,
      sellBudget: state.sell.budget,
      sellMarginal: prices.sellPriceMarginal,
      sellIsRange: true,
      start: start,
      end: end,
      type: 'overlapping' as const,
      spread: state.spread,
    };

    if (search.buyBudget) {
      search.sellBudget = calculateOverlappingSellBudget(
        state.base.decimals,
        state.quote.decimals,
        state.buy.min,
        state.sell.max,
        _sP_.toString(),
        state.spread,
        search.buyBudget,
      );
    } else {
      search.buyBudget = calculateOverlappingBuyBudget(
        state.base.decimals,
        state.quote.decimals,
        state.buy.min,
        state.sell.max,
        _sP_.toString(),
        state.spread,
        search.sellBudget,
      );
    }

    navigate({ to: '/simulate/result', search });
  };

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      dispatch('buyMin', formatNumber(buy.min));
      dispatch('buyMax', formatNumber(buy.max));
      dispatch('sellMin', formatNumber(sell.min));
      dispatch('sellMax', formatNumber(sell.max));
    },
    [dispatch],
  );
  const prices = {
    buy: {
      min: state.buy.min,
      max: state.buy.max,
    },
    sell: {
      min: state.sell.min,
      max: state.sell.max,
    },
  };

  return (
    <>
      <SimInputChart
        state={state}
        dispatch={dispatch}
        bounds={bounds}
        data={data}
        isPending={isPending}
        isError={emptyHistory}
        prices={prices}
      >
        <D3ChartOverlapping
          base={state.base!}
          quote={state.quote!}
          prices={prices}
          onChange={onPriceUpdates}
          marketPrice={marketPrice ?? 0}
          spread={Number(state.spread)}
        />
      </SimInputChart>
      <form
        onSubmit={submit}
        className={cn(
          style.form,
          'grid gap-16 grid-area-[form] content-start animate-scale-up',
        )}
        data-testid="create-simulation-form"
      >
        <div className="surface grid content-start rounded-2xl">
          <CreateOverlappingStrategy
            state={state}
            dispatch={dispatch}
            marketPrice={_sP_ ?? 0}
            spread={state.spread}
            setSpread={(v) => dispatch('spread', v)}
          />
        </div>
        <input className="approve-warnings hidden" defaultChecked />
        <button
          type="submit"
          data-testid="start-simulation-btn"
          disabled={btnDisabled}
          className="btn-primary-gradient text-16 py-12"
        >
          {loadingText || noBudgetText || 'Start Simulation'}
        </button>
      </form>
    </>
  );
};
