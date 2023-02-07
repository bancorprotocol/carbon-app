import { Highcharts, HighchartsReact } from 'libs/charts';
import { NoData } from 'components/common/noData';
import { useDepthChartWidget } from './useDepthChartWidget';
import { useTradeTokens } from '../useTradeTokens';

export const DepthChartWidget = () => {
  const { baseToken, quoteToken } = useTradeTokens();
  const { buyOrders, sellOrders, getOptions } = useDepthChartWidget(
    baseToken?.address,
    quoteToken?.address
  );

  const options = getOptions(buyOrders, sellOrders);

  const isError =
    !baseToken || !quoteToken || !buyOrders || !sellOrders || !options;

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
