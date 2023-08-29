import { Tooltip } from 'components/common/tooltip/Tooltip';
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
      <Tooltip element={`Price points denominated in ${quoteSymbol}`}>
        <div>Price ({quoteSymbol})</div>
      </Tooltip>
      <Tooltip
        element={`The amount of available ${baseSymbol} tokens in this price point`}
      >
        <div>Amount ({baseSymbol})</div>
      </Tooltip>
      <Tooltip
        element={`The available liquidity in this price point denominated in ${quoteSymbol}`}
      >
        <div className={'text-end'}>Total</div>
      </Tooltip>
    </div>
  );
};
