import { FC, useState } from 'react';
import { Strategy } from 'libs/queries';
import { m, mItemVariant } from 'libs/motion';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyBlockBuySell } from 'components/strategies/overview/strategyBlock/StrategyBlockBuySell';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { cn } from 'utils/helpers';
import { getTooltipTextByStatus, statusText } from './utils';
import { StrategyBlockRoi } from './StrategyBlockRoi';
import { ReactComponent as TooltipIcon } from 'assets/icons/tooltip.svg';

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

  return (
    <m.li
      variants={mItemVariant}
      className={cn(
        'grid grid-cols-2 grid-rows-[auto_auto_auto] gap-16 rounded-10 bg-silver p-24',
        className
      )}
    >
      <header className="col-start-1 col-end-3 flex gap-16">
        <TokensOverlap
          // TODO fix token logo classes
          className="h-40 w-40"
          tokens={[base, quote]}
        />
        <div className="mr-auto flex flex-col">
          <h3 className="flex gap-6 text-18" data-testid="token-pair">
            <span>{base.symbol}</span>
            <span className="self-align-center text-secondary !text-16">/</span>
            <span>{quote.symbol}</span>
          </h3>
          <p className="flex items-center gap-8 text-12 text-white/60">
            <span className="font-mono">ID: {strategy.idDisplay}</span>
            <svg width="4" height="4" role="separator">
              <circle cx="2" cy="2" r="2" fill="currentcolor" />
            </svg>
            {strategy.status === 'active' && (
              <span data-testid="status" className="text-green">
                {statusText.active}
              </span>
            )}
            {strategy.status !== 'active' && (
              <Tooltip
                element={getTooltipTextByStatus(isExplorer, strategy.status)}
              >
                <span
                  className="inline-flex items-center gap-4 text-red"
                  data-testid="status"
                >
                  {statusText.inactive}
                  <TooltipIcon className="h-10 w-10 text-red" />
                </span>
              </Tooltip>
            )}
          </p>
        </div>
        <ul role="menubar">
          <li role="none">
            <StrategyBlockManage
              manage={manage}
              setManage={setManage}
              strategy={strategy}
              isExplorer={isExplorer}
            />
          </li>
        </ul>
      </header>

      <StrategyBlockRoi roi={strategy.roi} />
      <div className="rounded-8 border-2 border-emphasis"></div>
      <StrategyBlockBuySell buy strategy={strategy} />
      <StrategyBlockBuySell strategy={strategy} />
    </m.li>
  );
};
