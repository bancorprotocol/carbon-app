import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { SimResultChartAnimation } from 'components/simulator/result/SimResultChartAnimation';
import { SimResultChartSummary } from 'components/simulator/result/SimResultChartSummary';
import { SimResultChartHeader } from 'components/simulator/result/SimResultChartHeader';
import { useSimulator } from 'components/simulator/result/SimulatorProvider';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import { SimulatorType } from 'libs/routing/routes/sim';
import { useState } from 'react';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Link, useSearch } from '@tanstack/react-router';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { buttonStyles } from 'components/common/button/buttonStyles';

interface Props {
  state: StrategyInputValues;
  simulationType: SimulatorType;
}

export const SimResultChart = ({ state, simulationType }: Props) => {
  const ctx = useSimulator();
  const [showSummary, setShowSummary] = useState(false);
  const searchState = useSearch({ from: '/simulator/result' });

  if (ctx.isError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-10 bg-black py-10">
        <section
          role="alert"
          aria-live="polite"
          className="my-40 mx-auto flex w-[480px] flex-col items-center gap-20"
        >
          <IconTitleText
            icon={<IconWarning />}
            title="Missing Information"
            text="
          It appears that the simulation is missing essential information for
          successful execution. Please attempt to re-enter the simulation data."
            variant="error"
          />
          <Link
            to="/simulator/$simulationType"
            params={{ simulationType }}
            search={searchState}
            className={buttonStyles({
              size: 'lg',
            })}
          >
            Back
          </Link>
        </section>
      </div>
    );
  }

  if (ctx.isLoading || ctx.status === 'idle') {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-10 bg-black py-10">
        <CarbonLogoLoading className="h-[100px]" />
      </div>
    );
  }

  return (
    <div className="rounded-10 bg-black">
      <SimResultChartHeader
        data={ctx.data!}
        setShowSummary={setShowSummary}
        showSummary={showSummary}
        state={state}
        simulationType={simulationType}
      />

      {showSummary ? (
        <SimResultChartSummary
          data={ctx.data!}
          bounds={ctx.bounds!}
          baseToken={state.baseToken!}
          quoteToken={state.quoteToken!}
        />
      ) : (
        <SimResultChartAnimation
          data={ctx.animationData}
          bounds={ctx.bounds!}
          baseToken={state.baseToken!}
          quoteToken={state.quoteToken!}
        />
      )}
    </div>
  );
};
