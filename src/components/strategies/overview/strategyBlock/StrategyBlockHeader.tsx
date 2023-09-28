import { Strategy } from 'libs/queries';
import { FC, useState } from 'react';
import { getTooltipTextByStatus, statusText } from './utils';
import { ReactComponent as TooltipIcon } from 'assets/icons/tooltip.svg';
import { StrategyBlockManage } from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokensOverlap } from 'components/common/tokensOverlap';

interface Props {
  strategy: Strategy;
  isExplorer?: boolean;
}

export const StrategyBlockHeader: FC<Props> = ({ strategy, isExplorer }) => {
  const [manage, setManage] = useState(false);
  const { base, quote } = strategy;
  return (
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
  );
};
