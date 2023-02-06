import { OrderBookWidgetHeader } from 'components/trade/orderWidget/OrderBookWidgetHeader';
import { OrderBookWidgetRate } from 'components/trade/orderWidget/OrderBookWidgetRate';
import { OrderBookWidgetRow } from 'components/trade/orderWidget/OrderBookWidgetRow';
import { useOrderBookWidget } from 'components/trade/orderWidget/useOrderBookWidget';
import { useTradeTokens } from 'components/trade/useTradeTokens';
import { orderBy } from 'lodash';

export const OrderBookWidget = () => {
  const { baseToken, quoteToken } = useTradeTokens();
  const { data } = useOrderBookWidget(baseToken?.address, quoteToken?.address);

  if (!baseToken || !quoteToken) {
    return null;
  }

  return (
    <div className={'h-full rounded-10 bg-silver p-20'}>
      <h2>Order Book</h2>

      <div className={'mt-20 font-mono'}>
        <OrderBookWidgetHeader
          baseSymbol={baseToken.symbol}
          quoteSymbol={quoteToken.symbol}
        />
        <div
          className={
            'mt-2 rounded-t-4 rounded-b-10 bg-black px-20 py-8 text-14'
          }
        >
          <div className={'grid grid-cols-3'}>
            {orderBy(data.sell, ({ rate }) => Number(rate), 'desc').map(
              (props, i) => (
                <OrderBookWidgetRow key={i} {...props} />
              )
            )}
          </div>
          <OrderBookWidgetRate buy rate={data.middleRate} />
          <div className={'grid grid-cols-3'}>
            {orderBy(data.buy, ({ rate }) => Number(rate), 'desc').map(
              (props, i) => (
                <OrderBookWidgetRow key={i} buy {...props} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
