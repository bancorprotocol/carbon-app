import { Activity } from 'libs/queries/extApi/activity';
import { GroupSchema, toArray, toDate } from 'utils/helpers';

export interface ActivitySearchParams {
  pairs: string[];
  strategyIds: string[];
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
  strategyIds: toArray([]),
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
  const { actions, pairs } = searchParams;
  return list.filter((activity) => {
    if (actions.length && !actions.includes(activity.action)) return false;
    if (!activityHasPairs(activity, pairs)) return false;
    return true;
  });
};
