import { useRouterState, useMatchRoute, useSearch } from 'libs/routing';
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
  const strategies = useStrategyCtx();
  const { search } = useSearch({ from: '/explore' });

  // To support emojis in ens domains
  const { location } = useRouterState();
  const pathname = decodeURIComponent(location.pathname);

  const match = useMatchRoute();

  const isOverview = !!match({
    to: '/explore',
  });

  const tabs: StrategyTab[] = [
    {
      label: 'Strategies',
      href: '/explore',
      search: { search },
      icon: <IconOverview className="size-18" />,
      badge: strategies?.length || 0,
    },
    {
      label: 'Distribution',
      href: '/explore/strategies',
      search: { search },
      icon: <IconPieChart className="size-18" />,
    },
    {
      label: 'Activity',
      href: '/explore/activity',
      search: { search },
      icon: <IconActivity className="size-18" />,
    },
  ];

  return (
    <div className="flex flex-col flex-wrap justify-between gap-16 md:flex-row md:items-center">
      <StrategyPageTabs />
      {isOverview && <StrategyFilterSort />}
      {isOverview && <StrategySelectLayout from="explorer" />}
    </div>
  );
};
