import { D3ChartSimulatorSummary } from 'components/simulator/result/d3Charts/D3ChartSimulatorSummary';
import { D3ChartSettingsProps } from 'libs/d3';
import { D3ChartWrapper } from 'libs/d3/D3ChartWrapper';
import { SimulatorBounds, SimulatorData } from 'libs/queries';
import { Token } from 'libs/tokens';

const chartSettingsSummary: D3ChartSettingsProps = {
  width: 0,
  height: 600,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 80,
  marginRight: 80,
};

interface Props {
  data: SimulatorData[];
  bounds: SimulatorBounds;
  baseToken: Token;
  quoteToken: Token;
}

export const SimResultChartSummary = ({
  data,
  bounds,
  baseToken,
  quoteToken,
}: Props) => {
  return (
    <div
      className="border-background-800 flex w-full border-t"
      data-testid="chart-summary"
    >
      <p
        className="border-background-800 text-12 -rotate-180 border-l p-8 text-center text-white/60"
        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
      >
        Price ({quoteToken.symbol} per {baseToken.symbol})
      </p>
      <D3ChartWrapper
        className="min-h-[600px] flex-1"
        settings={chartSettingsSummary}
      >
        {(dms) => (
          <D3ChartSimulatorSummary data={data} bounds={bounds} dms={dms} />
        )}
      </D3ChartWrapper>
      <p
        className="border-background-800 text-12 -rotate-180 border-r p-8 text-center text-white/60"
        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
      >
        Portfolio Value ({quoteToken.symbol})
      </p>
    </div>
  );
};
