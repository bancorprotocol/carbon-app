import { FC } from 'react';
import { prettifyNumber } from 'utils/helpers';
import BigNumber from 'bignumber.js';

type Props = {
  price: string;
  amount: string;
  buy?: boolean;
};

export const OrderBookWidgetRow: FC<Props> = (props) => {
  const price = props.buy ? props.price : new BigNumber(1).div(props.price);
  const amount = props.buy
    ? props.amount
    : new BigNumber(props.amount).div(price);
  const total = props.buy
    ? new BigNumber(amount).times(price)
    : new BigNumber(amount).times(price);

  return (
    <>
      <div className={`${props.buy ? 'text-green' : 'text-red'} py-4`}>
        {prettifyNumber(price)}
      </div>
      <div className={'py-4 text-white/80'}>{prettifyNumber(amount)}</div>
      <div className={'py-4 text-right text-white/80'}>
        {prettifyNumber(total)}
      </div>
    </>
  );
};
