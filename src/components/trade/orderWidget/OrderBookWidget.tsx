import { OrderBookWidgetHeader } from 'components/trade/orderWidget/OrderBookWidgetHeader';
import { OrderBookWidgetRate } from 'components/trade/orderWidget/OrderBookWidgetRate';
import { useOrderBookWidget } from 'components/trade/orderWidget/useOrderBookWidget';
import { TradePageProps } from 'pages/trade';
import { OrderBookSide } from './OrderBookSide';

export const OrderBookWidget = ({ base, quote }: TradePageProps) => {
  const {
    data: { buy, sell, middleRate },
    isLoading,
    isLastTradeLoading,
    isLastTradeBuy,
  } = useOrderBookWidget(base.address, quote.address);

  return (
    <div className={'h-full rounded-10 bg-silver p-20'}>
      <h2>Orders</h2>
      <div className={'mt-20 font-mono'}>
        <OrderBookWidgetHeader
          baseSymbol={base.symbol}
          quoteSymbol={quote.symbol}
        />
        <div
          className={
            'mt-2 rounded-t-4 rounded-b-10 bg-black px-20 py-8 text-14'
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
