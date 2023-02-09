import { FC } from 'react';
import { OrderRow } from 'libs/queries/sdk/orderBook';
import { prettifyNumber } from 'utils/helpers';
import { Tooltip } from 'components/common/tooltip';

type Props = OrderRow & {
  buy?: boolean;
};

export const OrderBookWidgetRow: FC<Props> = ({ buy, rate, amount, total }) => {
  return (
    <>
      <div className={`${buy ? 'text-green' : 'text-red'} py-4`}>
        <Tooltip
          element={prettifyNumber(rate, { highPrecision: true })}
          className={'min-w-fit'}
          placement={'top-start'}
        >
          {rate}
        </Tooltip>
      </div>
      <div className={'flex py-4 text-white/80'}>
        <Tooltip
          element={prettifyNumber(amount, { highPrecision: true })}
          className={'min-w-fit'}
          placement={'top-start'}
        >
          {amount}
        </Tooltip>
      </div>
      <div className={'py-4 text-right text-white/80'}>
        <Tooltip
          element={prettifyNumber(total, { highPrecision: true })}
          className={'min-w-fit'}
          placement={'top-end'}
        >
          {total}
        </Tooltip>
      </div>
    </>
  );
};
