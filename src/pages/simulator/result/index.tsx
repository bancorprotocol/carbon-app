import { Link } from '@tanstack/react-router';
import { SimResultChart } from 'components/simulator/result/SimResultChart';
import { SimResultSummary } from 'components/simulator/result/SimResultSummary';
import { useSimulator } from 'components/simulator/result/SimulatorProvider';
import { useCallback, useEffect } from 'react';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { wait } from 'utils/helpers';
import { THREE_SECONDS_IN_MS } from 'utils/time';

export const SimulatorResultPage = () => {
  const { status, isSuccess, start, ...ctx } = useSimulator();
  const simulationType = ctx.search.type;

  const handleAnimationStart = useCallback(() => {
    if (!isSuccess || ['running', 'ended', 'paused'].includes(status)) {
      return;
    }

    wait(THREE_SECONDS_IN_MS).then(() => {
      start();
    });
  }, [isSuccess, status, start]);

  useEffect(() => {
    handleAnimationStart();
  }, [handleAnimationStart]);

  return (
    <div className="p-20">
      {simulationType === 'recurring' && (
        <Link
          to="/simulate/recurring"
          search={{
            baseToken: ctx.search.baseToken,
            quoteToken: ctx.search.quoteToken,
            start: ctx.search.start,
            end: ctx.search.end,
            buyMin: ctx.search.buyMin,
            buyMax: ctx.search.buyMax,
            buyBudget: ctx.search.buyBudget,
            sellMin: ctx.search.sellMin,
            sellMax: ctx.search.sellMax,
            sellBudget: ctx.search.sellBudget,
            buyIsRange: ctx.search.buyIsRange,
            sellIsRange: ctx.search.sellIsRange,
          }}
          className="text-24 font-weight-500 mb-16 flex items-center"
        >
          <div className="bg-background-800 mr-16 flex size-40 items-center justify-center rounded-full">
            <IconChevronLeft className="size-16" />
          </div>
          Simulate Strategy
        </Link>
      )}
      {simulationType === 'overlapping' && (
        <Link
          to="/simulate/overlapping"
          search={{
            baseToken: ctx.search.baseToken,
            quoteToken: ctx.search.quoteToken,
            start: ctx.search.start,
            end: ctx.search.end,
            buyMin: ctx.search.buyMin,
            sellMax: ctx.search.sellMax,
            spread: ctx.search.spread,
          }}
          className="text-24 font-weight-500 mb-16 flex items-center"
        >
          <div className="bg-background-800 mr-16 flex size-40 items-center justify-center rounded-full">
            <IconChevronLeft className="size-16" />
          </div>
          Simulate Strategy
        </Link>
      )}

      <div className="rounded-20 bg-background-900 p-20">
        <SimResultSummary
          roi={ctx.roi}
          gains={ctx.gains}
          state={ctx.state}
          strategyType={simulationType}
          isLoading={ctx.isLoading}
        />

        <SimResultChart state={ctx.state} simulationType={simulationType} />
      </div>
    </div>
  );
};
