import { FC } from 'react';
import { prettifyNumber } from 'utils/helpers';
import BigNumber from 'bignumber.js';

type Props = {
  price: string;
  amount: string;
  buy?: boolean;
};

export const OrderBookWidgetRow: FC<Props> = ({ price, amount, buy }) => {
  const total = new BigNumber(price).times(amount);

  return (
    <>
      <div className={`${buy ? 'text-green' : 'text-red'} py-4`}>
        {prettifyNumber(price)}
      </div>
      <div className={'py-4'}>{prettifyNumber(amount)}</div>
      <div className={'py-4'}>{prettifyNumber(total)}</div>
    </>
  );
};
