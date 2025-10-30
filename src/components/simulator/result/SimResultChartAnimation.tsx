import { D3ChartSimulatorBalance } from 'components/simulator/result/d3Charts/D3ChartSimulatorBalance';
import { D3ChartSimulatorPerformance } from 'components/simulator/result/d3Charts/D3ChartSimulatorPerformance';
import { D3ChartSimulatorPrice } from 'components/simulator/result/d3Charts/D3ChartSimulatorPrice';
import { D3ChartSettingsProps } from 'libs/d3';
import { D3ChartWrapper } from 'libs/d3/D3ChartWrapper';
import { SimulatorBounds, SimulatorData } from 'libs/queries';
import { Token } from 'libs/tokens';
import { useState } from 'react';

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
  base: Token;
  quote: Token;
}

export const SimResultChartAnimation = ({
  data,
  bounds,
  base,
  quote,
}: Props) => {
  const [displayBalance, setDisplayBalance] = useState(true);
  return (
    <>
      <D3ChartWrapper
        settings={chartSettings}
        className="border-main-800 min-h-[350px] w-full border-t"
        data-testid="chart-animation-price"
      >
        {(dms) => (
          <D3ChartSimulatorPrice data={data} bounds={bounds!} dms={dms} />
        )}
      </D3ChartWrapper>

      <div className="grid md:grid-flow-col min-h-[250px] items-stretch">
        <D3ChartWrapper
          settings={chartPerformanceSettings}
          className="border-main-800 w-full border-r border-t"
          data-testid="chart-animation-performance"
        >
          {(dms) => <D3ChartSimulatorPerformance data={data} dms={dms} />}
        </D3ChartWrapper>

        <D3ChartWrapper
          settings={chartSettingsBalance}
          className="border-main-800 w-full border-t"
          data-testid="chart-animation-balance"
        >
          {(dms) => (
            <D3ChartSimulatorBalance
              data={data}
              dms={dms}
              base={base}
              quote={quote}
              isVisible={displayBalance}
              setIsVisible={setDisplayBalance}
            />
          )}
        </D3ChartWrapper>
      </div>
    </>
  );
};
