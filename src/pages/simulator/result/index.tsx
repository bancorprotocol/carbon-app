import { SimulatorChartHeader } from 'components/simulator/SimulatorChartHeader';
import { SimulatorSummary } from 'components/simulator/SimulatorSummary';
import { D3ChartSimulatorPrice } from 'libs/d3';
import { D3ChartSimulatorBalance } from 'libs/d3/sim/D3ChartSimulatorBalance';
import { D3ChartSimulatorPerformance } from 'libs/d3/sim/D3ChartSimulatorPerformance';
import { D3ChartSimulatorSummary } from 'libs/d3/sim/D3ChartSimulatorSummary';
import { SimChartWrapper } from 'libs/d3/sim/SimulatorChartWrapper';
import { useSimulator } from 'libs/d3/sim/SimulatorProvider';
import { D3ChartSettingsProps } from 'libs/d3/types';
import { useState } from 'react';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 330,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 50,
  marginRight: 0,
};

const chartSettingsBalance: D3ChartSettingsProps = {
  width: 0,
  height: 330,
  marginTop: 100,
  marginBottom: 40,
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
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="p-20">
      <h1>Simulator Result Page</h1>

      <button onClick={() => setShowSummary((prev) => !prev)}>
        Show Summary
      </button>

      <button onClick={() => ctx.start()}>Start</button>
      <button onClick={() => ctx.pauseToggle()}>Pause/Unpause</button>
      <button onClick={() => ctx.end()}>End</button>
      <div>{ctx.status}</div>
      <div>Frames: {ctx.timer}</div>

      {ctx.isError && <div>Error</div>}

      <div className="rounded-20 bg-silver p-20">
        {ctx.data && ctx.roi && ctx.gains && ctx.bounds && (
          <>
            <SimulatorSummary
              roi={ctx.roi}
              gains={ctx.gains}
              isLoading={ctx.isLoading}
            />
            {!ctx.isLoading ? (
              <>
                <div className="rounded-10 bg-black py-10">
                  <SimulatorChartHeader
                    data={ctx.data}
                    setShowSummary={setShowSummary}
                    showSummary={showSummary}
                  />
                  {!showSummary ? (
                    <>
                      <SimChartWrapper settings={chartSettings}>
                        {(dms) => (
                          <D3ChartSimulatorPrice
                            data={ctx.animationData}
                            bounds={ctx.bounds!}
                            dms={dms}
                          />
                        )}
                      </SimChartWrapper>

                      <div className="grid grid-cols-2">
                        <SimChartWrapper settings={chartSettings}>
                          {(dms) => (
                            <D3ChartSimulatorPerformance
                              data={ctx.animationData}
                              dms={dms}
                            />
                          )}
                        </SimChartWrapper>

                        <SimChartWrapper settings={chartSettingsBalance}>
                          {(dms) => (
                            <D3ChartSimulatorBalance
                              data={ctx.animationData}
                              dms={dms}
                            />
                          )}
                        </SimChartWrapper>
                      </div>
                    </>
                  ) : (
                    <SimChartWrapper settings={chartSettingsSummary}>
                      {(dms) => (
                        <D3ChartSimulatorSummary
                          data={ctx.data ?? []}
                          bounds={ctx.bounds!}
                          dms={dms}
                        />
                      )}
                    </SimChartWrapper>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-10 bg-black py-10">
                <div>loading</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
