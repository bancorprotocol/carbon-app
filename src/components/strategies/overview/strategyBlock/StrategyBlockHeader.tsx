import {
  AnyStrategy,
  StrategyStatus,
} from 'components/strategies/common/types';
import { FC } from 'react';
import { getTooltipTextByStatus, statusText } from './utils';
import DashboardIcon from 'assets/icons/dashboard.svg?react';
import {
  ManageButtonIcon,
  StrategyBlockManage,
} from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { PairName } from 'components/common/DisplayPair';
import { isGradientStrategy } from 'components/strategies/common/utils';
import { Link } from '@tanstack/react-router';

interface Props {
  strategy: AnyStrategy;
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
        <StrategySubtitle
          id={strategy.idDisplay}
          status={strategy.status}
          isExplorer={isExplorer}
          isGradient={isGradientStrategy(strategy)}
        />
      </div>
      <div role="menubar" className="flex gap-8">
        <Link
          role="menuitem"
          to="/strategy/$id"
          params={{ id: strategy.id }}
          className="btn-on-surface size-38 rounded-sm grid place-items-center p-0"
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
  isGradient: boolean;
  isExplorer?: boolean;
}
export const StrategySubtitle: FC<StrategySubtitleProps> = (props) => {
  const { id, status, isExplorer } = props;
  return (
    <p className="text-12 flex items-center gap-8 text-main-0/60">
      {id}
      <svg width="4" height="4" role="separator">
        <circle cx="2" cy="2" r="2" fill="currentcolor" />
      </svg>
      {/* @todo(gradient) */}
      {/* <StrategyTypeIcon isGradient={isGradient} />
      <svg width="4" height="4" role="separator">
        <circle cx="2" cy="2" r="2" fill="currentcolor" />
      </svg> */}
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
        </span>
      </Tooltip>
    );
  }
};
