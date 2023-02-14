import { Tooltip } from 'components/common/tooltip/Tooltip';
import { StrategyStatus } from 'libs/queries';
import { FC } from 'react';
import { getStatusText, getTooltipTextByStatus } from './utils';

export const StrategyBlockOrderStatus: FC<{ status: StrategyStatus }> = ({
  status,
}) => {
  return (
    <div className="rounded-8 border border-emphasis p-15">
      <div className="text-secondary text-14">Order Status</div>
      <div>
        <Tooltip element={getTooltipTextByStatus(status)}>
          <div
            className={`${
              status === StrategyStatus.Active ? 'text-green' : 'text-red'
            } `}
          >
            {getStatusText(status)}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
