import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { useNavigate } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { CreateOverlappingStrategy } from 'components/simulator/input/overlapping/CreateOverlappingStrategy';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { useSimulatorOverlappingInput } from 'hooks/useSimulatorOverlappingInput';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { simulatorInputOverlappingRoute } from 'libs/routing/routes/sim';
import { defaultEnd, defaultStart } from 'components/strategies/common/utils';
import { FormEvent, useEffect } from 'react';
import { formatNumber, roundSearchParam } from 'utils/helpers';

export const SimulatorInputOverlappingPage = () => {
  const searchState = simulatorInputOverlappingRoute.useSearch();

  const { dispatch, state, bounds } = useSimulatorOverlappingInput({
    searchState,
  });

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: searchState.baseToken,
    quoteToken: searchState.quoteToken,
    start: defaultStart().toString(),
    end: defaultEnd().toString(),
  });

  useEffect(() => {
    if (searchState.sellMax || searchState.buyMin) return;
    dispatch('baseToken', searchState.baseToken);
    dispatch('quoteToken', searchState.quoteToken);
    dispatch('spread', '1');
    dispatch('buyMax', '', true);
    dispatch('buyMin', '', true);
    dispatch('sellMax', '', true);
    dispatch('sellMin', '', true);
    dispatch('sellBudget', '');
    dispatch('sellBudgetError', '');
    dispatch('sellPriceError', '');
    dispatch('buyBudget', '');
    dispatch('buyBudgetError', '');
    dispatch('buyPriceError', '');
  }, [
    dispatch,
    searchState.baseToken,
    searchState.quoteToken,
    searchState.sellMax,
    searchState.buyMin,
  ]);

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

    const { buyPriceMarginal, sellPriceMarginal } = calculateOverlappingPrices(
      formatNumber(state.buy.min),
      formatNumber(state.sell.max),
      data[0].open.toString(),
      state.spread
    );

    navigate({
      to: '/simulate/result',
      search: {
        baseToken: state.baseToken?.address || '',
        quoteToken: state.quoteToken?.address || '',
        buyMin: roundSearchParam(state.buy.min),
        buyMax: roundSearchParam(state.buy.max),
        buyBudget: roundSearchParam(state.buy.budget),
        buyMarginal: roundSearchParam(buyPriceMarginal),
        buyIsRange: true,
        sellMin: roundSearchParam(state.sell.min),
        sellMax: roundSearchParam(state.sell.max),
        sellBudget: roundSearchParam(state.sell.budget),
        sellMarginal: roundSearchParam(sellPriceMarginal),
        sellIsRange: true,
        start: start.toString(),
        end: end.toString(),
        type: 'overlapping',
        spread: state.spread,
      },
    });
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="flex flex-col gap-y-20"
        data-testid="create-simulation-form"
      >
        <CreateOverlappingStrategy
          state={state}
          dispatch={dispatch}
          marketPrice={data?.[0].open ?? 0}
          spread={state.spread}
          setSpread={(v) => dispatch('spread', v)}
        />
        <Button
          type="submit"
          data-testid="start-simulation-btn"
          variant="success"
          fullWidth
          size="lg"
          disabled={btnDisabled}
        >
          {loadingText || noBudgetText || 'Start Simulation'}
        </Button>
      </form>

      <SimInputChart
        state={state}
        dispatch={dispatch}
        bounds={bounds}
        data={data}
        isPending={isPending}
        isError={isError}
        spread={state.spread}
        simulationType="overlapping"
      />
    </>
  );
};
