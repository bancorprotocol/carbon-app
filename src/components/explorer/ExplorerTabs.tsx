import { useExplorerParams } from './useExplorerParams';
import { useRouterState } from 'libs/routing';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { StrategyFilterSort } from 'components/strategies/overview/StrategyFilterSort';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useMatchRoute } from '@tanstack/react-router';

export const ExplorerTabs = () => {
  const { strategies } = useStrategyCtx();
  const { slug, type } = useExplorerParams();

  // To support emojis in ens domains
  const { location } = useRouterState();
  const pathname = decodeURIComponent(location.pathname);

  const match = useMatchRoute();

  const showFilter = !!match({
    to: '/explorer/$type/$slug',
    params: { type, slug },
    fuzzy: true,
  });

  const tabs: StrategyTab[] = [
    {
      label: 'Overview',
      href: '/explorer/$type/$slug',
      params: { type, slug },
      icon: <IconOverview className="h-18 w-18" />,
      badge: strategies?.length || 0,
    },
    {
      label: 'Portfolio',
      href: '/explorer/$type/$slug/portfolio',
      params: { type, slug },
      icon: <IconPieChart className="h-18 w-18" />,
    },
  ];

  return (
    <div className="flex items-center justify-between gap-16">
      <StrategyPageTabs currentPathname={pathname} tabs={tabs} />
      {showFilter && <StrategyFilterSort />}
    </div>
  );
};
