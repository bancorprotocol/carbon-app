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
  baseToken: Token;
  quoteToken: Token;
}

export const SimResultChartAnimation = ({
  data,
  bounds,
  baseToken,
  quoteToken,
}: Props) => {
  const [displayBalance, setDisplayBalance] = useState(true);
  const gridCols = displayBalance ? 'grid-cols-2' : 'grid-cols-[1fr_80px]';
  return (
    <>
      <D3ChartWrapper
        settings={chartSettings}
        className="border-background-800 min-h-[350px] w-full border-t"
        data-testid="chart-animation-price"
      >
        {(dms) => (
          <D3ChartSimulatorPrice data={data} bounds={bounds!} dms={dms} />
        )}
      </D3ChartWrapper>

      <div className={`grid ${gridCols} min-h-[250px] items-stretch`}>
        <D3ChartWrapper
          settings={chartPerformanceSettings}
          className="border-background-800 w-full border-r border-t"
          data-testid="chart-animation-performance"
        >
          {(dms) => <D3ChartSimulatorPerformance data={data} dms={dms} />}
        </D3ChartWrapper>

        <D3ChartWrapper
          settings={chartSettingsBalance}
          className="border-background-800 w-full border-t"
          data-testid="chart-animation-balance"
        >
          {(dms) => (
            <D3ChartSimulatorBalance
              data={data}
              dms={dms}
              baseToken={baseToken}
              quoteToken={quoteToken}
              isVisible={displayBalance}
              setIsVisible={setDisplayBalance}
            />
          )}
        </D3ChartWrapper>
      </div>
    </>
  );
};
