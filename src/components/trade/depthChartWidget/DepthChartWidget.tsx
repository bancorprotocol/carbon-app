import { Highcharts, HighchartsReact } from 'libs/charts';
import { NoOrders } from 'components/common/noOrder';
import { useDepthChartWidget } from './useDepthChartWidget';
import { TradePageProps } from 'pages/trade';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

export const DepthChartWidget = ({ base, quote }: TradePageProps) => {
  const { buyOrders, sellOrders, getOptions, isLoading } = useDepthChartWidget(
    base,
    quote
  );

  const options = getOptions(buyOrders, sellOrders);

  const isError = (!buyOrders && !sellOrders) || !base || !quote || !options;

  return (
    <div className="rounded-10 bg-silver p-20">
      <div className="mb-20 font-weight-500">Depth</div>
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
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};
