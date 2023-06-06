import { FC } from 'react';
import { StrategyStatus } from 'libs/queries';
import { useTranslation } from 'libs/translations';
import { StrategyEditEventType } from 'services/events/types';
import { carbonEvents } from 'services/events';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Button } from 'components/common/button';
import { ReactComponent as IconActiveBell } from 'assets/icons/activeBell.svg';
import { getStatusText, getTooltipTextByStatus } from './utils';

export const StrategyBlockOrderStatus: FC<{
  status: StrategyStatus;
  strategyId: string;
  showBudgetWarning?: boolean;
  strategyEventData: StrategyEditEventType;
}> = ({ status, strategyId, strategyEventData, showBudgetWarning = false }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between rounded-8 border border-emphasis p-15">
      <div>
        <div className="flex gap-6">
          <div className="text-secondary text-14">
            {t('strategy.overview.block.orderStatus')}
          </div>
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
                <div className="text-14">
                  {t('strategy.overview.block.notification.title')}
                </div>
                <div className="text-12 text-white/80">
                  {t('strategy.overview.block.notification.content1')}
                </div>
                <div className="text-12 text-white/80">
                  {t('strategy.overview.block.notification.content2')}{' '}
                  <span className="font-weight-500">hal.xyz</span>
                </div>
                <Button
                  className="mt-5 flex items-center justify-center"
                  fullWidth
                  variant={'success'}
                  onClick={() => {
                    carbonEvents.strategyEdit.strategyManageNotificationClick(
                      strategyEventData
                    );
                    window?.open(
                      `https://app.hal.xyz/recipes/carbon-track-strategy-updated?strategy_id=${strategyId}`,
                      '_blank'
                    );
                  }}
                >
                  {t('strategy.overview.block.notification.actionButton')}
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
