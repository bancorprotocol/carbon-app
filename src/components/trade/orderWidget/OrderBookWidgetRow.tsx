import { FC } from 'react';
import { OrderRow } from 'libs/queries/sdk/orderBook';
import { prettifyNumber } from 'utils/helpers';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';

type Props = OrderRow & {
  buy?: boolean;
  base: Token;
  quote: Token;
};

export const OrderBookWidgetRow: FC<Props> = ({
  buy,
  rate,
  amount,
  total,
  base,
  quote,
}) => {
  const baseOptions = { highPrecision: true, decimals: base.decimals };
  const quoteOptions = { highPrecision: true, decimals: quote.decimals };
  const rowOptions = { decimals: 6 };
  return (
    <>
      <div
        className={`${buy ? 'text-buy' : 'text-sell'} overflow-x-hidden py-4`}
      >
        <Tooltip
          element={`${prettifyNumber(rate, quoteOptions)} ${quote.symbol}`}
        >
          <span>{prettifyNumber(rate, rowOptions)}</span>
        </Tooltip>
      </div>

      <div className="overflow-x-hidden py-4 text-right text-white/80">
        <Tooltip
          element={`${prettifyNumber(amount, baseOptions)} ${base.symbol}`}
        >
          <span>{prettifyNumber(amount, rowOptions)}</span>
        </Tooltip>
      </div>

      <div className="overflow-x-hidden py-4 text-right text-white/80">
        <Tooltip
          element={`${prettifyNumber(total, quoteOptions)} ${quote.symbol}`}
        >
          <span>{prettifyNumber(total, rowOptions)}</span>
        </Tooltip>
      </div>
    </>
  );
};
