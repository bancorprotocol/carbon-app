import { Activity } from 'libs/queries/extApi/activity';
import { toArray } from 'utils/helpers';

export interface ActivitySearchParams {
  pair: string[];
  strategyId: string[];
  action: string[];
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

export const activitySchema = {
  pair: toArray([]),
  action: toArray([]),
  strategyId: toArray([]),
};

export const filterActivity = (
  list: Activity[],
  searchParams: ActivitySearchParams
) => {
  const { action, pair } = searchParams;
  return list.filter((activity) => {
    if (action.length && !action.includes(activity.action)) return false;
    if (pair.length) {
      const base = activity.strategy.base.address.toLowerCase();
      const quote = activity.strategy.quote.address.toLowerCase();
      if (!pair.includes(base) || pair.includes(quote)) return false;
    }
    return true;
  });
};
