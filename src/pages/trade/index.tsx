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
      <div className="mx-auto mt-50 grid grid-cols-12 gap-20 px-10 pb-30 md:px-20 xl:px-50">
        <div className={'col-span-4'}>
          <OrderBookWidget />
        </div>
        <div className={'col-span-8 space-y-20'}>
          <TradeWidget />
          <DepthChartWidget />
        </div>
      </div>
    </>
  );
};
