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
import { getLowestBits } from 'utils/helpers';
import { PairName } from 'components/common/DisplayPair';

interface Props {
  strategy: Strategy;
  isExplorer?: boolean;
}

export const StrategyBlockHeader: FC<Props> = ({ strategy, isExplorer }) => {
  const { base, quote } = strategy;
  return (
    <header className="flex gap-16">
      <TokensOverlap
        // TODO fix token logo classes
        size={40}
        tokens={[base, quote]}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <h3 className="text-18 flex gap-6" data-testid="token-pair">
          <PairName baseToken={base} quoteToken={quote} />
        </h3>
        <StrategySubtitle {...strategy} isExplorer={isExplorer} />
      </div>
      <div role="menubar" className="flex gap-8">
        <Link
          role="menuitem"
          to="/strategy/$id"
          params={{ id: strategy.id }}
          className="size-38 rounded-6 border-background-800 grid place-items-center border-2 hover:bg-white/10 active:bg-white/20"
        >
          <DashboardIcon className="size-16" />
        </Link>
        <StrategyBlockManage
          strategy={strategy}
          button={(attr) => <ManageButtonIcon {...attr} />}
        />
      </div>
    </header>
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
    <p className="text-12 flex items-center gap-8 text-white/60">
      <span>ID: {getLowestBits(id)}</span>
      <svg width="4" height="4" role="separator">
        <circle cx="2" cy="2" r="2" fill="currentcolor" />
      </svg>
      <StrategyStatusTag status={status} isExplorer={isExplorer} />
    </p>
  );
};

export const StrategyStatusTag: FC<{
  status: StrategyStatus;
  isExplorer?: boolean;
}> = (props) => {
  const { status, isExplorer } = props;
  if (status === 'active') {
    return (
      <span data-testid="status" className="text-success">
        {statusText.active}
      </span>
    );
  } else {
    return (
      <Tooltip element={getTooltipTextByStatus(isExplorer, status)}>
        <span
          className="text-error inline-flex items-center gap-4"
          data-testid="status"
        >
          {statusText.inactive}
          <TooltipIcon className="text-error size-10" />
        </span>
      </Tooltip>
    );
  }
};
