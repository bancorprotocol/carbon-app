import { OrderBookWidgetHeader } from 'components/trade/orderWidget/OrderBookWidgetHeader';
import { OrderBookWidgetRate } from 'components/trade/orderWidget/OrderBookWidgetRate';
import { useOrderBookWidget } from 'components/trade/orderWidget/useOrderBookWidget';
import { TradePageProps } from 'pages/trade';
import { OrderBookSide } from './OrderBookSide';

export const OrderBookWidget = ({ base, quote }: TradePageProps) => {
  const {
    data: { buy, sell, middleRate, middleRateFiat },
    isLoading,
    isLastTradeLoading,
    isLastTradeBuy,
  } = useOrderBookWidget(base.address, quote.address);

  return (
    <section
      aria-labelledby="order-title"
      className="rounded-10 bg-background-900 p-20"
    >
      <h2 id="order-title">Orders</h2>
      <div className="mt-20 font-mono">
        <OrderBookWidgetHeader
          baseSymbol={base.symbol}
          quoteSymbol={quote.symbol}
        />
        <div className="rounded-b-10 rounded-t-4 text-14 mt-2 bg-black px-20 py-8">
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
    </section>
  );
};
