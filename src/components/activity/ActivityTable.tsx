import { ChangeEvent, FC } from 'react';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Activity, ActivityAction } from 'libs/queries/extApi/activity';
import { NewTabLink } from 'libs/routing';
import { cn, getLowestBits, shortAddress, tokenAmount } from 'utils/helpers';
import { getExplorerLink } from 'utils/blockExplorer';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconDelete } from 'assets/icons/delete.svg';
import { ReactComponent as IconTransfer } from 'assets/icons/transfer.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { activityActionName, activityDescription } from './utils';
import { usePagination } from 'hooks/useList';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import style from './ActivityTable.module.css';

interface ActivityTableProps {
  activities: Activity[];
  hideIds?: boolean;
}

const thStyle = cn(
  'text-start font-weight-400 py-16',
  'first:text-start first:px-24',
  'last:px-24 last:text-end'
);

export const ActivityTable: FC<ActivityTableProps> = (props) => {
  const { activities, hideIds = false } = props;
  return (
    <table className={cn('w-full border-collapse', style.table)}>
      <thead>
        <tr className="border-y border-background-800 font-mono text-14 text-white/60">
          {!hideIds && <th className={thStyle}>ID</th>}
          <th className={thStyle} colSpan={2}>
            Action
          </th>
          <th className={thStyle}>Buy Budget</th>
          <th className={thStyle}>Sell Budget</th>
          <th className={thStyle}>Date</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity, i) => {
          const key = `${activity.txHash}-${activity.action}-${i}`;
          return (
            <ActivityRow
              key={key}
              activity={activity}
              hideIds={hideIds}
              index={i}
            />
          );
        })}
      </tbody>
      <tfoot>
        <ActivityPaginator />
      </tfoot>
    </table>
  );
};

const dateOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};
const budgetColor = (budget?: string) => {
  if (!budget) return '';
  return new SafeDecimal(budget).isPositive() ? 'text-buy' : 'text-sell';
};
interface ActivityRowProps {
  activity: Activity;
  hideIds: boolean;
  index: number;
}
const ActivityRow: FC<ActivityRowProps> = ({ activity, hideIds, index }) => {
  const { strategy, changes } = activity;
  const { base, quote } = strategy;
  const date = new Date(activity.date).toLocaleDateString('en', dateOptions);
  return (
    <>
      <tr className="text-14" style={{ animationDelay: `${index * 50}ms` }}>
        {!hideIds && (
          <td rowSpan={2} className="py-12 first:px-24">
            <div className="inline-flex items-center gap-8 rounded-full bg-background-800 p-8">
              <span className="lineHeight-4">{getLowestBits(strategy.id)}</span>
              <TokensOverlap tokens={[base, quote]} size={16} />
            </div>
          </td>
        )}
        <td rowSpan={2} className="py-12 first:px-24">
          <div
            className={cn(
              'mr-8 grid h-32 w-32 place-items-center rounded-full',
              iconColor(activity.action)
            )}
          >
            <ActionIcon action={activity.action} />
          </div>
        </td>
        <td className="pt-12 align-bottom font-weight-500">
          {activityActionName[activity.action]}
        </td>
        <td className="pt-12 align-bottom">
          {tokenAmount(strategy.buy.budget, base)}
        </td>
        <td className="pt-12 align-bottom">
          {tokenAmount(strategy.sell.budget, quote)}
        </td>
        <td className="pt-12 text-end align-bottom font-mono last:px-24">
          {date}
        </td>
      </tr>
      <tr
        className="font-mono text-12 text-white/60"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* ID */}
        {/* Action Icon */}
        <td className="pb-12 align-top">{activityDescription(activity)}</td>
        <td className={cn('pb-12 align-top', budgetColor(changes.buy?.budget))}>
          <BudgetChange budget={changes.buy?.budget} token={base} />
        </td>
        <td
          className={cn('pb-12 align-top', budgetColor(changes.sell?.budget))}
        >
          <BudgetChange budget={changes.sell?.budget} token={quote} />
        </td>
        <td className="pb-12 align-top last:px-24">
          <p className="flex justify-end gap-8 align-bottom">
            {shortAddress(activity.txHash)}
            <NewTabLink
              aria-label="See transaction on block explorer"
              to={getExplorerLink('tx', activity.txHash)}
            >
              <IconLink className="h-14 text-primary" />
            </NewTabLink>
          </p>
        </td>
      </tr>
    </>
  );
};

const BudgetChange = ({ budget, token }: { budget?: string; token: Token }) => {
  if (!budget) return '...';
  const value = new SafeDecimal(budget);
  return value.isNegative()
    ? tokenAmount(budget, token)
    : `+${tokenAmount(budget, token)}`;
};

const ActivityPaginator = () => {
  const {
    limit,
    offset,
    currentPage,
    maxPage,
    setLimit,
    firstPage,
    lastPage,
    previousPage,
    nextPage,
  } = usePagination();

  const changeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  return (
    <tr className="border-t border-background-800 text-14 text-white/80">
      <td className="px-24 py-16" colSpan={3}>
        <div className="flex items-center gap-8">
          <label>Show results</label>
          <select
            className="rounded-full border-2 border-background-800 bg-background-900 px-12 py-8"
            name="limit"
            onChange={changeLimit}
            value={limit}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </td>
      <td className="px-24 py-16 text-end" colSpan={3}>
        <div role="group" className="flex justify-end gap-8 font-mono">
          <button
            onClick={firstPage}
            disabled={!offset}
            aria-label="First page"
            className="disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={previousPage}
            disabled={!offset}
            aria-label="Previous page"
            className="p-8 disabled:opacity-50"
          >
            <IconChevronLeft className="h-12" />
          </button>
          <p
            className="flex gap-8 rounded-full border-2 border-background-800 px-12 py-8"
            aria-label="page position"
          >
            <span className="text-white">{currentPage}</span>
            <span role="separator">/</span>
            <span className="text-white">{maxPage}</span>
          </p>
          <button
            onClick={nextPage}
            disabled={currentPage === maxPage}
            aria-label="Next page"
            className="p-8 disabled:opacity-50"
          >
            <IconChevronLeft className="h-12 rotate-180" />
          </button>
          <button
            onClick={lastPage}
            disabled={currentPage === maxPage}
            aria-label="Last page"
            className="disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </td>
    </tr>
  );
};

interface ActionIconProps {
  action: ActivityAction;
}
const iconColor = (action: ActivityAction) => {
  if (action === 'buy') return `bg-buy/10 text-buy`;
  if (action === 'sell') return `bg-sell/10 text-sell`;
  if (action === 'create') return `bg-success/10 text-success`;
  if (action === 'delete') return `bg-error/10 text-error`;
  return `bg-white/10 text-white`;
};

const ActionIcon: FC<ActionIconProps> = ({ action }) => {
  if (action === 'create') return <IconCheck className="h-16 w-16" />;
  if (action === 'transfer') return <IconTransfer className="h-16 w-16" />;
  if (action === 'editPrice') return <IconEdit className="h-16 w-16" />;
  if (action === 'delete') return <IconDelete className="h-16 w-16" />;
  if (action === 'pause') return <IconPause className="h-16 w-16" />;
  if (action === 'deposit') return <IconDeposit className="h-16 w-16" />;
  if (action === 'withdraw') return <IconWithdraw className="h-16 w-16" />;
  if (action === 'buy')
    return <IconArrowDown className="h-16 w-16 rotate-[-60deg]" />;
  return <IconArrowDown className="h-16 w-16 rotate-[-120deg]" />;
};
