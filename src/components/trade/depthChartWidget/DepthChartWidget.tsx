import { Highcharts, HighchartsReact } from 'libs/charts';
import { NoData } from 'components/common/noData';
import { getOptions } from 'libs/charts/utils';
import { useDepthChartWidget } from './useDepthChartWidget';
import { useTradeTokens } from '../useTradeTokens';

// TODO: Fix data (need data without overlapping)
// const buy = [
//   [0.29999999980458647, 100],
//   [0.41999999979158553, 5],
//   [0.5399999997785846, 5],
//   [0.6599999997655837, 5],
//   [0.7799999997525827, 5],
//   [0.8999999997395817, 5],
//   [1.0199999997265807, 5],
//   [1.13999999971358, 5],
//   [1.2599999997005789, 5],
//   [1.379999999687578, 5],
//   [1.499999999674577, 5],
// ];

// const sell = [
//   [2.612903226676345, 177.41935493439794],
//   [2.351351351985734, 148.64864871843074],
//   [2.162790698161694, 127.90697679778634],
//   [2.0204081636540918, 112.2448980019501],
//   [2.000000001285544, 230.0000001478376],
//   [1.9090909094102404, 100.00000003512643],
//   [1.8196721314158772, 90.1639344557465],
//   [1.7462686569460864, 82.0895522640695],
//   [1.6849315070488805, 75.34246577537685],
//   [1.632911392580674, 69.62025318387414],
//   [1.5882352942738392, 58.82352942738393],
// ];

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
