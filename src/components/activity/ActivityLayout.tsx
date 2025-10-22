import { FC } from 'react';
import { ActivityFilter, ActivityFilterProps } from './ActivityFilter';
import { ActivityExport } from './ActivityExport';
import { ActivityCountDown } from './ActivityCountDown';
import { ActivitySection } from './ActivitySection';

export const ActivityLayout: FC<ActivityFilterProps> = (props) => {
  const { filters = [] } = props;
  return (
    <>
      <header className="grid-area-[filters] sm:place-self-end grid md:grid-flow-col gap-16">
        <ActivityFilter
          filters={filters}
          className="grid justify-stretch sm:grid-flow-col gap-8"
        />
        <div className="flex items-center gap-8 justify-self-end">
          <ActivityExport />
          <ActivityCountDown time={30} />
        </div>
      </header>
      <ActivitySection hideIds={!filters.includes('ids')} />
    </>
  );
};
