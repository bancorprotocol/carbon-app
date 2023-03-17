import { NoOrders } from 'components/common/noOrder';
import { OrderRow } from 'libs/queries';
import { Token } from 'libs/tokens';
import { orderBy } from 'lodash';
import { FC } from 'react';
import { OrderBookWidgetRow } from './OrderBookWidgetRow';
import { orderBookConfig } from 'workers/sdk';

type OrderBookSideProps = {
  orders: OrderRow[];
  buy?: boolean;
  base: Token;
  quote: Token;
  isLoading: boolean;
};

export const OrderBookSide: FC<OrderBookSideProps> = ({
  orders,
  buy,
  base,
  quote,
  isLoading,
}) => {
  return (
    <div>
      {isLoading ? (
        <div className={'mt-8 space-y-8'}>
          {Array.from({ length: orderBookConfig.buckets.orderBook }).map(
            (_, i) => (
              <div
                key={i}
                className={'loading-skeleton h-20 w-full rounded-4'}
              ></div>
            )
          )}
        </div>
      ) : orders?.length > 0 ? (
        <div className={'grid grid-cols-3 gap-x-10'}>
          {orderBy(orders, ({ rate }) => Number(rate), 'desc').map((props) => (
            <OrderBookWidgetRow
              key={`orderbook${buy ? 'buy' : 'sell'}-${props.rate}`}
              buy={buy}
              base={base}
              quote={quote}
              {...props}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[392px] items-center justify-center rounded-10 bg-black text-center">
          <NoOrders />
        </div>
      )}
    </div>
  );
};
