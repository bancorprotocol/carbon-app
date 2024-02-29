import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { SimInputOverlapping } from 'components/simulator/input/SimInputOverlapping';
import { SimInputRecurring } from 'components/simulator/input/SimInputRecurring';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { SimInputTokenSelection } from 'components/simulator/input/SimInputTokenSelection';
import { useSimDisclaimer } from 'components/simulator/input/useSimDisclaimer';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useSimulatorInput } from 'hooks/useSimulatorInput';
import { FormEvent, useState } from 'react';
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
  const { simulationType } = useParams({ from: '/simulator/$simulationType' });
  const searchState = useSearch({
    from: '/simulator/$simulationType',
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

  const noBudget = Number(state.buy.budget) + Number(state.sell.budget) <= 0;
  const noBudgetText =
    !isError && noBudget && 'Please add Sell and/or Buy budgets';
  const loadingText = isLoading && 'Loading price history...';

  const btnDisabled = isLoading || isError || noBudget;
  if (!aboveBreakpoint('md')) return <SimulatorMobilePlaceholder />;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || isError || noBudget) return;
    const start = state.start ?? defaultStart();
    const end = state.end ?? defaultEnd();
    navigate({
      to: '/simulator/result',
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
              <SimInputStrategyType strategyType={simulationType} />
              {simulationType === 'recurring' ? (
                <SimInputRecurring
                  state={state}
                  dispatch={dispatch}
                  firstHistoricPricePoint={data?.[0]}
                />
              ) : (
                <SimInputOverlapping />
              )}
            </>
          )}
          {simulationType === 'recurring' && (
            <Button type="submit" fullWidth size="lg" disabled={btnDisabled}>
              {loadingText || noBudgetText || 'Start Simulation'}
            </Button>
          )}
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
        />
      </div>
    </>
  );
};
