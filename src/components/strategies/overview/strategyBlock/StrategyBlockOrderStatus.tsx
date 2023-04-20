import { Tooltip } from 'components/common/tooltip/Tooltip';
import { StrategyStatus } from 'libs/queries';
import { FC } from 'react';
import { getStatusText, getTooltipTextByStatus } from './utils';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';

export const StrategyBlockOrderStatus: FC<{
  status: StrategyStatus;
  showBudgetWarning?: boolean;
}> = ({ status, showBudgetWarning = false }) => {
  return (
    <div className="flex justify-between rounded-8 border border-emphasis p-15">
      <div>
        <div className="flex gap-6">
          <div className="text-secondary text-14">Order Status</div>
          {showBudgetWarning && (
            <WarningWithTooltip tooltipContent="Low balance might be skipped due to gas considerations" />
          )}
        </div>
        <div>
          <Tooltip element={getTooltipTextByStatus(status)}>
            <span
              className={`${
                status === StrategyStatus.Active ? 'text-green' : 'text-red'
              } `}
            >
              {getStatusText(status)}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
