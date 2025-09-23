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
import { shortenString, tokenAmount } from 'utils/helpers';
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
    <li className="border-background-800 flex flex-col gap-16 rounded-2xl border bg-black-gradient">
      <header className="flex px-16 pt-16 items-center">
        {!hideIds && <ActivityId activity={activity} size={12} />}
        <div className="grid text-12 ml-auto">
          <p className="text-white/80">
            {activityDateFormatter.format(activity.date)}
          </p>
          <p className="flex gap-8 items-center text-white/60">
            <span>{shortenString(activity.txHash)}</span>
            <TransactionLink txHash={activity.txHash} className="h-16" />
          </p>
        </div>
      </header>
      <section className="px-16">
        <button
          onClick={setAction}
          className="text-start flex gap-8 items-center"
        >
          <ActivityIcon activity={activity} size={36} className="p-8" />
          <hgroup className="grid">
            <h3>{activityActionName[activity.action]}</h3>
            <p className="text-12 text-white/60">
              {activityDescription(activity)}
            </p>
          </hgroup>
        </button>
      </section>
      <hr className="border-background-700 mx-8" />
      <table className="w-full table-fixed">
        <thead>
          <tr className="text-12 text-white/60">
            <th className="font-normal px-24">Buy Budget</th>
            <th className="font-normal px-24">Sell Budget</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-14">
            <td className="px-24">{tokenAmount(strategy.buy.budget, quote)}</td>
            <td className="px-24">{tokenAmount(strategy.sell.budget, base)}</td>
          </tr>
          <tr className="text-12">
            <td className="px-24 pb-24">
              <BudgetChange budget={changes?.buy?.budget} token={quote} />
            </td>
            <td className="px-24 pb-24">
              <BudgetChange budget={changes?.sell?.budget} token={base} />
            </td>
          </tr>
        </tbody>
      </table>
    </li>
  );
};
