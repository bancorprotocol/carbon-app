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
  const searchState = useSearch({ from: '/simulate/result' });

  if (ctx.isError) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="rounded-10 mx-auto my-10 flex h-[400px] flex-col items-center justify-center gap-20 bg-black"
      >
        <IconTitleText
          icon={<IconWarning />}
          title="Missing Information"
          text={
            <p className="w-[480px]">
              It appears that the simulation is missing essential information
              for successful execution. Please attempt to re-enter the
              simulation data.
            </p>
          }
          variant="error"
        />
        <Link
          to="/simulate/$simulationType"
          params={{ simulationType }}
          search={searchState}
          className={buttonStyles({
            size: 'lg',
          })}
        >
          Back
        </Link>
      </div>
    );
  }

  if (ctx.isLoading || ctx.status === 'idle') {
    return <Loading />;
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

const Loading = () => (
  <div className="rounded-10 grid h-[400px] place-items-center bg-black py-10">
    <CarbonLogoLoading className="h-[100px]" />
  </div>
);
