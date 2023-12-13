import { Page } from 'components/common/page';
import {
  D3ChartSettingsProps,
  D3ChartSimulatorBalance,
  D3ChartSimulatorPortfolioOverHodle,
  D3ChartSimulatorPrice,
} from 'libs/d3';
import { SimulatorParams, useGetSimulator } from 'libs/queries';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 500,
  marginTop: 20,
  marginBottom: 40,
  marginLeft: 80,
  marginRight: 20,
};

const mockParams: SimulatorParams = {
  token0: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  token1: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  start: 1690813173,
  end: 1702349173,
  startingPortfolioValue: 100,
  highRangeHighPriceCash: 0.4,
  highRangeLowPriceCash: 0.3,
  lowRangeHighPriceCash: 0.2,
  lowRangeLowPriceCash: 0.1,
  startRateHighRange: 0.3,
  startRateLowRange: 0.1,
  cashProportion: 0,
  riskProportion: 100,
  networkFee: 0.00142331163646665,
};

export const SimulatorPage = () => {
  // const data = useMockdata();

  const { data, isLoading } = useGetSimulator(mockParams);

  return (
    <Page title={'Simulator'}>
      <div className={'grid grid-cols-2 gap-20'}>
        {isLoading || !data ? (
          <div>is loading</div>
        ) : (
          <>
            <D3ChartSimulatorPrice data={data} settings={chartSettings} />

            <D3ChartSimulatorPortfolioOverHodle
              data={data}
              settings={chartSettings}
            />

            <D3ChartSimulatorBalance data={data} settings={chartSettings} />
          </>
        )}
      </div>
    </Page>
  );
};
