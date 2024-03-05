import { useState } from 'react';
import { Highcharts, HighchartsReact } from 'libs/charts';
import { useDepthChartWidget } from './useDepthChartWidget';
import { TradePageProps } from 'pages/trade';
import { NoOrders } from 'components/common/noOrder';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradingviewChart } from 'components/tradingviewChart';

export const DepthChartWidget = ({ base, quote }: TradePageProps) => {
  const { buyOrders, sellOrders, getOptions, isLoading } = useDepthChartWidget(
    base,
    quote
  );
  const [showTVChart, setShowTVChart] = useState(false);
  const options = getOptions(buyOrders, sellOrders);

  const isError = (!buyOrders && !sellOrders) || !base || !quote || !options;

  return (
    <div className="rounded-10 bg-background-900 p-20">
      <div className="mb-20 flex w-[244px] items-center rounded-[100px] bg-black p-2">
        <button
          onClick={() => setShowTVChart(false)}
          className={`rounded-40 ${
            !showTVChart ? 'bg-background-900' : 'text-secondary'
          } w-[120px] px-10 py-4`}
        >
          Depth
        </button>
        <button
          onClick={() => setShowTVChart(true)}
          className={`rounded-40 ${
            showTVChart ? 'bg-background-900' : 'text-secondary'
          } w-[120px] px-10 py-4`}
        >
          Price
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-[450px] items-center justify-center rounded-10 bg-black">
          <div className={'h-80'}>
            <CarbonLogoLoading />
          </div>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center rounded-10 bg-black">
          <NoOrders />
        </div>
      ) : !showTVChart ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <div className={'h-[450px] pb-20'}>
          <TradingviewChart base={base} quote={quote} />
        </div>
      )}
    </div>
  );
};
