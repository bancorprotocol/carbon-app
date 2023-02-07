import { Highcharts, HighchartsReact } from 'libs/charts';
import { NoData } from 'components/common/noData';
import { getOptions } from 'libs/charts/utils';
import { useDepthChartWidget } from './useDepthChartWidget';
import { useTradeTokens } from '../useTradeTokens';

export const DepthChartWidget = () => {
  const { baseToken, quoteToken } = useTradeTokens();
  const { buyOrders, sellOrders } = useDepthChartWidget(
    baseToken?.address,
    quoteToken?.address
  );
  const options = getOptions(buyOrders, sellOrders);

  const isError = !baseToken || !quoteToken || !buyOrders || !sellOrders;
  console.log('BUY', buyOrders);
  console.log('SELL', sellOrders);

  if (isError || !options) {
    return null;
  }

  return (
    <div className="rounded-10 bg-silver p-20">
      <div className="mb-20 font-weight-500">Depth</div>
      {isError ? (
        <div className="flex h-[300px] items-center justify-center rounded-10 bg-black">
          <NoData />
        </div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
};
