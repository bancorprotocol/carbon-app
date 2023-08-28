import { FC, useState } from 'react';
import { Strategy, StrategyStatus } from 'libs/queries';
import { m, mItemVariant } from 'libs/motion';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { useTranslation } from 'libs/translations';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { cn } from 'utils/helpers';
import { getStatusText, getTooltipTextByStatus } from './utils';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { useBudgetWarning } from 'components/strategies/useBudgetWarning';
import { StrategyBlockRoi } from './StrategyBlockRoi';

interface Props {
  strategy: Strategy;
  className?: string;
  isExplorer?: boolean;
}

export const StrategyBlock: FC<Props> = ({
  strategy,
  className,
  isExplorer,
}) => {
  const { t } = useTranslation();
  const [manage, setManage] = useState(false);
  const showBudgetWarning = useBudgetWarning(
    strategy.base,
    strategy.quote,
    strategy.order0.balance,
    strategy.order1.balance
  );

  return (
    <m.div
      variants={mItemVariant}
      className={cn(
        strategy.status === StrategyStatus.Active ? 'bg-silver' : 'bg-content',
        'group space-y-20 rounded-10 p-20',
        className
      )}
    >
      <div className="flex justify-between">
        <div className={'flex space-s-10'}>
          <TokensOverlap
            // TODO fix token logo classes
            className="h-40 w-40"
            tokens={[strategy.base, strategy.quote]}
          />
          <div>
            {
              <div className="flex gap-6">
                <span>{strategy.base.symbol}</span>
                <div className="text-secondary !text-16">/</div>
                <span>{strategy.quote.symbol}</span>
              </div>
            }
            <div className="text-secondary flex gap-10">
              {t('pages.strategyOverview.card.title', {
                id: strategy.idDisplay,
              })}
              <div className="flex gap-10">
                <Tooltip element={getTooltipTextByStatus(strategy.status, t)}>
                  <span
                    className={`${
                      strategy.status === StrategyStatus.Active
                        ? 'text-green'
                        : 'text-red'
                    } `}
                  >
                    {getStatusText(strategy.status, t)}
                  </span>
                </Tooltip>
                {showBudgetWarning && (
                  <WarningWithTooltip tooltipContent="Low balance might be skipped due to gas considerations" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StrategyBlockRoi roi={strategy.roi} />
      <StrategyBlockBuySell buy strategy={strategy} />
      <StrategyBlockBuySell strategy={strategy} />
      <StrategyBlockManage
        manage={manage}
        setManage={setManage}
        strategy={strategy}
        isExplorer={isExplorer}
      />
    </m.div>
  );
};
