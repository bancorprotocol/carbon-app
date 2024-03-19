import { endOfDay, startOfDay } from 'date-fns';
import { Activity } from 'libs/queries/extApi/activity';
import { SafeDecimal } from 'libs/safedecimal';
import {
  GroupSchema,
  getLowestBits,
  prettifyNumber,
  shortAddress,
  toArray,
  tokenAmount,
  tokenRange,
} from 'utils/helpers';
import { exist } from 'utils/helpers/operators';

export interface ActivitySearchParams {
  pairs: string[];
  ids: string[];
  actions: string[];
  start?: Date;
  end?: Date;
}

export const activityActionName = {
  create: 'Create',
  edit: 'Edit Price',
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  buy: 'Buy Low',
  sell: 'Sell High',
  transfer: 'Transfer',
  delete: 'Delete',
  pause: 'Pause',
};

export const activitySchema: GroupSchema<ActivitySearchParams> = {
  pairs: toArray([]),
  actions: toArray([]),
  ids: toArray([]),
  start: (value?: string) => {
    if (!value) return;
    return startOfDay(new Date(value));
  },
  end: (value?: string) => {
    if (!value) return;
    return endOfDay(new Date(value));
  },
};

export const activityHasPairs = (activity: Activity, pairs: string[]) => {
  if (pairs.length === 0) return true;
  const base = activity.strategy.base.address.toLowerCase();
  const quote = activity.strategy.quote.address.toLowerCase();
  return pairs.some((pair) => pair.includes(base) && pair.includes(quote));
};

export const filterActivity = (
  list: Activity[],
  searchParams: ActivitySearchParams
) => {
  const { ids, actions, pairs, start, end } = searchParams;
  return list.filter((activity) => {
    if (ids.length && !ids.includes(getLowestBits(activity.strategy.id)))
      return false;
    if (actions.length && !actions.includes(activity.action)) return false;
    if (!activityHasPairs(activity, pairs)) return false;
    if (start && activity.date < start) return false;
    if (end && activity.date > end) return false;
    return true;
  });
};

export const activityKey = (activity: Activity, i: number) => {
  return `${activity.txHash}-${activity.action}-${i}`;
};

export const activityDateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const activityListFormatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});
const abs = (num: string | number) => Math.abs(Number(num));
export const activityDescription = (activity: Activity) => {
  const { strategy, changes } = activity;
  const { base, quote } = strategy;
  switch (activity.action) {
    case 'create':
    case 'edit': {
      const { buy, sell } = strategy;
      const buyRange = tokenRange(buy.min, buy.max, quote);
      const sellRange = tokenRange(sell.min, sell.max, base);
      return `Buy ${base.symbol}: ${buyRange} / Sell ${base.symbol}: ${sellRange}.`;
    }
    case 'deposit': {
      const buy = tokenAmount(abs(changes?.buy?.budget ?? 0), quote);
      const sell = tokenAmount(abs(changes?.sell?.budget ?? 0), base);
      const amounts = activityListFormatter.format([buy, sell].filter(exist));
      return `${amounts} was deposited to the strategy.`;
    }
    case 'withdraw': {
      const buy = tokenAmount(abs(changes?.buy?.budget ?? 0), quote);
      const sell = tokenAmount(abs(changes?.sell?.budget ?? 0), base);
      const amounts = activityListFormatter.format([buy, sell].filter(exist));
      return `${amounts} was withdrawn to the wallet.`;
    }
    case 'buy': {
      const buy = abs(changes?.buy?.budget ?? 0);
      const sell = abs(changes?.sell?.budget ?? 0);
      const bought = tokenAmount(buy, quote);
      const gained = tokenAmount(sell, base);
      const price = prettifyNumber(buy / sell);
      return `${bought} was bought for ${gained}. Avg price: ${price} ${quote.symbol}/${base.symbol}.`;
    }
    case 'sell': {
      const buy = abs(changes?.buy?.budget ?? 0);
      const sell = abs(changes?.sell?.budget ?? 0);
      const sold = tokenAmount(sell, quote);
      const gained = tokenAmount(buy, base);
      const price = prettifyNumber(sell / buy);
      return `${sold} was sold for ${gained}. Avg price: ${price} ${base.symbol}/${quote.symbol}.`;
    }
    case 'transfer': {
      return `Strategy was transferred to a ${shortAddress(changes!.owner!)}.`;
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

export const budgetColor = (budget?: string) => {
  if (!budget) return '';
  return new SafeDecimal(budget).isPositive() ? 'text-buy' : 'text-sell';
};
