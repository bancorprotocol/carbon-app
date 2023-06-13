import { useTranslation } from 'libs/translations';
import { OrderBookWidgetHeader } from 'components/trade/orderWidget/OrderBookWidgetHeader';
import { OrderBookWidgetRate } from 'components/trade/orderWidget/OrderBookWidgetRate';
import { useOrderBookWidget } from 'components/trade/orderWidget/useOrderBookWidget';
import { TradePageProps } from 'pages/trade';
import { OrderBookSide } from './OrderBookSide';

export const OrderBookWidget = ({ base, quote }: TradePageProps) => {
  const { t } = useTranslation();
  const {
    data: { buy, sell, middleRate, middleRateFiat },
    isLoading,
    isLastTradeLoading,
    isLastTradeBuy,
  } = useOrderBookWidget(base.address, quote.address);

  return (
    <div className={'rounded-10 bg-silver p-20'}>
      <h2>{t('pages.trade.section1.title')}</h2>
      <div className={'mt-20 font-mono'}>
        <OrderBookWidgetHeader
          baseSymbol={base.symbol}
          quoteSymbol={quote.symbol}
        />
        <div
          className={
            'mt-2 rounded-b-10 rounded-t-4 bg-black px-20 py-8 text-14'
          }
        >
          <OrderBookSide
            isLoading={isLoading}
            orders={sell}
            base={base}
            quote={quote}
          />
          <OrderBookWidgetRate
            buy={isLastTradeBuy}
            rate={middleRate}
            fiatRate={middleRateFiat}
            isLoading={isLastTradeLoading}
          />
          <OrderBookSide
            isLoading={isLoading}
            orders={buy}
            base={base}
            quote={quote}
            buy
          />
        </div>
      </div>
    </div>
  );
};
