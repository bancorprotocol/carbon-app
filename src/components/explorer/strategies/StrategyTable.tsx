import { Link, useMatch } from '@tanstack/react-router';
import { PairLogoName } from 'components/common/DisplayPair';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { FC, useId, useMemo, useState } from 'react';
import { StrategyStatusTag } from 'components/strategies/overview/strategyBlock/StrategyBlockHeader';
import { cn, getUsdPrice, tokenAmount } from 'utils/helpers';
import { StrategyGraph } from 'components/strategies/overview/strategyBlock/StrategyGraph';
import DashboardIcon from 'assets/icons/dashboard.svg?react';
import {
  ManageButtonIcon,
  StrategyBlockManage,
} from 'components/strategies/overview/strategyBlock/StrategyBlockManage';
import { FiatPrice } from 'components/common/FiatPrice';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useEditToDisposableSell } from 'components/strategies/edit/utils';
import { isDisposableStrategy } from 'components/strategies/common/utils';
import { useIsStrategyOwner } from 'hooks/useIsStrategyOwner';
import { Paginator } from 'components/common/table/Paginator';
import { clamp } from 'utils/helpers/operators';

interface Props {
  className?: string;
  strategies: AnyStrategyWithFiat[];
}
export const StrategyTable: FC<Props> = ({ strategies, className }) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const maxOffset = useMemo(() => {
    return clamp(0, strategies.length - limit, offset);
  }, [offset, limit, strategies.length]);

  return (
    <table className={cn('table', className)}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Token Pair</th>
          {/* @todo(gradient) */}
          {/* <th>Type</th> */}
          <th>Status</th>
          <th>Trades</th>
          <th>Total Budget</th>
          <th>Buy Budget</th>
          <th>Sell Budget</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {strategies.slice(maxOffset, maxOffset + limit).map((strategy) => (
          <StrategyRow strategy={strategy} key={strategy.id} />
        ))}
      </tbody>
      <Paginator
        size={strategies.length}
        offset={maxOffset}
        setOffset={setOffset}
        limit={limit}
        setLimit={setLimit}
      />
    </table>
  );
};

interface RowProps {
  strategy: AnyStrategyWithFiat;
}
const StrategyRow: FC<RowProps> = ({ strategy }) => {
  const id = useId();
  const { base, quote, status, buy, sell } = strategy;
  const toDisposableSell = useEditToDisposableSell(strategy);
  const isOwn = useIsStrategyOwner(strategy.id);
  const isExplorer = !!useMatch({ from: '/explore', shouldThrow: false });
  const totalBalance = strategy.fiatBudget.total;
  const disableEdit =
    !isOwn || isDisposableStrategy(strategy) || strategy.status !== 'active';

  return (
    <tr key={id} id={id} className="h-[85px]">
      <td>{strategy.idDisplay}</td>
      <td>
        <p className="flex items-center gap-8">
          <PairLogoName pair={{ baseToken: base, quoteToken: quote }} />
        </p>
      </td>
      {/* @todo(gradient) */}
      {/* <td>
        <StrategyTypeIcon isGradient={isGradientStrategy(strategy)} />
      </td> */}
      <td>
        <StrategyStatusTag status={status} isExplorer={isExplorer} />
      </td>
      <td>{strategy.tradeCount}</td>
      <td>
        <Tooltip element={getUsdPrice(totalBalance)}>
          <p>{getUsdPrice(totalBalance, { abbreviate: true })}</p>
        </Tooltip>
      </td>
      <td>
        <div className="grid">
          <Tooltip element={tokenAmount(buy.budget, quote)}>
            <span className="text-nowrap">
              {tokenAmount(buy.budget, quote, { abbreviate: true })}
            </span>
          </Tooltip>
          <FiatPrice
            token={quote}
            amount={buy.budget}
            className="text-12 text-white/60"
          />
        </div>
      </td>
      <td>
        <div className="grid">
          <Tooltip element={tokenAmount(sell.budget, base)}>
            <span className="text-nowrap">
              {tokenAmount(sell.budget, base, { abbreviate: true })}
            </span>
          </Tooltip>
          <FiatPrice
            token={base}
            amount={sell.budget}
            className="text-12 text-white/60"
          />
        </div>
      </td>
      <td className="w-[250px] py-0!">
        <StrategyGraph strategy={strategy} />
      </td>
      <td>
        <div role="menubar" className="flex gap-8">
          <Link
            role="menuitem"
            to="/strategy/$id"
            params={{ id: strategy.id }}
            className="size-38 rounded-sm btn-on-surface grid place-items-center p-0"
          >
            <DashboardIcon className="size-16" />
          </Link>
          <StrategyBlockManage
            strategy={strategy}
            button={(attr) => <ManageButtonIcon {...attr} />}
          />
        </div>
      </td>
    </tr>
  );
};
