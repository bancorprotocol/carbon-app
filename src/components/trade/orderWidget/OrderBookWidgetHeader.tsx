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
        <span>Price ({quoteSymbol})</span>
      </Tooltip>
      <Tooltip
        element={`The amount of available ${baseSymbol} tokens in this price point`}
      >
        <span>Amount ({baseSymbol})</span>
      </Tooltip>
      <Tooltip
        element={`The available liquidity in this price point denominated in ${quoteSymbol}`}
      >
        <span className="text-right">Total</span>
      </Tooltip>
    </p>
  );
};
