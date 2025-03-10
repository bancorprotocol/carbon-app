import { FC } from 'react';
import { ActivityFilter, ActivityFilterProps } from './ActivityFilter';
import { ActivityExport } from './ActivityExport';
import { ActivityCountDown } from './ActivityCountDown';
import { ActivitySection } from './ActivitySection';

export const ActivityLayout: FC<ActivityFilterProps> = (props) => {
  const { filters = [] } = props;
  return (
    <section className="bg-background-900 rounded">
      <header className="grid grid-cols-[auto_1fr] gap-16 px-20 pb-12 pt-16 md:grid-cols-[auto_1fr_auto]">
        <h2 className="text-16 row-start-1 m-0 self-center">Activity</h2>
        <ActivityFilter
          filters={filters}
          className="col-span-2 row-start-2 md:col-auto md:row-start-1"
        />
        <div className="row-start-1 flex items-center gap-8 self-start justify-self-end">
          <ActivityExport />
          <ActivityCountDown time={30} />
        </div>
      </header>
      <ActivitySection hideIds={!filters.includes('ids')} />
    </section>
  );
};
