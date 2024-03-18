import { Activity } from 'libs/queries/extApi/activity';
import {
  GroupSchema,
  getLowestBits,
  prettifyNumber,
  shortAddress,
  toArray,
  toDate,
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
  editPrice: 'Edit Price',
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
  start: toDate(),
  end: toDate(),
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

const listFormatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});
const abs = (num: string | number) => Math.abs(Number(num));
export const activityDescription = (activity: Activity) => {
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
      const buy = tokenAmount(abs(changes.buy?.budget ?? 0), quote);
      const sell = tokenAmount(abs(changes.sell?.budget ?? 0), base);
      const amounts = listFormatter.format([buy, sell].filter(exist));
      return `${amounts} was deposited to the strategy.`;
    }
    case 'withdraw': {
      const buy = tokenAmount(abs(changes.buy?.budget ?? 0), quote);
      const sell = tokenAmount(abs(changes.sell?.budget ?? 0), base);
      const amounts = listFormatter.format([buy, sell].filter(exist));
      return `${amounts} was withdrawn to the wallet.`;
    }
    case 'buy': {
      // TODO: understand in which case changes.buy is undefined
      const buy = abs(changes.buy?.budget ?? 0);
      const sell = abs(changes.sell?.budget ?? 0);
      const bought = tokenAmount(buy, quote);
      const gained = tokenAmount(sell, base);
      const price = prettifyNumber(buy / sell);
      return `${bought} was bought for ${gained}. Avg price: ${price} ${quote.symbol}/${base.symbol}.`;
    }
    case 'sell': {
      const buy = abs(changes.buy?.budget ?? 0);
      const sell = abs(changes.sell?.budget ?? 0);
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
