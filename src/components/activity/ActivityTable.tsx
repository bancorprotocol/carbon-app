import { ChangeEvent, FC } from 'react';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Activity, ActivityAction } from 'libs/queries/extApi/activity';
import { NewTabLink } from 'libs/routing';
import {
  cn,
  getLowestBits,
  prettifyNumber,
  shortAddress,
  tokenAmount,
  tokenRange,
} from 'utils/helpers';
import { exist } from 'utils/helpers/operators';
import { getExplorerLink } from 'utils/blockExplorer';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';
import { ReactComponent as IconEdit } from 'assets/icons/edit.svg';
import { ReactComponent as IconArrowDown } from 'assets/icons/arrowDown.svg';
import { ReactComponent as IconDelete } from 'assets/icons/delete.svg';
import { ReactComponent as IconTransfer } from 'assets/icons/transfer.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { activityActionName } from './utils';
import { usePagination } from 'hooks/useList';
import { SafeDecimal } from 'libs/safedecimal';

interface Props {
  activities: Activity[];
}

export const ActivityTable: FC<Props> = ({ activities }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-y border-background-800 font-mono text-14 text-white/60">
          <th className="px-24 py-16 text-start font-weight-400">ID</th>
          <th className="text-start font-weight-400" colSpan={2}>
            Action
          </th>
          <th className="text-start font-weight-400">Buy Budget</th>
          <th className="text-start font-weight-400">Sell Budget</th>
          <th className="px-24 py-16 text-end font-weight-400">Date</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity, i) => {
          const key = `${activity.txHash}-${activity.action}-${i}`;
          return <ActivityRow key={key} activity={activity} />;
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
  return new SafeDecimal(budget).isPositive() ? 'text-buy' : 'text-buy';
};
interface ActivityRowProps {
  activity: Activity;
}
const ActivityRow: FC<ActivityRowProps> = ({ activity }) => {
  const { strategy, changes } = activity;
  const { base, quote } = strategy;
  const date = new Date(activity.date).toLocaleDateString('en', dateOptions);
  return (
    <>
      <tr className="text-14">
        <td rowSpan={2} className="px-24 py-12">
          <div className="inline-flex items-center gap-8 rounded-full bg-background-800 p-8">
            <span className="lineHeight-4">{getLowestBits(strategy.id)}</span>
            <TokensOverlap className="h-16" tokens={[base, quote]} />
          </div>
        </td>
        <td rowSpan={2} className="py-12">
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
        <td className="px-24 pt-12 text-end align-bottom font-mono">{date}</td>
      </tr>
      <tr className="font-mono text-12 text-white/60">
        {/* ID */}
        {/* Action Icon */}
        <td className="pb-12 align-top">{activityDescription(activity)}</td>
        <td className={cn('pb-12 align-top', budgetColor(changes.buy?.budget))}>
          {tokenAmount(changes.buy?.budget, base) || '...'}
        </td>
        <td className={cn('pb-12 align-top', budgetColor(changes.buy?.budget))}>
          {tokenAmount(changes.sell?.budget, quote) || '...'}
        </td>
        <td className="px-24 pb-12 align-top">
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

const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});
const activityDescription = (activity: Activity) => {
  const { strategy, changes } = activity;
  const { base, quote } = strategy;
  switch (activity.action) {
    case 'create':
    case 'editPrice': {
      const { buy, sell } = strategy;
      const buyRange = tokenRange(buy.min, buy.max, quote);
      const sellRange = tokenRange(sell.min, sell.max, base);
      return `Buy ${base.symbol}: ${buyRange} / Sell ${base.symbol}: ${sellRange}.`;
    }
    case 'deposit': {
      const buy = changes.buy?.budget && tokenAmount(changes.buy.budget, quote);
      const sell =
        changes.sell?.budget && tokenAmount(changes.sell.budget, base);
      const amounts = formatter.format([buy, sell].filter(exist));
      return `${amounts} was deposited to the strategy.`;
    }
    case 'withdraw': {
      const buy = changes.buy?.budget && tokenAmount(changes.buy.budget, quote);
      const sell =
        changes.sell?.budget && tokenAmount(changes.sell.budget, base);
      const amounts = formatter.format([buy, sell].filter(exist));
      return `${amounts} was withdrawn to the wallet.`;
    }
    case 'buy': {
      // TODO: understand in which case changes.buy is undefined
      const buy = Number(changes.buy?.budget ?? 0);
      const sell = Number(changes.sell?.budget ?? 0);
      const bought = tokenAmount(buy, quote);
      const gained = tokenAmount(sell, base);
      const price = prettifyNumber(buy / sell);
      return `${bought} was bought for ${gained}. Avg price: ${price} ${quote.symbol}/${base.symbol}.`;
    }
    case 'sell': {
      const buy = Number(changes.buy?.budget ?? 0);
      const sell = Number(changes.sell?.budget ?? 0);
      const sold = tokenAmount(sell, quote);
      const gained = tokenAmount(buy, base);
      const price = prettifyNumber(sell / buy);
      return `${sold} was sold for ${gained}. Avg price: ${price} ${base.symbol}/${quote.symbol}.`;
    }
    case 'transfer': {
      return `Strategy was transferred to a ${shortAddress(changes.owner!)}.`;
    }
    case 'delete': {
      return 'Strategy was deleted.';
    }
    case 'pause': {
      return 'The strategy was paused.';
    }
    default: {
      return 'Unknown action';
    }
  }
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
  if (action === 'deposit') return <IconArrowDown className="h-16 w-16" />;
  if (action === 'withdraw')
    return <IconArrowDown className="h-16 w-16 rotate-180" />;
  if (action === 'buy')
    return <IconArrowDown className="rotate-120 h-16 w-16" />;
  return <IconArrowDown className="rotate-60 h-16 w-16" />;
};
