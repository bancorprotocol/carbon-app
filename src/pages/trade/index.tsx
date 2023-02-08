import { TradeWidget } from 'components/trade/tradeWidget/TradeWidget';
import { OrderBookWidget } from 'components/trade/orderWidget/OrderBookWidget';
import { DepthChartWidget } from 'components/trade/depthChartWidget/DepthChartWidget';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MainMenuTokens } from 'components/core/menu/mainMenu/MainMenuTokens';

export const TradePage = () => {
  const { belowBreakpoint } = useBreakpoints();

  return (
    <>
      {belowBreakpoint('md') && <MainMenuTokens />}
      <div className="px-content mx-auto mt-50 grid grid-cols-1 gap-20 pb-30 md:grid-cols-12 xl:px-50">
        <div
          className={'order-last md:order-first md:col-span-4 md:row-span-2'}
        >
          <OrderBookWidget />
        </div>
        <div className={'md:col-span-8'}>
          <TradeWidget />
        </div>
        <div className={'order-first md:order-last md:col-span-8'}>
          <DepthChartWidget />
        </div>
      </div>
    </>
  );
};
