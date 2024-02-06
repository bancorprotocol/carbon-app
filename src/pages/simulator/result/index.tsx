import { Link } from '@tanstack/react-router';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { SimulatorChartHeader } from 'components/simulator/SimulatorChartHeader';
import { SimulatorSummary } from 'components/simulator/SimulatorSummary';
import { useStrategyInput } from 'hooks/useStrategyInput';
import { D3ChartSimulatorPrice } from 'libs/d3';
import { D3ChartSimulatorBalance } from 'libs/d3/sim/D3ChartSimulatorBalance';
import { D3ChartSimulatorPerformance } from 'libs/d3/sim/D3ChartSimulatorPerformance';
import { D3ChartSimulatorSummary } from 'libs/d3/sim/D3ChartSimulatorSummary';
import { SimChartWrapper } from 'libs/d3/sim/SimulatorChartWrapper';
import { useSimulator } from 'libs/d3/sim/SimulatorProvider';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { useSearch } from 'libs/routing';
import { useEffect, useState } from 'react';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { wait } from 'utils/helpers';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 330,
  marginTop: 0,
  marginBottom: 30,
  marginLeft: 80,
  marginRight: 0,
};

const chartSettingsBalance: D3ChartSettingsProps = {
  width: 0,
  height: 330,
  marginTop: 100,
  marginBottom: 30,
  marginLeft: 0,
  marginRight: 0,
};

const chartSettingsSummary: D3ChartSettingsProps = {
  width: 0,
  height: 600,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 80,
  marginRight: 80,
};

export const SimulatorResultPage = () => {
  const ctx = useSimulator();
  const search = useSearch({ from: '/simulator/result' });
  const [showSummary, setShowSummary] = useState(false);
  const { state } = useStrategyInput();
  const simulationType = 'recurring';

  useEffect(() => {
    if (!ctx.isSuccess || ctx.status === 'running' || ctx.status === 'ended') {
      return;
    }
    console.log('sim result effect');

    wait(3000).then(() => {
      ctx.start();
    });
  }, [ctx]);

  return (
    <div className="p-20">
      <Link
        to={'/simulator/$simulationType'}
        params={{ simulationType }}
        search={search}
        className="mb-16 flex items-center text-24 font-weight-500"
      >
        <div className="mr-16 flex h-40 w-40 items-center justify-center rounded-full bg-emphasis">
          <IconChevronLeft className="h-16 w-16" />
        </div>
        Simulate Strategy
      </Link>

      {ctx.isError && <div>Error</div>}

      <div className="rounded-20 bg-silver p-20">
        <>
          <SimulatorSummary
            roi={ctx.roi}
            gains={ctx.gains}
            state2={state}
            isLoading={ctx.isLoading}
          />
          {!ctx.isLoading && !!ctx.data && ctx.status !== 'idle' ? (
            <>
              <div className="rounded-10 bg-black">
                <SimulatorChartHeader
                  data={ctx.data}
                  setShowSummary={setShowSummary}
                  showSummary={showSummary}
                  state={state}
                />
                {!showSummary ? (
                  <>
                    <SimChartWrapper
                      settings={chartSettings}
                      className="border-t border-emphasis"
                    >
                      {(dms) => (
                        <D3ChartSimulatorPrice
                          data={ctx.animationData}
                          bounds={ctx.bounds!}
                          dms={dms}
                        />
                      )}
                    </SimChartWrapper>

                    <div className="grid grid-cols-2">
                      <SimChartWrapper
                        settings={chartSettings}
                        className="border-t border-r border-emphasis"
                      >
                        {(dms) => (
                          <D3ChartSimulatorPerformance
                            data={ctx.animationData}
                            dms={dms}
                          />
                        )}
                      </SimChartWrapper>

                      <SimChartWrapper
                        settings={chartSettingsBalance}
                        className="border-t border-emphasis"
                      >
                        {(dms) => (
                          <D3ChartSimulatorBalance
                            data={ctx.animationData}
                            dms={dms}
                            baseToken={state.baseToken!}
                            quoteToken={state.quoteToken!}
                          />
                        )}
                      </SimChartWrapper>
                    </div>
                  </>
                ) : (
                  <>
                    <hr className="border-emphasis" />
                    <div className="flex w-full flex-row">
                      <div className="relative flex w-30 flex-shrink-0 items-center justify-center border-r border-emphasis font-mono text-12 text-white/60">
                        <div className="-rotate-90 whitespace-nowrap">
                          Price ({state.quoteToken?.symbol} per{' '}
                          {state.baseToken?.symbol})
                        </div>
                      </div>
                      <div className="w-[calc(100%-60px)]">
                        <SimChartWrapper settings={chartSettingsSummary}>
                          {(dms) => (
                            <D3ChartSimulatorSummary
                              data={ctx.data ?? []}
                              bounds={ctx.bounds!}
                              dms={dms}
                            />
                          )}
                        </SimChartWrapper>
                      </div>
                      <div className="relative flex w-30 flex-shrink-0 items-center justify-center border-l border-emphasis font-mono text-12 text-white/60">
                        <div className="-rotate-90 whitespace-nowrap">
                          Portfolio Value ({state.quoteToken?.symbol})
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-10 bg-black py-10">
              <CarbonLogoLoading className="h-[100px]" />
            </div>
          )}
        </>
      </div>
    </div>
  );
};
