import { FC } from 'react';
import { OrderRow } from 'libs/queries/sdk/orderBook';
import { prettifyNumber } from 'utils/helpers';
import { Tooltip } from 'components/common/tooltip/Tooltip';

type Props = OrderRow & {
  buy?: boolean;
};

export const OrderBookWidgetRow: FC<Props> = ({ buy, rate, amount, total }) => {
  return (
    <>
      <div
        className={`${buy ? 'text-green' : 'text-red'} overflow-x-hidden py-4`}
      >
        <Tooltip element={rate}>
          <span>{prettifyNumber(rate, { highPrecision: true })}</span>
        </Tooltip>
      </div>

      <div className={'overflow-x-hidden py-4 text-right text-white/80'}>
        <Tooltip element={amount}>
          <span>{prettifyNumber(amount, { highPrecision: true })}</span>
        </Tooltip>
      </div>

      <div className={'overflow-x-hidden py-4 text-right text-white/80'}>
        <Tooltip element={total}>
          <span>{prettifyNumber(total, { highPrecision: true })}</span>
        </Tooltip>
      </div>
    </>
  );
};
