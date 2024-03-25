import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { SimInputOverlapping } from 'components/simulator/input/SimInputOverlapping';
import { SimInputRecurring } from 'components/simulator/input/SimInputRecurring';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { SimInputTokenSelection } from 'components/simulator/input/SimInputTokenSelection';
import { useSimDisclaimer } from 'components/simulator/input/useSimDisclaimer';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useSimulatorInput } from 'hooks/useSimulatorInput';
import { FormEvent, useCallback, useState } from 'react';
import { SimulatorMobilePlaceholder } from 'components/simulator/mobile-placeholder';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { Button } from 'components/common/button';
import { getUnixTime, subDays } from 'date-fns';

export const defaultStart = () => getUnixTime(subDays(new Date(), 364));
export const defaultEnd = () => getUnixTime(new Date());

export const SimulatorPage = () => {
  useSimDisclaimer();
  const { aboveBreakpoint } = useBreakpoints();

  const navigate = useNavigate();
  const { simulationType } = useParams({ from: '/simulate/$simulationType' });
  const searchState = useSearch({
    from: '/simulate/$simulationType',
  });

  const { dispatch, state, bounds } = useSimulatorInput({ searchState });
  const { data, isLoading, isError } = useGetTokenPriceHistory({
    baseToken: state.baseToken?.address,
    quoteToken: state.quoteToken?.address,
    start: state.start,
    end: state.end,
  });

  const [initBuyRange, setInitBuyRange] = useState(true);
  const [initSellRange, setInitSellRange] = useState(true);

  const onTypeChange = useCallback(() => {
    dispatch('buyMax', '');
    dispatch('buyMin', '');
    dispatch('sellMax', '');
    dispatch('sellMin', '');
    dispatch('buyBudget', '');
    dispatch('sellBudget', '');
    setInitBuyRange(true);
    setInitSellRange(true);
  }, [dispatch]);

  const noBudget = Number(state.buy.budget) + Number(state.sell.budget) <= 0;
  const noBudgetText =
    !isError && noBudget && 'Please add Sell and/or Buy budgets';
  const loadingText = isLoading && 'Loading price history...';
  const priceError = state.buy.priceError || state.sell.priceError;

  const btnDisabled = isLoading || isError || noBudget || !!priceError;
  if (!aboveBreakpoint('md')) return <SimulatorMobilePlaceholder />;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || isError || noBudget) return;
    const start = state.start ?? defaultStart();
    const end = state.end ?? defaultEnd();
    const { buyPriceMarginal, sellPriceMarginal } = calculateOverlappingPrices(
      state.buy.min,
      state.sell.max,
      data[0].open.toString(),
      state.overlappingSpread?.toString() ?? '0'
    );
    navigate({
      to: '/simulate/result',
      search: {
        baseToken: state.baseToken?.address || '',
        quoteToken: state.quoteToken?.address || '',
        buyMin: state.buy.min,
        buyMax: state.buy.max,
        buyBudget: state.buy.budget,
        buyIsRange: state.buy.isRange,
        buyMarginal:
          simulationType === 'overlapping' ? buyPriceMarginal : undefined,
        sellMin: state.sell.min,
        sellMax: state.sell.max,
        sellBudget: state.sell.budget,
        sellIsRange: state.sell.isRange,
        sellMarginal:
          simulationType === 'overlapping' ? sellPriceMarginal : undefined,
        start: start.toString(),
        end: end.toString(),
        overlappingSpread:
          simulationType === 'overlapping'
            ? state.overlappingSpread
            : undefined,
        type: simulationType,
      },
    });
  };

  return (
    <>
      <h1 className="mb-16 px-20 text-24 font-weight-500">Simulate Strategy</h1>

      <div className="flex gap-20 px-20">
        <form
          onSubmit={submit}
          className="flex w-[440px] flex-col gap-20"
          data-testid="create-simulation-form"
        >
          <SimInputTokenSelection
            base={state.baseToken}
            quote={state.quoteToken}
            dispatch={dispatch}
            setInitBuyRange={setInitBuyRange}
            setInitSellRange={setInitSellRange}
            noPriceHistory={isError}
          />
          {!isError && (
            <>
              <SimInputStrategyType
                strategyType={simulationType}
                onTypeChange={onTypeChange}
              />

              {simulationType === 'recurring' ? (
                <SimInputRecurring
                  state={state}
                  dispatch={dispatch}
                  firstHistoricPricePoint={data?.[0]}
                />
              ) : (
                <SimInputOverlapping
                  state={state}
                  dispatch={dispatch}
                  marketPrice={data?.[0].open ?? 0}
                />
              )}
            </>
          )}

          <Button type="submit" fullWidth size="lg" disabled={btnDisabled}>
            {loadingText || noBudgetText || 'Start Simulation'}
          </Button>
        </form>

        <SimInputChart
          state={state}
          dispatch={dispatch}
          initBuyRange={initBuyRange}
          initSellRange={initSellRange}
          setInitBuyRange={setInitBuyRange}
          setInitSellRange={setInitSellRange}
          bounds={bounds}
          data={data}
          isLoading={isLoading}
          isError={isError}
          simulationType={simulationType}
        />
      </div>
    </>
  );
};
