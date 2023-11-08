import { TradeWidget } from 'components/trade/tradeWidget/TradeWidget';
import { OrderBookWidget } from 'components/trade/orderWidget/OrderBookWidget';
import { DepthChartWidget } from 'components/trade/depthChartWidget/DepthChartWidget';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useTradeTokens } from 'components/trade/useTradeTokens';
import { Token } from 'libs/tokens';
import { useTradePairs } from 'components/trade/useTradePairs';
import { MainMenuTrade } from 'components/core/menu/mainMenu/MainMenuTrade';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { getLastVisitedPair } from 'libs/routing/utils';

export interface TradeSearch {
  base: string;
  quote: string;
}
export type TradePageProps = { base: Token; quote: Token };

export const TradePage = () => {
  const navigate = useNavigate();
  const search: TradeSearch = useSearch({ strict: false });
  const { belowBreakpoint } = useBreakpoints();
  const { baseToken, quoteToken } = useTradeTokens();
  const { isLoading, isTradePairError } = useTradePairs();
  const isValidPair = !(!baseToken || !quoteToken);
  const noTokens = !baseToken && !quoteToken;

  useEffect(() => {
    if (search.base && search.quote) return;
    navigate({ search: { ...search, ...getLastVisitedPair() } });
  }, [search, navigate]);

  useEffect(() => {
    if (baseToken && quoteToken) {
      lsService.setItem('tradePair', [baseToken.address, quoteToken.address]);
    }
  }, [baseToken, quoteToken]);

  return (
    <>
      {belowBreakpoint('md') && <MainMenuTrade />}

      {isLoading ? (
        <div className="flex flex-grow items-center justify-center">
          <div className="h-80">
            <CarbonLogoLoading />
          </div>
        </div>
      ) : isTradePairError || !isValidPair ? (
        <p>{!noTokens && <>Not found</>}</p>
      ) : (
        <div className="px-content mt-25 grid grid-cols-1 gap-20 pb-30 md:grid-cols-12 xl:px-50">
          <div className="order-3 md:order-1 md:col-span-4 md:row-span-2">
            <OrderBookWidget base={baseToken} quote={quoteToken} />
          </div>
          <div className="order-1 md:order-2 md:col-span-8">
            <TradeWidget base={baseToken} quote={quoteToken} />
          </div>
          <div className="order-2 md:order-3 md:col-span-8">
            <DepthChartWidget base={baseToken} quote={quoteToken} />
          </div>
        </div>
      )}
    </>
  );
};
