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
import { getLastVisitedPair, useNavigate, useSearch } from 'libs/routing';

export type TradePageProps = { base: Token; quote: Token };

export const TradePage = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/trade' });
  const { belowBreakpoint } = useBreakpoints();
  const { baseToken, quoteToken } = useTradeTokens();
  const { isPending, isTradePairError } = useTradePairs();
  const isValidPair = baseToken && quoteToken;
  const pairFound = !isTradePairError && isValidPair;

  useEffect(() => {
    if (search.base && search.quote && pairFound) return;
    navigate({
      search: { ...search, ...getLastVisitedPair() },
      params: {},
      replace: true,
    });
  }, [search, navigate, pairFound]);

  useEffect(() => {
    if (baseToken && quoteToken) {
      lsService.setItem('tradePair', [baseToken.address, quoteToken.address]);
    }
  }, [baseToken, quoteToken]);

  return (
    <>
      {belowBreakpoint('md') && <MainMenuTrade />}

      {isPending ? (
        <div className="flex flex-grow items-center justify-center">
          <div className="h-80">
            <CarbonLogoLoading />
          </div>
        </div>
      ) : !pairFound ? (
        <p>Pair not found</p>
      ) : (
        <div className="px-content mt-25 pb-30 xl:px-50 grid grid-cols-1 gap-20 md:grid-cols-12">
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
