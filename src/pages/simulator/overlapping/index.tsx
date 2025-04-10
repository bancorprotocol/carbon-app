import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { useNavigate } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { CreateOverlappingStrategy } from 'components/simulator/input/overlapping/CreateOverlappingStrategy';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { useSimulatorOverlappingInput } from 'hooks/useSimulatorOverlappingInput';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { simulatorInputOverlappingRoute } from 'libs/routing/routes/sim';
import {
  defaultEnd,
  defaultStart,
  oneYearAgo,
} from 'components/strategies/common/utils';
import { FormEvent, useEffect } from 'react';
import { cn } from 'utils/helpers';
import { SimInputTokenSelection } from 'components/simulator/input/SimInputTokenSelection';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { useMarketPrice } from 'hooks/useMarketPrice';
import style from 'components/strategies/common/form.module.css';
import { defaultSpread } from 'components/strategies/overlapping/utils';

export const SimulatorInputOverlappingPage = () => {
  const searchState = simulatorInputOverlappingRoute.useSearch();

  const { dispatch, state, bounds } = useSimulatorOverlappingInput({
    searchState,
  });

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: searchState.baseToken,
    quoteToken: searchState.quoteToken,
    start: oneYearAgo(),
    end: defaultEnd(),
  });

  const { marketPrice, isPending: marketPricePending } = useMarketPrice({
    base: state.baseToken,
    quote: state.quoteToken,
  });

  useEffect(() => {
    if (searchState.sellMax || searchState.buyMin) return;
    dispatch('baseToken', searchState.baseToken);
    dispatch('quoteToken', searchState.quoteToken);
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
    searchState.baseToken,
    searchState.quoteToken,
    searchState.sellMax,
    searchState.buyMin,
  ]);

  const noBudget = Number(state.buy.budget) + Number(state.sell.budget) <= 0;
  const noBudgetText =
    !isError && noBudget && 'Please add Sell and/or Buy budgets';
  const loadingText = isPending && 'Loading price history...';
  const btnDisabled = isPending || isError || noBudget || marketPricePending;

  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (btnDisabled) return;
    if (!state.baseToken || !state.quoteToken || !marketPrice) return;
    if (!!e.currentTarget.querySelector('.error-message')) return;
    const start = state.start ?? defaultStart();
    const end = state.end ?? defaultEnd();

    const prices = calculateOverlappingPrices(
      state.buy.min,
      state.sell.max,
      marketPrice.toString(),
      state.spread
    );

    const search = {
      baseToken: state.baseToken.address,
      quoteToken: state.quoteToken.address,
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
      start: start.toString(),
      end: end.toString(),
      type: 'overlapping' as const,
      spread: state.spread,
    };

    if (search.buyBudget) {
      search.sellBudget = calculateOverlappingSellBudget(
        state.baseToken.decimals,
        state.quoteToken.decimals,
        state.buy.min,
        state.sell.max,
        marketPrice!.toString(),
        state.spread,
        search.buyBudget
      );
    } else {
      search.buyBudget = calculateOverlappingBuyBudget(
        state.baseToken.decimals,
        state.quoteToken.decimals,
        state.buy.min,
        state.sell.max,
        marketPrice!.toString(),
        state.spread,
        search.sellBudget
      );
    }

    navigate({ to: '/simulate/result', search });
  };

  return (
    <>
      <form
        onSubmit={submit}
        className={cn(style.form, 'grid gap-16')}
        data-testid="create-simulation-form"
      >
        <div className="bg-background-900 grid rounded">
          <SimInputTokenSelection
            baseToken={searchState.baseToken}
            quoteToken={searchState.quoteToken}
            noPriceHistory={isError}
          />
          <SimInputStrategyType />
          <CreateOverlappingStrategy
            state={state}
            dispatch={dispatch}
            marketPrice={marketPrice ?? 0}
            spread={state.spread}
            setSpread={(v) => dispatch('spread', v)}
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
