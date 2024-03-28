import { Strategy, StrategyStatus } from 'libs/queries';
import { FC } from 'react';
import { getTooltipTextByStatus, statusText } from './utils';
import { ReactComponent as TooltipIcon } from 'assets/icons/tooltip.svg';
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg';
import {
  ManageButtonIcon,
  StrategyBlockManage,
} from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Link } from '@tanstack/react-router';
import { Token } from 'libs/tokens';
import { getLowestBits } from 'utils/helpers';

interface Props {
  strategy: Strategy;
  isExplorer?: boolean;
}

export const StrategyBlockHeader: FC<Props> = ({ strategy, isExplorer }) => {
  const { base, quote } = strategy;
  return (
    <header className="col-start-1 col-end-3 flex gap-16">
      <TokensOverlap
        // TODO fix token logo classes
        size={40}
        tokens={[base, quote]}
      />
      <div className="flex flex-1 flex-col">
        <h3 className="flex gap-6 text-18" data-testid="token-pair">
          <span>{base.symbol}</span>
          <span className="self-align-center text-secondary !text-16">/</span>
          <span>{quote.symbol}</span>
        </h3>
        <StrategySubtitle {...strategy} />
      </div>
      <div role="menubar" className="flex gap-8">
        <Link
          role="menuitem"
          to="/strategy/$id"
          params={{ id: strategy.id }}
          className="grid h-38 w-38 place-items-center rounded-6 border-2 border-background-800 hover:bg-white/10 active:bg-white/20"
        >
          <DashboardIcon className="h-16 w-16" />
        </Link>
        <StrategyBlockManage
          strategy={strategy}
          isExplorer={isExplorer}
          button={(attr) => <ManageButtonIcon {...attr} />}
        />
      </div>
    </header>
  );
};

interface StrategyTitleProps {
  base: Token;
  quote: Token;
}

export const StrategyTitle: FC<StrategyTitleProps> = ({ base, quote }) => {
  return (
    <>
      <span>{base.symbol}</span>
      <span className="self-align-center text-secondary !text-16">/</span>
      <span>{quote.symbol}</span>
    </>
  );
};

interface StrategySubtitleProps {
  id: string;
  status: StrategyStatus;
  isExplorer?: boolean;
}
export const StrategySubtitle: FC<StrategySubtitleProps> = (props) => {
  const { id, status, isExplorer } = props;
  return (
    <p className="flex items-center gap-8 text-12 text-white/60">
      <span>ID: {getLowestBits(id)}</span>
      <svg width="4" height="4" role="separator">
        <circle cx="2" cy="2" r="2" fill="currentcolor" />
      </svg>
      {status === 'active' && (
        <span data-testid="status" className="text-success">
          {statusText.active}
        </span>
      )}
      {status !== 'active' && (
        <Tooltip element={getTooltipTextByStatus(isExplorer, status)}>
          <span
            className="inline-flex items-center gap-4 text-error"
            data-testid="status"
          >
            {statusText.inactive}
            <TooltipIcon className="h-10 w-10 text-error" />
          </span>
        </Tooltip>
      )}
    </p>
  );
};
