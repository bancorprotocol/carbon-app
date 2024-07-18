import { FC } from 'react';
import { ActivityTable } from './ActivityTable';
import { ActivityFilter, ActivityFilterProps } from './ActivityFilter';
import { ActivityCountDown } from './ActivityCountDown';
import { ActivityList } from './ActivityList';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { ActivityExport } from './ActivityExport';
import { useActivity } from './ActivityProvider';

export const ActivitySection: FC<ActivityFilterProps> = ({ filters = [] }) => {
  const { activities } = useActivity();
  const { aboveBreakpoint } = useBreakpoints();
  return (
    <section className="bg-background-900 rounded">
      <header className="grid grid-cols-[auto_1fr] gap-16 px-20 py-24 md:grid-cols-[auto_1fr_auto]">
        <h2 className="row-start-1">Activity</h2>
        <ActivityFilter
          filters={filters}
          className="col-span-2 row-start-2 md:col-auto md:row-start-1"
        />
        <div className="row-start-1 flex items-center gap-8 self-start justify-self-end">
          <ActivityExport activities={activities} />
          <ActivityCountDown time={30} />
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
