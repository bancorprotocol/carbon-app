import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { SimResultChartAnimation } from 'components/simulator/result/SimResultChartAnimation';
import { SimResultChartSummary } from 'components/simulator/result/SimResultChartSummary';
import { SimResultChartHeader } from 'components/simulator/result/SimResultChartHeader';
import { useSimulator } from 'components/simulator/result/SimulatorProvider';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import { SimulatorType } from 'libs/routing/routes/sim';
import { useState } from 'react';

interface Props {
  state: StrategyInputValues;
  simulationType: SimulatorType;
}

export const SimResultChart = ({ state, simulationType }: Props) => {
  const ctx = useSimulator();
  const [showSummary, setShowSummary] = useState(false);

  if (ctx.isError) {
    return <Error msg={ctx.errorMsg} />;
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
  <div className="flex h-[400px] items-center justify-center rounded-10 bg-black py-10">
    <CarbonLogoLoading className="h-[100px]" />
  </div>
);

const Error = ({ msg }: { msg?: string }) => {
  return (
    <div className="flex h-[400px] items-center justify-center rounded-10 bg-black py-10">
      <div className="max-w-1/3 flex flex-col items-center justify-center space-y-10 rounded-10 border border-red bg-red/30 p-20">
        <div className="text-24 font-weight-500">Error</div>
        <div className="text-center font-weight-500">
          Something went wrong.
          <br /> Please try again or contact support.
        </div>
        <div className="text-12 text-red/80">
          {msg ?? 'Unknown internal error'}
        </div>
      </div>
    </div>
  );
};
