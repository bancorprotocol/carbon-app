import { OrderBookWidgetHeader } from 'components/trade/orderWidget/OrderBookWidgetHeader';
import { OrderBookWidgetRate } from 'components/trade/orderWidget/OrderBookWidgetRate';
import { OrderBookWidgetRow } from 'components/trade/orderWidget/OrderBookWidgetRow';
import { useOrderBookWidget } from 'components/trade/orderWidget/useOrderBookWidget';
import { orderBy } from 'lodash';
import { TradePageProps } from 'pages/trade';

export const OrderBookWidget = ({ base, quote }: TradePageProps) => {
  const { data } = useOrderBookWidget(base.address, quote.address);

  return (
    <div className={'h-full rounded-10 bg-silver p-20'}>
      <h2>Order Book</h2>

      <div className={'mt-20 font-mono'}>
        <OrderBookWidgetHeader
          baseSymbol={base.symbol}
          quoteSymbol={base.symbol}
        />
        <div
          className={
            'mt-2 rounded-t-4 rounded-b-10 bg-black px-20 py-8 text-14'
          }
        >
          <div className={'grid grid-cols-3'}>
            {orderBy(data.sell, ({ rate }) => Number(rate), 'desc').map(
              (props) => (
                <OrderBookWidgetRow
                  key={`orderbooksell-${props.rate}`}
                  {...props}
                />
              )
            )}
          </div>
          <OrderBookWidgetRate buy rate={data.middleRate} />
          <div className={'grid grid-cols-3'}>
            {orderBy(data.buy, ({ rate }) => Number(rate), 'desc').map(
              (props) => (
                <OrderBookWidgetRow
                  key={`orderbookbuy-${props.rate}`}
                  buy
                  {...props}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
