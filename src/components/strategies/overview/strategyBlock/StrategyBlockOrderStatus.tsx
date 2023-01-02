import { StrategyStatus } from 'libs/queries';
import { FC } from 'react';

export const StrategyBlockOrderStatus: FC<{ status: StrategyStatus }> = ({
  status,
}) => {
  return (
    <div className="rounded-8 border border-emphasis p-15">
      <div className="text-secondary text-14">Order Status</div>
      <div
        className={`${
          status === StrategyStatus.Active
            ? 'text-success-500'
            : 'text-error-500'
        } `}
      >
        {status === StrategyStatus.Active
          ? 'Active'
          : status === StrategyStatus.NoBudget
          ? 'No Budget · Inactive'
          : status === StrategyStatus.OffCurve
          ? 'Off Curve · Inactive'
          : 'Inactive'}
      </div>
    </div>
  );
};
