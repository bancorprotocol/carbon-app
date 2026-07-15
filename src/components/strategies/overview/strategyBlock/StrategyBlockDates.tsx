import { formatGradientDate } from 'components/strategies/common/gradient/utils';
import { Order } from 'components/strategies/common/types';
import { isGradientOrder } from 'components/strategies/common/utils';
import { FC } from 'react';

interface Props {
  isBuy?: boolean;
  order: Order;
}
export const StrategyBlockDates: FC<Props> = ({ order, isBuy }) => {
  if (!isGradientOrder(order)) return;
  const textColor = isBuy ? 'text-buy' : 'text-sell';
  return (
    <table className="text-12">
      <thead className={textColor}>
        <th className="text-start font-normal">Start Date</th>
        <th className="text-start font-normal">End Date</th>
      </thead>
      <tbody>
        <tr>
          <td className="text-white/60">
            {formatGradientDate(order.startDate)}
          </td>
          <td className="text-white/60">{formatGradientDate(order.endDate)}</td>
        </tr>
      </tbody>
    </table>
  );
};
