import { useRouterState, useMatchRoute, useParams } from 'libs/routing';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconActivity } from 'assets/icons/activity.svg';
import { StrategyFilterSort } from 'components/strategies/overview/StrategyFilterSort';
import { useStrategyCtx } from 'hooks/useStrategies';
import { StrategySelectLayout } from 'components/strategies/StrategySelectLayout';

export const ExplorerTabs = () => {
  const { filteredStrategies } = useStrategyCtx();
  const { slug } = useParams({ from: '/explore/$slug' });

  // To support emojis in ens domains
  const { location } = useRouterState();
  const pathname = decodeURIComponent(location.pathname);

  const match = useMatchRoute();

  const isOverview = !!match({
    to: '/explore/$slug',
    params: { slug },
  });

  const tabs: StrategyTab[] = [
    {
      label: 'Strategies',
      href: '/explore/$slug',
      params: { slug },
      icon: <IconOverview className="size-18" />,
      badge: filteredStrategies?.length || 0,
    },
    {
      label: 'Distribution',
      href: '/explore/$slug/portfolio',
      params: { slug },
      icon: <IconPieChart className="size-18" />,
    },
    {
      label: 'Activity',
      href: '/explore/$slug/activity',
      params: { slug },
      icon: <IconActivity className="size-18" />,
    },
  ];

  return (
    <div className="flex flex-col flex-wrap justify-between gap-16 md:flex-row md:items-center">
      <StrategyPageTabs currentPathname={pathname} tabs={tabs} />
      {isOverview && <StrategyFilterSort />}
      {isOverview && <StrategySelectLayout from="explorer" />}
    </div>
  );
};
