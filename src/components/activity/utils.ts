import { Activity } from 'libs/queries/extApi/activity';
import { GroupSchema, toArray } from 'utils/helpers';

export interface ActivitySearchParams {
  pairs: string[];
  strategyIds: string[];
  actions: string[];
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
};

export const filterActivity = (
  list: Activity[],
  searchParams: ActivitySearchParams
) => {
  const { actions, pairs } = searchParams;
  return list.filter((activity) => {
    if (actions.length && !actions.includes(activity.action)) return false;
    if (pairs.length) {
      const base = activity.strategy.base.address.toLowerCase();
      const quote = activity.strategy.quote.address.toLowerCase();
      if (!pairs.includes(base) || pairs.includes(quote)) return false;
    }
    return true;
  });
};
