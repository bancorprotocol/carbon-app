import { useNavigate } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { SimInputOverlapping } from 'components/simulator/input/SimInputOverlapping';
import { useSimulatorInput } from 'hooks/useSimulatorInput';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { simulatorInputOverlappingRoute } from 'libs/routing/routes/sim';
import { defaultEnd, defaultStart } from 'pages/simulator/index';
import { FormEvent } from 'react';

export const SimulatorInputOverlappingPage = () => {
  const searchState = simulatorInputOverlappingRoute.useSearch();

  const { dispatch, state, bounds } = useSimulatorInput({
    searchState,
  });

  const { data, isLoading, isError } = useGetTokenPriceHistory({
    baseToken: searchState.baseToken,
    quoteToken: searchState.quoteToken,
    start: searchState.start,
    end: searchState.end,
  });

  const noBudget = Number(state.buy.budget) + Number(state.sell.budget) <= 0;
  const noBudgetText =
    !isError && noBudget && 'Please add Sell and/or Buy budgets';
  const loadingText = isLoading && 'Loading price history...';
  const priceError = state.buy.priceError || state.sell.priceError;
  const btnDisabled = isLoading || isError || noBudget || !!priceError;

  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || isError || noBudget) return;
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
        type: 'overlapping',
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
        <SimInputOverlapping
          state={state}
          dispatch={dispatch}
          marketPrice={data?.[0].open ?? 0}
        />
        <Button type="submit" fullWidth size="lg" disabled={btnDisabled}>
          {loadingText || noBudgetText || 'Start Simulation'}
        </Button>
      </form>

      <SimInputChart
        state={state}
        dispatch={dispatch}
        bounds={bounds}
        data={data}
        isLoading={isLoading}
        isError={isError}
        simulationType={'overlapping'}
      />
    </>
  );
};
