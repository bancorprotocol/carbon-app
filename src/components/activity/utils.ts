import { PaginationParams } from 'hooks/useList';
import { Activity, ActivityAction } from 'libs/queries/extApi/activity';
import {
  SearchParamsValidator,
  validArrayOf,
  validLiteral,
  validNumber,
  validString,
  validateSearchParams,
} from 'libs/routing/utils';
import { SafeDecimal } from 'libs/safedecimal';
import {
  prettifyNumber,
  shortenString,
  tokenAmount,
  tokenRange,
} from 'utils/helpers';
import { exist } from 'utils/helpers/operators';

export interface ActivitySearchParams extends Partial<PaginationParams> {
  pairs?: string[];
  ids?: string[];
  actions?: ActivityAction[];
  start?: Date;
  end?: Date;
  // This is only for StrategyPageParams, but if I don't implement it here the build breaks
  priceStart?: string;
  priceEnd?: string;
  hideIndicators?: boolean;
}
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
  activityActionName
) as ActivityAction[];

export const activityValidators: SearchParamsValidator<ActivitySearchParams> = {
  actions: validArrayOf(validLiteral(activityActions)),
  ids: validArrayOf(validString),
  pairs: validArrayOf(validString),
  start: validString,
  end: validString,
  limit: validNumber,
  offset: validNumber,
};
export const validateActivityParams = (
  activityValidators: SearchParamsValidator<ActivitySearchParams>
) => {
  return (search: Record<string, string>): ActivitySearchParams => {
    const rawSearch = validateSearchParams(activityValidators)(search);
    const limit = Number(rawSearch.limit ?? 10);
    const offset = Number(rawSearch.offset ?? 0);
    return {
      ...rawSearch,
      limit,
      offset,
    };
  };
};

export const activityHasPairs = (activity: Activity, pairs: string[] = []) => {
  if (pairs.length === 0) return true;
  const base = activity.strategy.base.address.toLowerCase();
  const quote = activity.strategy.quote.address.toLowerCase();
  return pairs.some((pair) => pair.includes(base) && pair.includes(quote));
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
      return `Strategy was transferred to a ${shortenString(changes!.owner!)}.`;
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
