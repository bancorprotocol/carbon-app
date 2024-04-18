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
    <p className="text-14 rounded-t-10 rounded-b-4 pt-15 grid grid-cols-3 bg-black px-20 pb-12 text-white/60">
      <Tooltip element={`Price points denominated in ${quoteSymbol}`}>
        <b>Price ({quoteSymbol})</b>
      </Tooltip>
      <Tooltip
        element={`The amount of available ${baseSymbol} tokens in this price point`}
      >
        <b>Amount ({baseSymbol})</b>
      </Tooltip>
      <Tooltip
        element={`The available liquidity in this price point denominated in ${quoteSymbol}`}
      >
        <b className="text-right">Total</b>
      </Tooltip>
    </p>
  );
};
