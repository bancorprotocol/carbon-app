import { Link } from '@tanstack/react-router';
import { SimulatorMobilePlaceholder } from 'components/simulator/mobile-placeholder';
import { SimResultChart } from 'components/simulator/result/SimResultChart';
import { SimResultSummary } from 'components/simulator/result/SimResultSummary';
import { useSimulator } from 'components/simulator/result/SimulatorProvider';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useCallback, useEffect } from 'react';
import { wait } from 'utils/helpers';
import { THREE_SECONDS_IN_MS } from 'utils/time';
import { BackIcon, backStyle } from 'components/common/BackButton';

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

  const { aboveBreakpoint } = useBreakpoints();

  if (!aboveBreakpoint('md')) return <SimulatorMobilePlaceholder />;

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-16 p-20">
      {simulationType === 'recurring' && (
        <header className="flex items-center gap-16">
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
            className={backStyle}
          >
            <BackIcon />
          </Link>
          <h1 className="text-24">Simulate</h1>
        </header>
      )}
      {simulationType === 'overlapping' && (
        <header className="flex items-center gap-16">
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
            className={backStyle}
          >
            <BackIcon />
          </Link>
          Simulate
        </header>
      )}

      <div className="rounded-20 bg-background-900 p-20">
        <SimResultSummary
          roi={ctx.roi}
          gains={ctx.gains}
          state={ctx.state}
          strategyType={simulationType}
          isPending={ctx.isPending}
        />

        <SimResultChart state={ctx.state} simulationType={simulationType} />
      </div>
    </div>
  );
};
