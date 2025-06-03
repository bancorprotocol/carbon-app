import { ChangeEvent, FC } from 'react';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Activity, ActivityAction } from 'libs/queries/extApi/activity';
import { Link, NewTabLink } from 'libs/routing';
import { cn, getLowestBits, shortenString, tokenAmount } from 'utils/helpers';
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
import {
  activityActionName,
  activityDateFormatter,
  activityDescription,
  activityKey,
  budgetColor,
} from './utils';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { ActivityListProps } from './ActivityList';
import { NotFound } from 'components/common/NotFound';
import { useActivity, useActivityPagination } from './ActivityProvider';
import style from './ActivityTable.module.css';

const thStyle = cn(
  'text-14 text-start font-weight-400 py-16 pl-8 whitespace-nowrap',
  'first:pl-24',
  'last:pr-24 last:text-end',
);
const tdFirstLine = cn(
  'pt-12 align-bottom whitespace-nowrap pl-8',
  'first:pl-24',
  'last:pr-24 last:text-end',
);
const tdSecondLine = cn(
  'pb-12 align-top whitespace-nowrap pl-8',
  'last:pr-24 last:text-end',
);

export const ActivityTable: FC<ActivityListProps> = (props) => {
  const { activities, hideIds = false } = props;
  return (
    <table className={cn('w-full border-collapse', style.table)}>
      <thead>
        <tr className="border-background-800 text-14 border-y text-white/60">
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
        {activities.length === 0 ? (
          <ActivityEmpty />
        ) : (
          activities.map((activity, i) => (
            <ActivityRow
              key={activityKey(activity, i)}
              activity={activity}
              hideIds={hideIds}
              index={i}
            />
          ))
        )}
      </tbody>
      <tfoot>
        <ActivityPaginator />
      </tfoot>
    </table>
  );
};

const ActivityEmpty = () => (
  <tr>
    <td className="py-24 text-center" colSpan={6}>
      <NotFound
        variant="error"
        title="There are no results for your filter"
        text="Please reset your filters or try a different date range."
      />
    </td>
  </tr>
);

interface ActivityRowProps {
  activity: Activity;
  hideIds: boolean;
  index: number;
}
const ActivityRow: FC<ActivityRowProps> = ({ activity, hideIds, index }) => {
  const { searchParams, setSearchParams } = useActivity();
  const { strategy, changes } = activity;
  const { base, quote } = strategy;
  const setAction = () => {
    const actions = searchParams.actions?.includes(activity.action)
      ? []
      : [activity.action];
    setSearchParams({ actions });
  };
  return (
    <>
      <tr className="text-14" style={{ animationDelay: `${index * 50}ms` }}>
        {!hideIds && (
          <td rowSpan={2} className="py-12 pl-8 first:pl-24">
            <ActivityId activity={activity} size={14} />
          </td>
        )}
        <td rowSpan={2} className="py-12 pl-8 first:pl-24">
          <button onClick={setAction}>
            <ActivityIcon activity={activity} size={32} />
          </button>
        </td>
        <td className={cn(tdFirstLine, 'font-weight-500')}>
          <button onClick={setAction} className="w-full text-start">
            {activityActionName[activity.action]}
          </button>
        </td>
        <td className={tdFirstLine}>
          {tokenAmount(strategy.buy.budget, quote)}
        </td>
        <td className={tdFirstLine}>
          {tokenAmount(strategy.sell.budget, base)}
        </td>
        <td className={tdFirstLine}>
          {activityDateFormatter.format(activity.date)}
        </td>
      </tr>
      <tr
        className="text-12 text-white/60"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* ID */}
        {/* Action Icon */}
        <td className={cn(tdSecondLine, 'w-full')}>
          <button onClick={setAction} className="w-full text-start">
            <p className="whitespace-normal">{activityDescription(activity)}</p>
          </button>
        </td>
        <td className={tdSecondLine}>
          <BudgetChange budget={changes?.buy?.budget} token={quote} />
        </td>
        <td className={tdSecondLine}>
          <BudgetChange budget={changes?.sell?.budget} token={base} />
        </td>
        <td className={tdSecondLine}>
          <p className="flex justify-end gap-8 align-bottom">
            {shortenString(activity.txHash)}
            <TransactionLink txHash={activity.txHash} className="h-14" />
          </p>
        </td>
      </tr>
    </>
  );
};

