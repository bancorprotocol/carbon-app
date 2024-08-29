import { useExplorerParams } from './useExplorerParams';
import { useRouterState, useMatchRoute } from 'libs/routing';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconActivity } from 'assets/icons/activity.svg';
import { StrategyFilterSort } from 'components/strategies/overview/StrategyFilterSort';
import { useStrategyCtx } from 'hooks/useStrategies';

export const ExplorerTabs = () => {
  const { filteredStrategies } = useStrategyCtx();
  const { slug, type } = useExplorerParams();

  // To support emojis in ens domains
  const { location } = useRouterState();
  const pathname = decodeURIComponent(location.pathname);

  const match = useMatchRoute();

  const isOverview = !!match({
    to: '/explore/$type/$slug',
    params: { type, slug },
  });

  const tabs: StrategyTab[] = [
    {
      label: 'Strategies',
      href: '/explore/$type/$slug',
      params: { type, slug },
      icon: <IconOverview className="size-18" />,
      badge: filteredStrategies?.length || 0,
    },
    {
      label: 'Distribution',
      href: '/explore/$type/$slug/portfolio',
      params: { type, slug },
      icon: <IconPieChart className="size-18" />,
    },
    {
      label: 'Activity',
      href: '/explore/$type/$slug/activity',
      params: { type, slug },
      icon: <IconActivity className="size-18" />,
    },
  ];

  return (
    <div className="flex items-center justify-between gap-16">
      <StrategyPageTabs currentPathname={pathname} tabs={tabs} />
      {isOverview && <StrategyFilterSort />}
    </div>
  );
};
