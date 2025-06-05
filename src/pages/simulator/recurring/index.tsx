import { useNavigate } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { SimInputRecurring } from 'components/simulator/input/SimInputRecurring';
import { useSimulatorInput } from 'hooks/useSimulatorInput';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { StrategyDirection } from 'libs/routing';
import { simulatorInputRecurringRoute } from 'libs/routing/routes/sim';
import { SafeDecimal } from 'libs/safedecimal';
import {
  defaultEnd,
  defaultStart,
  oneYearAgo,
} from 'components/strategies/common/utils';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SimInputTokenSelection } from 'components/simulator/input/SimInputTokenSelection';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { cn } from 'utils/helpers';
import { getRecurringPriceMultiplier } from 'components/strategies/create/utils';
import { isEmptyHistory } from 'components/strategies/common/d3Chart/utils';
import style from 'components/strategies/common/form.module.css';

export const SimulatorInputRecurringPage = () => {
  const searchState = simulatorInputRecurringRoute.useSearch();

  const { dispatch, state, bounds } = useSimulatorInput({
    searchState,
  });

  const [initBuyRange, setInitBuyRange] = useState(true);
  const [initSellRange, setInitSellRange] = useState(true);
  const { data, isPending } = useGetTokenPriceHistory({
    baseToken: searchState.baseToken,
    quoteToken: searchState.quoteToken,
    start: oneYearAgo(),
    end: defaultEnd(),
  });
  const { marketPrice, isPending: marketPricePending } = useMarketPrice({
    base: state.baseToken,
    quote: state.quoteToken,
  });

  const handleDefaultValues = useCallback(
    (direction: StrategyDirection, startPrice: number) => {
      const init = direction === 'buy' ? initBuyRange : initSellRange;
      const setInit = direction === 'buy' ? setInitBuyRange : setInitSellRange;

      if (!init) return;
      setInit(false);

      if (state[direction].max || state[direction].min) {
        return;
      }
      const multiplier = getRecurringPriceMultiplier(direction, 'range');
      const price = new SafeDecimal(startPrice);
      const min = price.mul(multiplier.min).toFixed();
      const max = price.mul(multiplier.max).toFixed();

      if (state[direction].isRange) {
        dispatch(`${direction}Max`, max);
        dispatch(`${direction}Min`, min);
      } else {
        const value = direction === 'buy' ? max : min;
        dispatch(`${direction}Max`, value);
        dispatch(`${direction}Min`, value);
      }
    },
    [
      dispatch,
      initBuyRange,
      initSellRange,
      marketPrice,
      setInitBuyRange,
      setInitSellRange,
      state,
    ],
  );

  useEffect(() => {
    const startDate = Number(searchState.start || defaultStart());
    const startPrice = data?.find(({ date }) => date === startDate)?.open;
    if (startPrice) {
      handleDefaultValues('buy', startPrice);
      handleDefaultValues('sell', startPrice);
    }
  }, [handleDefaultValues, data]);

  useEffect(() => {
    if (initBuyRange || initSellRange) return;
    dispatch('baseToken', searchState.baseToken);
    dispatch('quoteToken', searchState.quoteToken);
    dispatch('sellMax', '');
    dispatch('sellMin', '');
    dispatch('sellBudget', '');
    dispatch('sellBudgetError', '');
    dispatch('sellIsRange', true);
    dispatch('buyMax', '');
    dispatch('buyMin', '');
    dispatch('buyBudget', '');
    dispatch('buyBudgetError', '');
    dispatch('buyIsRange', true);
    setInitBuyRange(true);
    setInitSellRange(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchState.baseToken, searchState.quoteToken]);

  const emptyHistory = useMemo(() => isEmptyHistory(data), [data]);
  const noBudget = Number(state.buy.budget) + Number(state.sell.budget) <= 0;
  const noBudgetText =
    !emptyHistory && noBudget && 'Please add Sell and/or Buy budgets';
  const loadingText = isPending && 'Loading price history...';
  const btnDisabled = isPending || emptyHistory || noBudget;

  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (btnDisabled) return;
    if (e.currentTarget.querySelector('.error-message')) return;
    const start = state.start ?? defaultStart();
    const end = state.end ?? defaultEnd();

    navigate({
      to: '/simulate/result',
      search: {
        baseToken: state.baseToken?.address || '',
        quoteToken: state.quoteToken?.address || '',
        buyMin: state.buy.min,
        buyMax: state.buy.max,
        buyBudget: state.buy.budget,
        buyIsRange: state.buy.isRange,
        sellMin: state.sell.min,
        sellMax: state.sell.max,
        sellBudget: state.sell.budget,
        sellIsRange: state.sell.isRange,
        start: start.toString(),
        end: end.toString(),
        type: 'recurring',
      },
    });
  };

  const startPrice = useMemo(() => {
    const start = Number(state.start ?? defaultStart());
    return data?.find((v) => v.date === start);
  }, [data, state.start]);

  return (
    <>
      <form
        onSubmit={submit}
        className={cn(style.form, 'grid gap-16')}
        data-testid="create-simulation-form"
      >
        <div className="bg-background-900 rounded">
          <SimInputTokenSelection
            baseToken={searchState.baseToken}
            quoteToken={searchState.quoteToken}
            noPriceHistory={emptyHistory}
          />
          <SimInputStrategyType />
          <SimInputRecurring
            state={state}
            dispatch={dispatch}
            startPrice={startPrice}
          />
        </div>
        <input className="approve-warnings hidden" defaultChecked />
        <Button
          type="submit"
          data-testid="start-simulation-btn"
          variant="success"
          fullWidth
          size="lg"
          disabled={btnDisabled}
          className="mt-16"
        >
          {loadingText || noBudgetText || 'Start Simulation'}
        </Button>
      </form>
      <SimInputChart
        state={state}
        dispatch={dispatch}
        isLimit={{ buy: !state.buy.isRange, sell: !state.sell.isRange }}
        bounds={bounds}
        data={data}
        isPending={isPending}
        isError={emptyHistory}
        simulationType="recurring"
      />
    </>
  );
};
