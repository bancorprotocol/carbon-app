import { Link } from '@tanstack/react-router';
import { SimResultChart } from 'components/simulator/result/SimResultChart';
import { SimResultSummary } from 'components/simulator/result/SimResultSummary';
import { useSimulator } from 'components/simulator/result/SimulatorProvider';
import { useCallback, useEffect } from 'react';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { wait } from 'utils/helpers';
import { THREE_SECONDS_IN_MS } from 'utils/time';

export const SimulatorResultPage = () => {
  const ctx = useSimulator();
  const simulationType = 'recurring';

  const handleAnimationStart = useCallback(() => {
    if (!ctx.isSuccess || ctx.status === 'running' || ctx.status === 'ended') {
      return;
    }

    wait(THREE_SECONDS_IN_MS).then(() => {
      ctx.start();
    });
  }, [ctx]);

  useEffect(() => {
    handleAnimationStart();
  }, [handleAnimationStart]);

  return (
    <div className="p-20">
      <Link
        to={'/simulate/$simulationType'}
        params={{ simulationType }}
        search={ctx.search}
        className="mb-16 flex items-center text-24 font-weight-500"
      >
        <div className="mr-16 flex h-40 w-40 items-center justify-center rounded-full bg-emphasis">
          <IconChevronLeft className="h-16 w-16" />
        </div>
        Simulate Strategy
      </Link>

      <div className="rounded-20 bg-silver p-20">
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
