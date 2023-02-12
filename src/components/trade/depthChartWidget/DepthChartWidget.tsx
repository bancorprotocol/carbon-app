import { Highcharts, HighchartsReact } from 'libs/charts';
import { NoOrders } from 'components/common/noOrder';
import { useDepthChartWidget } from './useDepthChartWidget';
import { TradePageProps } from 'pages/trade';

export const DepthChartWidget = ({ base, quote }: TradePageProps) => {
  const { buyOrders, sellOrders, getOptions } = useDepthChartWidget(
    base.address,
    quote.address
  );

  const options = getOptions(buyOrders, sellOrders);

  const isError = !base || !quote || !buyOrders || !sellOrders || !options;

  return (
    <div className="rounded-10 bg-silver p-20">
      <div className="mb-20 font-weight-500">Depth</div>
      {isError ? (
        <div className="flex h-[300px] items-center justify-center rounded-10 bg-black">
          <NoOrders />
        </div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};
