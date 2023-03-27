import { Tooltip } from 'components/common/tooltip/Tooltip';
import { StrategyStatus } from 'libs/queries';
import { FC } from 'react';
import { getStatusText, getTooltipTextByStatus } from './utils';
import { ReactComponent as IconActiveBell } from 'assets/icons/activeBell.svg';
import { Button } from 'components/common/button';

export const StrategyBlockOrderStatus: FC<{
  status: StrategyStatus;
  strategyId: string;
}> = ({ status, strategyId }) => {
  return (
    <div className="flex justify-between rounded-8 border border-emphasis p-15">
      <div>
        <div className="text-secondary text-14">Order Status</div>
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
      {status === StrategyStatus.Active && (
        <Tooltip
          trigger="click"
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
                  window.open(
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
  );
};
