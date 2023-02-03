import { FC } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { OrderRow } from 'libs/queries/sdk/orderBook';

type Props = OrderRow & {
  buy?: boolean;
};

export const OrderBookWidgetRow: FC<Props> = ({ buy, rate, amount, total }) => {
  return (
    <>
      <div className={`${buy ? 'text-green' : 'text-red'} py-4`}>
        {prettifyNumber(rate)}
      </div>
      <div className={'py-4 text-white/80'}>{prettifyNumber(amount)}</div>
      <div className={'py-4 text-right text-white/80'}>
        {prettifyNumber(total)}
      </div>
    </>
  );
};
