import { FC } from 'react';
import { Activity } from 'libs/queries/extApi/activity';
import {
  activityActionName,
  activityDateFormatter,
  activityDescription,
  activityKey,
} from './utils';
import {
  ActivityIcon,
  ActivityId,
  BudgetChange,
  TransactionLink,
} from './ActivityTable';
import { tokenAmount } from 'utils/helpers';
import { Button } from 'components/common/button';
import { useActivity, useActivityPagination } from './ActivityProvider';

export interface ActivityListProps {
  activities: Activity[];
  hideIds?: boolean;
}

export const ActivityList: FC<ActivityListProps> = (props) => {
  const { activities, hideIds = false } = props;
  const { size, limit, setLimit } = useActivityPagination();
  return (
    <>
      <ul className="flex flex-col gap-16 p-16">
        {activities.map((activity, i) => (
          <ActivityItem
            key={activityKey(activity, i)}
            activity={activity}
            hideIds={hideIds}
          />
        ))}
      </ul>
      {limit < size && (
        <>
          <p className="text-12 mb-16 text-center text-white/60">
            {limit} / {size}
          </p>
          <Button
            fullWidth
            variant="success"
            onClick={() => setLimit(limit + 10)}
          >
            Show 10 More
          </Button>
        </>
      )}
    </>
  );
};

interface ActivityItemProps {
  activity: Activity;
  hideIds: boolean;
}
const ActivityItem: FC<ActivityItemProps> = ({ activity, hideIds }) => {
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
    <li className="border-background-800 flex flex-col gap-16 rounded border-2">
      <header className="flex px-16 pt-16">
        {!hideIds && <ActivityId activity={activity} size={12} />}
        <p className="text-12 flex flex-1 items-center justify-end gap-8 text-white/60">
          {activityDateFormatter.format(activity.date)}
          <TransactionLink txHash={activity.txHash} className="h-16" />
        </p>
      </header>
      <section className="px-16">
        <button onClick={setAction} className="text-start">
          <h3 className="mb-8 flex items-center gap-8">
            <ActivityIcon activity={activity} size={24} />
            {activityActionName[activity.action]}
          </h3>
          <p className="text-12 text-white/60">
            {activityDescription(activity)}
          </p>
        </button>
      </section>
      <hr className="border-background-800" />
      <table className="w-full table-fixed">
        <thead>
          <tr className="text-12 text-white/60">
            <th className="font-weight-400 px-16">Buy Budget</th>
            <th className="font-weight-400 px-16">Sell Budget</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-14">
            <td className="px-16">{tokenAmount(strategy.buy.budget, quote)}</td>
            <td className="px-16">{tokenAmount(strategy.sell.budget, base)}</td>
          </tr>
          <tr className="text-12">
            <td className="px-16 pb-16">
              <BudgetChange budget={changes?.buy?.budget} token={quote} />
            </td>
            <td className="px-16 pb-16">
              <BudgetChange budget={changes?.sell?.budget} token={base} />
            </td>
          </tr>
        </tbody>
      </table>
    </li>
  );
};
