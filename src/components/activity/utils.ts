import { Activity, ActivityAction } from 'libs/queries/extApi/activity';
import {
  InferSearch,
  searchValidator,
  validArrayOf,
  validNumberType,
  validString,
} from 'libs/routing/utils';
import { SafeDecimal } from 'libs/safedecimal';
import {
  prettifyNumber,
  shortenString,
  tokenAmount,
  tokenRange,
} from 'utils/helpers';
import { exist } from 'utils/helpers/operators';
import * as v from 'valibot';

export const activityActionName: Record<ActivityAction, string> = {
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
export const activityActions = Object.keys(
  activityActionName,
) as ActivityAction[];

export type ActivitySearchParams = InferSearch<typeof activityValidators>;
export const activityValidators = {
  actions: v.optional(validArrayOf(v.picklist(activityActions))),
  ids: v.optional(validArrayOf(validString)),
  pairs: v.optional(validArrayOf(validString)),
  start: v.optional(validString),
  end: v.optional(validString),
  limit: v.optional(validNumberType, 10),
  offset: v.optional(validNumberType, 0),
};
export const validateActivityParams = searchValidator(activityValidators);

export const activityHasPairs = (activity: Activity, pairs: string[] = []) => {
  if (pairs.length === 0) return true;
  const base = activity.strategy.base.address.toLowerCase();
  const quote = activity.strategy.quote.address.toLowerCase();
  return pairs.some((pair) => pair.includes(base) && pair.includes(quote));
};

export const activityKey = (activity: Activity, i: number) => {
  return `${activity.txHash}-${activity.action}-${i}`;
};

export const activityDateFormatter = new Intl.DateTimeFormat(undefined, {
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
      const sellRange = tokenRange(sell.min, sell.max, quote);
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
      return `${amounts} was withdrawn from the strategy.`;
    }
    case 'buy': {
      const buy = abs(changes?.buy?.budget ?? 0);
      const sell = abs(changes?.sell?.budget ?? 0);
      const bought = tokenAmount(sell, base);
      const sold = tokenAmount(buy, quote);
      const price = prettifyNumber(buy / sell);
      return `${bought} was bought for ${sold}. Avg price: ${price} ${quote.symbol}/${base.symbol}.`;
    }
    case 'sell': {
      const buy = abs(changes?.buy?.budget ?? 0);
      const sell = abs(changes?.sell?.budget ?? 0);
      const sold = tokenAmount(sell, base);
      const bought = tokenAmount(buy, quote);
      const price = prettifyNumber(buy / sell);
      return `${sold} was sold for ${bought}. Avg price: ${price} ${quote.symbol}/${base.symbol}.`;
    }
    case 'transfer': {
      const from = shortenString(strategy.owner);
      const to = shortenString(changes!.owner!);
      return `Strategy was transferred from ${from} to ${to}.`;
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
