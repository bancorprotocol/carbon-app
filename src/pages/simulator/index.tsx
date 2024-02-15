import { Link, useParams, useSearch } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { SimInputChart } from 'components/simulator/input/SimInputChart';
import { SimInputOverlapping } from 'components/simulator/input/SimInputOverlapping';
import { SimInputRecurring } from 'components/simulator/input/SimInputRecurring';
import { SimInputStrategyType } from 'components/simulator/input/SimInputStrategyType';
import { SimInputTokenSelection } from 'components/simulator/input/SimInputTokenSelection';
import dayjs from 'dayjs';
import { useSimulatorInput } from 'hooks/useSimulatorInput';
import { useEffect, useRef, useState } from 'react';
import { useModal } from 'hooks/useModal';
import { useStore } from 'store';
import { cn } from 'utils/helpers';

export const SimulatorPage = () => {
  const { simDisclaimerLastSeen, setSimDisclaimerLastSeen } = useStore();
  const [timeRange] = useState({
    start: dayjs().unix() - 60 * 60 * 24 * 30 * 12,
    end: dayjs().unix(),
  });

  const { simulationType } = useParams({ from: '/simulator/$simulationType' });
  const searchState = useSearch({
    from: '/simulator/$simulationType',
  });
  const { dispatch, state, bounds } = useSimulatorInput({ searchState });

  const [initBuyRange, setInitBuyRange] = useState(true);
  const [initSellRange, setInitSellRange] = useState(true);

  const { openModal } = useModal();
  const hasOpenedDisclaimer = useRef(false);

  const inputError =
    Number(state.buy.budget) + Number(state.sell.budget) <= 0
      ? 'Please add Sell and/or Buy budgets'
      : null;

  useEffect(() => {
    if (
      !!simDisclaimerLastSeen &&
      simDisclaimerLastSeen > dayjs().unix() - 15 * 60 * 1000
    ) {
      return;
    }
    if (!hasOpenedDisclaimer.current) {
      openModal('simulatorDisclaimer', {
        onConfirm: () => setSimDisclaimerLastSeen(dayjs().unix()),
      });
      hasOpenedDisclaimer.current = true;
    }
  }, [openModal, setSimDisclaimerLastSeen, simDisclaimerLastSeen]);

  return (
    <>
      <h1 className="mb-16 px-20 text-24 font-weight-500">Simulate Strategy</h1>

      <div className="flex gap-20 px-20">
        <div className="flex w-[440px] flex-col gap-20">
          <SimInputTokenSelection
            base={state.baseToken}
            quote={state.quoteToken}
            dispatch={dispatch}
            setInitBuyRange={setInitBuyRange}
            setInitSellRange={setInitSellRange}
          />
          <SimInputStrategyType strategyType={simulationType} />

          {simulationType === 'recurring' ? (
            <SimInputRecurring state={state} dispatch={dispatch} />
          ) : (
            <SimInputOverlapping />
          )}

          {simulationType === 'recurring' && (
            <Link
              to={'/simulator/result'}
              disabled={!!inputError}
              search={{
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
                start: timeRange.start.toString(),
                end: timeRange.end.toString(),
              }}
              className={cn(
                buttonStyles({
                  fullWidth: true,
                  size: 'lg',
                }),
                { 'cursor-not-allowed opacity-40': !!inputError }
              )}
            >
              {inputError ?? 'Start Simulation'}
            </Link>
          )}
        </div>

        <SimInputChart
          timeRange={timeRange}
          state={state}
          dispatch={dispatch}
          initBuyRange={initBuyRange}
          initSellRange={initSellRange}
          setInitBuyRange={setInitBuyRange}
          setInitSellRange={setInitSellRange}
          bounds={bounds}
        />
      </div>
    </>
  );
};
