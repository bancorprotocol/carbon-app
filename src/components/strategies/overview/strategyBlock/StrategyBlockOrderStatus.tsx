import { Tooltip } from 'components/common/tooltip/Tooltip';
import { StrategyStatus } from 'libs/queries';
import { FC } from 'react';
import { getStatusText, getTooltipTextByStatus } from './utils';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { Button } from 'components/common/button';
import { ReactComponent as IconActiveBell } from 'assets/icons/activeBell.svg';

export const StrategyBlockOrderStatus: FC<{
  status: StrategyStatus;
  strategyId: string;
  showBudgetWarning?: boolean;
}> = ({ status, strategyId, showBudgetWarning = false }) => {
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
      <div>
        {status === StrategyStatus.Active && (
          <Tooltip
            delay={0}
            element={
              <div className="flex flex-col gap-10">
                <div className="text-14">Strategy Notification</div>
                <div className="text-12 text-white/80">
                  You can set notification to be informed every time some trade
                  against your strategy.
                </div>
                <div className="text-12 text-white/80">
                  It is a 3rd party service managed by{' '}
                  <span className="font-weight-500">Hal.xyz</span>
                </div>
                <Button
                  className="mt-5 flex items-center justify-center"
                  fullWidth
                  variant={'success'}
                  onClick={() =>
                    window?.open(
                      `https://app.hal.xyz/recipes/carbon-strategy?strategyID=${strategyId}`,
                      '_blank'
                    )
                  }
                >
                  Manage Notification
                </Button>
              </div>
            }
          >
            <span
              className={`flex h-40 w-40 items-center justify-center rounded-8 border-2 border-emphasis bg-emphasis transition duration-300 ease-in-out hover:border-grey3 md:opacity-0 md:group-hover:opacity-100 `}
            >
              <IconActiveBell className="h-15 w-15" />
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
