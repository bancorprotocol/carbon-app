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
    <>
      <hr className="border-emphasis" />
      <div className="flex w-full flex-row">
        <div className="border-emphasis relative flex w-30 flex-shrink-0 items-center justify-center border-r font-mono text-12 text-white/60">
          <div className="-rotate-90 whitespace-nowrap">
            Price ({quoteToken.symbol} per {baseToken.symbol})
          </div>
        </div>
        <div className="w-[calc(100%-60px)]">
          <D3ChartWrapper settings={chartSettingsSummary}>
            {(dms) => (
              <D3ChartSimulatorSummary data={data} bounds={bounds} dms={dms} />
            )}
          </D3ChartWrapper>
        </div>
        <div className="border-emphasis relative flex w-30 flex-shrink-0 items-center justify-center border-l font-mono text-12 text-white/60">
          <div className="-rotate-90 whitespace-nowrap">
            Portfolio Value ({quoteToken.symbol})
          </div>
        </div>
      </div>
    </>
  );
};
