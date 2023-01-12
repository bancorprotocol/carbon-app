import { TradeWidget } from 'components/trade/tradeWidget/TradeWidget';
import { OrderBookWidget } from 'components/trade/orderWidget/OrderBookWidget';
import { DepthChartWidget } from 'components/trade/depthChartWidget/DepthChartWidget';

export const TradePage = () => {
  return (
    <div className="mx-auto mt-40 grid max-w-[1480px] grid-cols-12 gap-20">
      <div className={'col-span-4'}>
        <OrderBookWidget />
      </div>
      <div className={'col-span-8 space-y-20'}>
        <TradeWidget />
        <DepthChartWidget />
      </div>
    </div>
  );
};
