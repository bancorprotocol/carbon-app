import { FC, ReactNode } from 'react';
import { ActivityTable } from './ActivityTable';
import { ActivityFilterProps } from './ActivityFilter';
import { ActivityList } from './ActivityList';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useActivity } from './ActivityProvider';
import { NotFound } from 'components/common/NotFound';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

interface SectionProps extends ActivityFilterProps {
  empty?: ReactNode;
}
export const ActivitySection: FC<SectionProps> = ({ filters = [], empty }) => {
  const { activities, status } = useActivity();
  const { aboveBreakpoint } = useBreakpoints();
  if (status === 'pending') {
    return (
      <div className="grid place-items-center md:min-h-[600px]">
        <CarbonLogoLoading className="h-[80px]" />
      </div>
    );
  }
  if (!activities.length) {
    if (empty) return empty;
    return (
      <NotFound
        variant="error"
        title="We couldn't find any activities"
        text="Try entering a different wallet address or choose a different token pair."
      />
    );
  }
  if (aboveBreakpoint('md')) {
    return (
      <ActivityTable
        activities={activities}
        hideIds={!filters.includes('ids')}
      />
    );
  }
  return (
    <ActivityList activities={activities} hideIds={!filters.includes('ids')} />
  );
};
