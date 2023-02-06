import { FC } from 'react';
import { OrderRow } from 'libs/queries/sdk/orderBook';

type Props = OrderRow & {
  buy?: boolean;
};

export const OrderBookWidgetRow: FC<Props> = ({ buy, rate, amount, total }) => {
  return (
    <>
      <div className={`${buy ? 'text-green' : 'text-red'} py-4`}>
        {Number(rate).toFixed(6)}
      </div>
      <div className={'py-4 text-white/80'}> {Number(amount).toFixed(10)}</div>
      <div className={'py-4 text-right text-white/80'}>
        {Number(total).toFixed(10)}
      </div>
    </>
  );
};
