import { useNavigate } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { SimInputRecurring } from 'components/simulator/input/SimInputRecurring';
import { useSimulatorInput } from 'hooks/useSimulatorInput';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { StrategyDirection } from 'libs/routing';
import { simulatorInputRecurringRoute } from 'libs/routing/routes/sim';
import { SafeDecimal } from 'libs/safedecimal';
import { defaultEnd, defaultStart } from 'components/strategies/common/utils';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SimInputTokenSelection } from 'components/simulator/input/SimInputTokenSelection';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';

export const SimulatorInputRecurringPage = () => {
  const searchState = simulatorInputRecurringRoute.useSearch();

  const { dispatch, state, bounds } = useSimulatorInput({
    searchState,
  });

  const [initBuyRange, setInitBuyRange] = useState(true);
  const [initSellRange, setInitSellRange] = useState(true);
  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: searchState.baseToken,
    quoteToken: searchState.quoteToken,
    start: defaultStart().toString(),
    end: defaultEnd().toString(),
  });
  const { marketPrice, isPending: marketPricePending } = useMarketPrice({
    base: state.baseToken,
    quote: state.quoteToken,
  });

  const handleDefaultValues = useCallback(
    (type: StrategyDirection) => {
      const init = type === 'buy' ? initBuyRange : initSellRange;
      const setInit = type === 'buy' ? setInitBuyRange : setInitSellRange;

      if (!init) return;
      setInit(false);

      if (!marketPrice) {
        dispatch(`${type}Max`, '');
        dispatch(`${type}Min`, '');
        return;
      }

      if (!(!state[type].max && !state[type].min)) {
        return;
      }

      const operation = type === 'buy' ? 'minus' : 'plus';

      const multiplierMax = type === 'buy' ? 0.1 : 0.2;
      const multiplierMin = type === 'buy' ? 0.2 : 0.1;

      const max = new SafeDecimal(marketPrice)
        [operation](marketPrice * multiplierMax)
        .toFixed();

      const min = new SafeDecimal(marketPrice)
        [operation](marketPrice * multiplierMin)
        .toFixed();

      if (state[type].isRange) {
        dispatch(`${type}Max`, max);
        dispatch(`${type}Min`, min);
      } else {
        const value = type === 'buy' ? max : min;
        dispatch(`${type}Max`, value);
        dispatch(`${type}Min`, value);
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
    ]
  );

  useEffect(() => {
    if (!marketPricePending) {
      handleDefaultValues('buy');
      handleDefaultValues('sell');
    }
  }, [handleDefaultValues, marketPricePending]);

  useEffect(() => {
    if (initBuyRange || initSellRange) return;
    dispatch('baseToken', searchState.baseToken);
    dispatch('quoteToken', searchState.quoteToken);
    dispatch('sellMax', '');
    dispatch('sellMin', '');
    dispatch('sellBudget', '');
    dispatch('sellBudgetError', '');
    dispatch('sellPriceError', '');
    dispatch('sellIsRange', true);
    dispatch('buyMax', '');
    dispatch('buyMin', '');
    dispatch('buyBudget', '');
    dispatch('buyBudgetError', '');
    dispatch('buyPriceError', '');
    dispatch('buyIsRange', true);
    setInitBuyRange(true);
    setInitSellRange(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchState.baseToken, searchState.quoteToken]);

  const noBudget = Number(state.buy.budget) + Number(state.sell.budget) <= 0;
  const noBudgetText =
    !isError && noBudget && 'Please add Sell and/or Buy budgets';
  const loadingText = isPending && 'Loading price history...';
  const priceError = state.buy.priceError || state.sell.priceError;
  const btnDisabled = isPending || isError || noBudget || !!priceError;

  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending || isError || noBudget) return;
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

  return (
    <>
      <form
        onSubmit={submit}
        className="grid"
        data-testid="create-simulation-form"
      >
        <SimInputTokenSelection
          baseToken={searchState.baseToken}
          quoteToken={searchState.quoteToken}
          noPriceHistory={isError}
        />
        <SimInputStrategyType />
        <SimInputRecurring
          state={state}
          dispatch={dispatch}
          firstHistoricPricePoint={data?.[0]}
        />
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
        isError={isError}
        simulationType="recurring"
      />
    </>
  );
};
