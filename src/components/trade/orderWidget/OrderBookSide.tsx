import { NoOrders } from 'components/common/noOrder';
import { OrderRow } from 'libs/queries';
import { orderBy } from 'lodash';
import { FC } from 'react';
import { OrderBookWidgetRow } from './OrderBookWidgetRow';

type OrderBookSideProps = {
  orders: OrderRow[];
  buy?: boolean;
};

export const OrderBookSide: FC<OrderBookSideProps> = ({ orders, buy }) => {
  return (
    <div>
      {orders?.length > 0 ? (
        <div className={'grid grid-cols-3 gap-x-10'}>
          {orderBy(orders, ({ rate }) => Number(rate), 'desc').map((props) => (
            <OrderBookWidgetRow
              key={`orderbook${buy ? 'buy' : 'sell'}-${props.rate}`}
              buy={buy}
              {...props}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[396px] items-center justify-center rounded-10 bg-black text-center">
          <NoOrders />
        </div>
      )}
    </div>
  );
};
