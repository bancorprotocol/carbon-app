import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { SimulatorResultChartAnimation } from 'components/simulator/result/SimulatorResultChartAnimation';
import { SimulatorResultChartSummary } from 'components/simulator/result/SimulatorResultChartSummary';
import { SimulatorChartHeader } from 'components/simulator/SimulatorChartHeader';
import { StrategyInput2 } from 'hooks/useStrategyInput';
import { useSimulator } from 'libs/d3';
import { useState } from 'react';

interface Props {
  state: StrategyInput2;
}

export const SimulatorResultChart = ({ state }: Props) => {
  const ctx = useSimulator();
  const [showSummary, setShowSummary] = useState(false);

  if (ctx.isError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-10 bg-black py-10">
        <div className="max-w-1/3 flex flex-col items-center justify-center space-y-10 rounded-10 border border-red bg-red/30 p-20">
          <div className="text-24 font-weight-500">Error</div>
          <div className="text-center font-weight-500">
            Something went wrong.
            <br /> Please try again or contact support.
          </div>
          <div className="text-12 text-red/80">
            {ctx.errorMsg ?? 'Unknown internal error'}
          </div>
        </div>
      </div>
    );
  }

  if (ctx.isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-10 bg-black py-10">
        <CarbonLogoLoading className="h-[100px]" />
      </div>
    );
  }

  return (
    <div className="rounded-10 bg-black">
      <SimulatorChartHeader
        data={ctx.data!}
        setShowSummary={setShowSummary}
        showSummary={showSummary}
        state={state}
      />

      {showSummary ? (
        <SimulatorResultChartSummary
          data={ctx.data!}
          bounds={ctx.bounds!}
          baseToken={state.baseToken!}
          quoteToken={state.quoteToken!}
        />
      ) : (
        <SimulatorResultChartAnimation
          data={ctx.animationData}
          bounds={ctx.bounds!}
          baseToken={state.baseToken!}
          quoteToken={state.quoteToken!}
        />
      )}
    </div>
  );
};
