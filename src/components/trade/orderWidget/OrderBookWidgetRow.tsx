import { FC } from 'react';
import { OrderRow } from 'libs/queries/sdk/orderBook';
import { prettifyNumber } from 'utils/helpers';

type Props = OrderRow & {
  buy?: boolean;
};

export const OrderBookWidgetRow: FC<Props> = ({ buy, rate, amount, total }) => {
  return (
    <>
      <div className={`${buy ? 'text-green' : 'text-red'} py-4`}>
        {prettifyNumber(rate, { highPrecision: true })}
      </div>
      <div className={'py-4 text-white/80'}>
        {' '}
        {prettifyNumber(amount, { highPrecision: true })}
      </div>
      <div className={'py-4 text-right text-white/80'}>
        {prettifyNumber(total, { highPrecision: true })}
      </div>
    </>
  );
};
