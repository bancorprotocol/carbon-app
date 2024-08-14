import { FC } from 'react';
import { ActivityTable } from './ActivityTable';
import { ActivityList } from './ActivityList';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useActivity } from './ActivityProvider';
import { NotFound } from 'components/common/NotFound';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useRouterState } from '@tanstack/react-router';

interface SectionProps {
  hideIds?: boolean;
}

const emptyTexts = {
  '/trade': 'Try selecting a different token pair or reset your filters.',
  '/explorer':
    'Try entering a different wallet address, selecting another token pair, or resetting your filters.',
  '/strategies': "We couldn't find any activities",
};

const getEmptyText = (pathname: string) => {
  for (const [key, value] of Object.entries(emptyTexts)) {
    if (pathname.startsWith(key)) return value;
  }
  return emptyTexts['/explorer'];
};

export const ActivitySection: FC<SectionProps> = ({ hideIds }) => {
  const { activities, status } = useActivity();
  const { location } = useRouterState();
  const { aboveBreakpoint } = useBreakpoints();
  if (status === 'pending') {
    return (
      <div className="grid place-items-center md:min-h-[600px]">
        <CarbonLogoLoading className="h-[80px]" />
      </div>
    );
  }
  if (!activities.length) {
    return (
      <NotFound
        variant="error"
        title="We couldn't find any activities"
        text={getEmptyText(location.pathname)}
      />
    );
  }
  if (aboveBreakpoint('md')) {
    return <ActivityTable activities={activities} hideIds={hideIds} />;
  }
  return <ActivityList activities={activities} hideIds={hideIds} />;
};
