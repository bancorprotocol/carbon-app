import { Highcharts, HighchartsReact } from 'libs/charts';
import { NoOrders } from 'components/common/noOrder';
import { useDepthChartWidget } from './useDepthChartWidget';
import { TradePageProps } from 'pages/trade';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradingviewChart } from 'components/tradingviewChart';
import { useState } from 'react';

export const DepthChartWidget = ({ base, quote }: TradePageProps) => {
  const { buyOrders, sellOrders, getOptions, isLoading } = useDepthChartWidget(
    base,
    quote
  );
  const [showTVChart, setShowTVChart] = useState(false);

  const options = getOptions(buyOrders, sellOrders);

  const isError = (!buyOrders && !sellOrders) || !base || !quote || !options;

  return (
    <div className="rounded-10 bg-silver p-20">
      <div className="mb-20 font-weight-500">
        <button
          onClick={() => setShowTVChart(true)}
          className={`${showTVChart ? '' : 'text-white/60'}`}
        >
          Depth
        </button>
        <span className={'text-secondary px-10'}> | </span>
        <button
          onClick={() => setShowTVChart(false)}
          className={`${showTVChart ? 'text-white/60' : ''}`}
        >
          Price
        </button>
      </div>
      {isLoading ? (
        <div className="flex h-[420px] items-center justify-center rounded-10 bg-black">
          <div className={'h-80'}>
            <CarbonLogoLoading />
          </div>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center rounded-10 bg-black">
          <NoOrders />
        </div>
      ) : showTVChart ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <div className={'h-[420px] pb-20'}>
          <TradingviewChart base={base} quote={quote} />
        </div>
      )}
    </div>
  );
};
