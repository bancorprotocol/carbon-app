import { Link, useMatch } from '@tanstack/react-router';
import { PairLogoName } from 'components/common/DisplayPair';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { FC, useId } from 'react';
import { StrategyStatusTag } from './strategyBlock/StrategyBlockHeader';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { prettifyNumber, tokenAmount } from 'utils/helpers';
import { StrategyGraph } from './strategyBlock/StrategyGraph';
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg';
import {
  ManageButtonIcon,
  StrategyBlockManage,
} from './strategyBlock/StrategyBlockManage';
import { FiatPrice } from 'components/common/FiatPrice';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useEditToDisposableSell } from '../edit/utils';
import { isDisposableStrategy } from '../common/utils';
import { useIsStrategyOwner } from 'hooks/useIsStrategyOwner';
import styles from './StrategyContent.module.css';

interface Props {
  strategies: AnyStrategyWithFiat[];
}
export const StrategyTable: FC<Props> = ({ strategies }) => {
  return (
    <table className={styles.strategyTable}>
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
        {strategies.map((strategy) => (
          <StrategyRow strategy={strategy} key={strategy.id} />
        ))}
      </tbody>
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
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();
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
        <Tooltip element={prettifyNumber(totalBalance, { currentCurrency })}>
          <p>
            {prettifyNumber(totalBalance, {
              currentCurrency,
              abbreviate: true,
            })}
          </p>
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
      <td className="w-[250px]">
        <StrategyGraph strategy={strategy} />
      </td>
      <td>
        <div role="menubar" className="flex gap-8">
          <Link
            role="menuitem"
            to="/strategy/$id"
            params={{ id: strategy.id }}
            className="size-38 rounded-sm border-background-800 grid place-items-center border-2 hover:bg-white/10 active:bg-white/20"
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
