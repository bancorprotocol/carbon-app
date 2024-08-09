import { FC, ReactNode } from 'react';
import { ActivityTable } from './ActivityTable';
import { ActivityFilter, ActivityFilterProps } from './ActivityFilter';
import { ActivityCountDown } from './ActivityCountDown';
import { ActivityList } from './ActivityList';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { ActivityExport } from './ActivityExport';
import { useActivity } from './ActivityProvider';
import { NotFound } from 'components/common/NotFound';

interface LayoutProps extends ActivityFilterProps {
  children: ReactNode;
}
const ActivityLayout: FC<LayoutProps> = (props) => {
  const { filters = [], children } = props;
  return (
    <section className="bg-background-900 rounded">
      <header className="grid grid-cols-[auto_1fr] gap-16 px-20 py-24 md:grid-cols-[auto_1fr_auto]">
        <h2 className="row-start-1">Activity</h2>
        <ActivityFilter
          filters={filters}
          className="col-span-2 row-start-2 md:col-auto md:row-start-1"
        />
        <div className="row-start-1 flex items-center gap-8 self-start justify-self-end">
          <ActivityExport />
          <ActivityCountDown time={30} />
        </div>
      </header>
      {children}
    </section>
  );
};

interface SectionProps extends ActivityFilterProps {
  empty?: ReactNode;
}
export const ActivitySection: FC<SectionProps> = ({ filters = [], empty }) => {
  const { activities } = useActivity();
  const { aboveBreakpoint } = useBreakpoints();
  if (!activities.length) {
    if (empty) return empty;
    return (
      <ActivityLayout filters={filters}>
        <NotFound
          variant="error"
          title="We couldn't find any activities"
          text="Try entering a different wallet address or choose a different token pair."
        />
      </ActivityLayout>
    );
  }
  return (
    <ActivityLayout filters={filters}>
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
    </ActivityLayout>
  );
};
