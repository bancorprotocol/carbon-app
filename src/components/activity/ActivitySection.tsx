import { Activity } from 'libs/queries/extApi/activity';
import { ActivityTable } from './ActivityTable';
import { ActivityFilter, ActivityFilterProps } from './ActivityFilter';
import { useList } from 'hooks/useList';
import { FC } from 'react';

export const ActivitySection: FC<ActivityFilterProps> = (props) => {
  const { list: activities } = useList<Activity>();
  return (
    <section className="rounded bg-background-900">
      <header className="flex items-center px-20 py-24">
        <h2>Activity</h2>
        <ActivityFilter {...props} />
      </header>
      <ActivityTable activities={activities} />
    </section>
  );
};
