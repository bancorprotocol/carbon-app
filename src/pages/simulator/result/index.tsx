import { Link } from '@tanstack/react-router';
import { SimResultChart } from 'components/simulator/result/SimResultChart';
import { SimResultSummary } from 'components/simulator/result/SimResultSummary';
import { useStrategyInput } from 'hooks/useStrategyInput';
import { useSimulator } from 'components/simulator/result/SimulatorProvider';
import { useSearch } from 'libs/routing';
import { useEffect } from 'react';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { wait } from 'utils/helpers';

export const SimulatorResultPage = () => {
  const ctx = useSimulator();
  const searchState = useSearch({ from: '/simulator/result' });
  const { state } = useStrategyInput({ searchState });
  const simulationType = 'recurring';

  useEffect(() => {
    if (!ctx.isSuccess || ctx.status === 'running' || ctx.status === 'ended') {
      return;
    }

    wait(3000).then(() => {
      ctx.start();
    });
  }, [ctx]);

  return (
    <div className="p-20">
      <Link
        to={'/simulator/$simulationType'}
        params={{ simulationType }}
        search={searchState}
        className="mb-16 flex items-center text-24 font-weight-500"
      >
        <div className="mr-16 flex h-40 w-40 items-center justify-center rounded-full bg-emphasis">
          <IconChevronLeft className="h-16 w-16" />
        </div>
        Simulate Strategy
      </Link>

      <div className="rounded-20 bg-silver p-20">
        <>
          <SimResultSummary
            roi={ctx.roi}
            gains={ctx.gains}
            state={state}
            strategyType={simulationType}
            isLoading={ctx.isLoading}
          />

          <SimResultChart state={state} simulationType={simulationType} />
        </>
      </div>
    </div>
  );
};
