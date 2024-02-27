import { D3ChartSimulatorBalance } from 'components/simulator/result/d3Charts/D3ChartSimulatorBalance';
import { D3ChartSimulatorPerformance } from 'components/simulator/result/d3Charts/D3ChartSimulatorPerformance';
import { D3ChartSimulatorPrice } from 'components/simulator/result/d3Charts/D3ChartSimulatorPrice';
import { D3ChartSettingsProps } from 'libs/d3';
import { D3ChartWrapper } from 'libs/d3/D3ChartWrapper';
import { SimulatorBounds, SimulatorData } from 'libs/queries';
import { Token } from 'libs/tokens';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 350,
  marginTop: 0,
  marginBottom: 30,
  marginLeft: 80,
  marginRight: 0,
};

const chartPerformanceSettings: D3ChartSettingsProps = {
  width: 0,
  height: 250,
  marginTop: 0,
  marginBottom: 30,
  marginLeft: 80,
  marginRight: 0,
};

const chartSettingsBalance: D3ChartSettingsProps = {
  width: 0,
  height: 250,
  marginTop: 100,
  marginBottom: 30,
  marginLeft: 0,
  marginRight: 0,
};

interface Props {
  data: SimulatorData[];
  bounds: SimulatorBounds;
  baseToken: Token;
  quoteToken: Token;
}

export const SimResultChartAnimation = ({
  data,
  bounds,
  baseToken,
  quoteToken,
}: Props) => {
  return (
    <div data-testid="chart-animation">
      <D3ChartWrapper
        settings={chartSettings}
        className="border-t border-emphasis"
      >
        {(dms) => (
          <D3ChartSimulatorPrice data={data} bounds={bounds!} dms={dms} />
        )}
      </D3ChartWrapper>

      <div className="grid grid-cols-2">
        <D3ChartWrapper
          settings={chartPerformanceSettings}
          className="border-t border-r border-emphasis"
        >
          {(dms) => <D3ChartSimulatorPerformance data={data} dms={dms} />}
        </D3ChartWrapper>

        <D3ChartWrapper
          settings={chartSettingsBalance}
          className="border-t border-emphasis"
        >
          {(dms) => (
            <D3ChartSimulatorBalance
              data={data}
              dms={dms}
              baseToken={baseToken}
              quoteToken={quoteToken}
            />
          )}
        </D3ChartWrapper>
      </div>
    </div>
  );
};
