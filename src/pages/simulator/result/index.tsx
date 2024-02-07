import { Link } from '@tanstack/react-router';
import { SimulatorResultChart } from 'components/simulator/result/SimulatorResultChart';
import { SimulatorSummary } from 'components/simulator/SimulatorSummary';
import { useStrategyInput } from 'hooks/useStrategyInput';
import { useSimulator } from 'libs/d3/sim/SimulatorProvider';
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
          <SimulatorSummary
            roi={ctx.roi}
            gains={ctx.gains}
            state={state}
            strategyType={simulationType}
            isLoading={ctx.isLoading}
          />

          <SimulatorResultChart state={state} simulationType={simulationType} />
        </>
      </div>
    </div>
  );
};
