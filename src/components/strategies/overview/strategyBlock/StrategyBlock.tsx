import { FC, useState } from 'react';
import { Strategy } from 'libs/queries';
import { m, mItemVariant } from 'libs/motion';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { cn } from 'utils/helpers';
import { getTooltipTextByStatus, statusText } from './utils';
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
  const [manage, setManage] = useState(false);
  const { base, quote } = strategy;
  const showBudgetWarning = useBudgetWarning(
    base,
    quote,
    strategy.order0.balance,
    strategy.order1.balance
  );

  return (
    <m.li
      variants={mItemVariant}
      className={cn(
        strategy.status === 'active' ? 'bg-silver' : 'bg-content',
        'group space-y-20 rounded-10 p-20',
        className
      )}
    >
      <header className="flex justify-between">
        <div className={'flex space-x-10'}>
          <TokensOverlap
            // TODO fix token logo classes
            className="h-40 w-40"
            tokens={[base, quote]}
          />
          <div>
            <h3 className="flex gap-6" data-testid="token-pair">
              <span>{base.symbol}</span>
              <span className="text-secondary !text-16">/</span>
              <span>{quote.symbol}</span>
            </h3>
            <div className="text-secondary flex gap-10">
              ID: {strategy.idDisplay}
              <div className="flex gap-10">
                <Tooltip
                  element={getTooltipTextByStatus(isExplorer, strategy.status)}
                >
                  <span
                    className={
                      strategy.status === 'active' ? 'text-green' : 'text-red'
                    }
                    data-testid="status"
                  >
                    {statusText[strategy.status]}
                  </span>
                </Tooltip>
                {showBudgetWarning && (
                  <WarningWithTooltip tooltipContent="Low balance might be skipped due to gas considerations" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <StrategyBlockRoi roi={strategy.roi} />
      <StrategyBlockBuySell buy strategy={strategy} />
      <StrategyBlockBuySell strategy={strategy} />
      <StrategyBlockManage
        manage={manage}
        setManage={setManage}
        strategy={strategy}
        isExplorer={isExplorer}
      />
    </m.li>
  );
};
