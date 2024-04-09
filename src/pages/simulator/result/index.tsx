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
  const simulationType = 'recurring';

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
      <Link
        to={'/simulate/$simulationType'}
        params={{ simulationType }}
        search={ctx.search}
        className="text-24 font-weight-500 mb-16 flex items-center"
      >
        <div className="bg-background-800 size-40 mr-16 flex items-center justify-center rounded-full">
          <IconChevronLeft className="size-16" />
        </div>
        Simulate Strategy
      </Link>

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
