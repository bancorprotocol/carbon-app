import { FC } from 'react';
import { Activity } from 'libs/queries/extApi/activity';
import { ActivityTable } from './ActivityTable';
import { ActivityFilter, ActivityFilterProps } from './ActivityFilter';
import { useList } from 'hooks/useList';
import { ActivityCountDown, useCountDown } from './ActivityCountDown';
import { ActivityList } from './ActivityList';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { ActivityExport } from './ActivityExport';

export const ActivitySection: FC<ActivityFilterProps> = ({ filters = [] }) => {
  const { list: activities, all: allActivities } = useList<Activity>();
  const { aboveBreakpoint } = useBreakpoints();
  const count = useCountDown(30, [allActivities]);

  return (
    <section className="rounded bg-background-900">
      <header className="grid grid-cols-[auto_1fr] gap-16 px-20 py-24 md:grid-cols-[auto_1fr_auto]">
        <h2 className="row-start-1">Activity</h2>
        <ActivityFilter
          filters={filters}
          className="col-span-2 row-start-2 md:col-auto md:row-start-1"
        />
        <div className="row-start-1 flex gap-8 self-start justify-self-end">
          <ActivityExport activities={allActivities} />
          <ActivityCountDown time={10} count={count} />
        </div>
      </header>
      {aboveBreakpoint('md') ? (
        <ActivityTable
          activities={activities}
          hideIds={!filters.includes('ids')}
        />
      ) : (
        <ActivityList
          activities={activities}
          hideIds={!filters.includes('ids')}
        />
      )}
    </section>
  );
};
