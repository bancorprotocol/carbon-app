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
  return (
    <>
      <div
        className={`${buy ? 'text-green' : 'text-red'} overflow-x-hidden py-4`}
      >
        <Tooltip element={`${rate} ${quote.symbol}`}>
          <span>{prettifyNumber(rate, { highPrecision: true })}</span>
        </Tooltip>
      </div>

      <div className={'overflow-x-hidden py-4 text-right text-white/80'}>
        <Tooltip element={`${amount} ${base.symbol}`}>
          <span>{prettifyNumber(amount, { highPrecision: true })}</span>
        </Tooltip>
      </div>

      <div className={'overflow-x-hidden py-4 text-right text-white/80'}>
        <Tooltip element={`${total} ${quote.symbol}`}>
          <span>{prettifyNumber(total, { highPrecision: true })}</span>
        </Tooltip>
      </div>
    </>
  );
};