interface ActivityIdProps {
  activity: Activity;
  size: number;
}
export const ActivityId: FC<ActivityIdProps> = ({ activity, size }) => {
  const { id, base, quote } = activity.strategy;
  return (
    <Link
      to="/strategy/$id"
      params={{ id: id }}
      className="bg-background-800 inline-flex items-center gap-4 rounded-full px-8 py-4"
    >
      <span className={`text-${size}`}>{getLowestBits(id)}</span>
      <TokensOverlap tokens={[base, quote]} size={size + 2} />
    </Link>
  );
};

interface ActivityIconProps {
  activity: { action: ActivityAction };
  size: number;
  className?: string;
}
export const ActivityIcon: FC<ActivityIconProps> = (props) => {
  const { activity, className, size } = props;
  const classes = cn(
    'grid place-items-center rounded-full',
    iconColor(activity.action),
    `size-${size}`,
    className,
  );
  return (
    <div className={classes}>
      <ActionIcon action={activity.action} size={size - 16} />
    </div>
  );
};

interface TransactionLinkProps {
  txHash: string;
  className: string;
}
export const TransactionLink: FC<TransactionLinkProps> = (props) => {
  const { txHash, className } = props;
  return (
    <NewTabLink
      aria-label="See transaction on block explorer"
      to={getExplorerLink('tx', txHash)}
    >
      <IconLink className={cn('text-white', className)} />
    </NewTabLink>
  );
};

interface BudgetChangeProps {
  budget?: string;
  token: Token;
}
export const BudgetChange: FC<BudgetChangeProps> = ({ budget, token }) => {
  if (!budget) return '...';
  const value = new SafeDecimal(budget);
  const text = value.isNegative()
    ? tokenAmount(budget, token)
    : `+${tokenAmount(budget, token)}`;
  return <p className={budgetColor(budget)}>{text}</p>;
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
  } = useActivityPagination();

  const changeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  return (
    <tr className="border-background-800 text-14 border-t text-white/80">
      <td className="px-24 py-16" colSpan={3}>
        <div className="flex items-center gap-8">
          <label>Show results</label>
          <select
            className="border-background-800 bg-background-900 rounded-full border-2 px-12 py-8"
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
        <div role="group" className="flex justify-end gap-8">
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
            <IconChevronLeft className="size-12" />
          </button>
          <p
            className="border-background-800 flex gap-8 rounded-full border-2 px-12 py-8"
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
            <IconChevronLeft className="size-12 rotate-180" />
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
  size: string | number;
}
export const iconColor = (action: ActivityAction) => {
  if (action === 'buy') return `bg-buy/10 text-buy`;
  if (action === 'sell') return `bg-sell/10 text-sell`;
  if (action === 'create') return `bg-success/10 text-success`;
  if (action === 'delete') return `bg-error/10 text-error`;
  return `bg-white/10 text-white`;
};

export const ActionIcon: FC<ActionIconProps> = ({ action, size }) => {
  const className = `size-${size}`;
  if (action === 'create') return <IconCheck className={className} />;
  if (action === 'transfer') return <IconTransfer className={className} />;
  if (action === 'edit') return <IconEdit className={className} />;
  if (action === 'delete') return <IconDelete className={className} />;
  if (action === 'pause') return <IconPause className={className} />;
  if (action === 'deposit') return <IconDeposit className={className} />;
  if (action === 'withdraw') return <IconWithdraw className={className} />;
  if (action === 'buy')
    return <IconArrowDown className={cn('rotate-[-60deg]', className)} />;
  return <IconArrowDown className={cn('rotate-[-120deg]', className)} />;
};
