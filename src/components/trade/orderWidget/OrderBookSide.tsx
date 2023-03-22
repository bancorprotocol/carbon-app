import { NoOrders } from 'components/common/noOrder';
import { OrderRow } from 'libs/queries';
import { Token } from 'libs/tokens';
import { orderBy } from 'lodash';
import { FC } from 'react';
import { OrderBookWidgetRow } from './OrderBookWidgetRow';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { AnimatePresence, m } from 'framer-motion';

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
    <AnimatePresence exitBeforeEnter={true}>
      {isLoading ? (
        <m.div
          key={'loading'}
          className={'flex h-[392px] w-full items-center justify-center'}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={'h-[80px]'}>
            <CarbonLogoLoading />
          </div>
        </m.div>
      ) : orders?.length > 0 ? (
        <m.div
          key={'orders'}
          className={'grid grid-cols-3 gap-x-10'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {orderBy(orders, ({ rate }) => Number(rate), 'desc').map(
            (props, i) => (
              <OrderBookWidgetRow
                key={`orderbook-${buy ? 'buy' : 'sell'}-${props.rate}-${i}-${
                  base.address
                }-${quote.address}`}
                buy={buy}
                base={base}
                quote={quote}
                {...props}
              />
            )
          )}
        </m.div>
      ) : (
        <m.div
          className="flex h-[392px] items-center justify-center rounded-10 bg-black text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <NoOrders />
        </m.div>
      )}
    </AnimatePresence>
  );
};
