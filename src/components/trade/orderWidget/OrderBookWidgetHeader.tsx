import { FC } from 'react';

type Props = {
  baseSymbol: string;
  quoteSymbol: string;
};

export const OrderBookWidgetHeader: FC<Props> = ({
  baseSymbol,
  quoteSymbol,
}) => {
  return (
    <div
      className={
        'text-secondary bg-body grid grid-cols-3 rounded-t-10 rounded-b-4 px-20 pt-15 pb-12'
      }
    >
      <div>Price ({quoteSymbol})</div>
      <div>Amount ({baseSymbol})</div>
      <div className={'text-right'}>Total</div>
    </div>
  );
};
