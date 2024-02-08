import {
  D3ChartSettingsProps,
  D3ChartSimulatorBalance,
  D3ChartSimulatorPerformance,
  D3ChartSimulatorPrice,
} from 'libs/d3';
import { SimChartWrapper } from 'libs/d3/sim/SimulatorChartWrapper';
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

export const SimulatorResultChartAnimation = ({
  data,
  bounds,
  baseToken,
  quoteToken,
}: Props) => {
  return (
    <>
      <SimChartWrapper
        settings={chartSettings}
        className="border-t border-emphasis"
      >
        {(dms) => (
          <D3ChartSimulatorPrice data={data} bounds={bounds!} dms={dms} />
        )}
      </SimChartWrapper>

      <div className="grid grid-cols-2">
        <SimChartWrapper
          settings={chartPerformanceSettings}
          className="border-t border-r border-emphasis"
        >
          {(dms) => <D3ChartSimulatorPerformance data={data} dms={dms} />}
        </SimChartWrapper>

        <SimChartWrapper
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
        </SimChartWrapper>
      </div>
    </>
  );
};
